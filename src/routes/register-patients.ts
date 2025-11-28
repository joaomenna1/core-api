import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createSelectSchema } from "drizzle-zod";
import { analyses, patients, vitalSigns } from "@/db/schema";
import { db } from '@/db';
import { z } from "zod";
import { uuidv7 } from "uuidv7";
import { eq } from "drizzle-orm";

export const registerPatients: FastifyPluginAsyncZod = async (app) => {
    app.post('/api/patient', 
        {
            schema: {
                summary: "Register patient",
                tags: ['Patient'],
                body: z.object({
                    name: z.string().min(1),
                    age: z.number().int().positive(),
                    sex: z.enum(["male", "female", "other"])
                }),
                response: {
                    200: createSelectSchema(patients).pick({
                        id: true,
                        name: true,
                        age: true,
                        sex: true,
                        createdAt: true
                    })
                }
            }
        },

        async(request, reply) => {
            const { name , age, sex } = request.body
            
            const existing = await db.query.patients.findFirst({
                where: eq(patients.name, name)
            })

            if (existing) {
                return reply.status(200).send(existing)
            }

            const result = await db.transaction(async (tx) => {
                const [patient] = await tx
                    .insert(patients)
                    .values({
                        id: uuidv7(),
                        name,
                        age,
                        sex,
                    })
                    .returning()

                await tx.insert(vitalSigns).values({
                    id: uuidv7(),
                    bpm: 0,
                    measuredAt: new Date(),
                    patientId: patient.id
                })

                await tx.insert(analyses).values({
                    id: uuidv7(),
                    avgBpm: 0,
                    minBpm: 0,
                    maxBpm: 0,
                    classification: "not_analysed",
                    riskPercentage: 0,
                    createdAt:new Date(),
                    patientId: patient.id
                })

                return patient;

            })

            return reply.status(200).send(result);

        }
    )
}