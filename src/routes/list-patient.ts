import { db } from "@/db";
import { analyses, patients, vitalSigns } from "@/db/schema";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const listPatient: FastifyPluginAsyncZod = async (app) => {
    app.get(
        "/api/patient/:id",
        {
            schema: {
                summary: "List patient",
                tags: ["Patient"],
                params: z.object({
                    id: z.string().uuid(),
                }),
                response: {
                    200: z.object({
                        id: z.string(),
                        name: z.string(),
                        age: z.number(),
                        sex: z.string(),
                        createdAt: z.date().nullable(),

                        lastVitalSign: z
                            .object({
                                id: z.string(),
                                bpm: z.number(),
                                measuredAt: z.date(),
                            })
                            .nullable(),

                        analyses: z
                            .object({
                                id: z.string(),
                                avgBpm: z.number(),
                                minBpm: z.number(),
                                maxBpm: z.number(),
                                classification: z.string(),
                                riskPercentage: z.number(),
                                createdAt: z.date().nullable(),
                            })
                            .nullable(),
                    }),
                    404: z.object({ message: z.string() }),
                },
            },
        },

        async (request, reply) => {
            const { id } = request.params;

            const [patient] = await db
                .select()
                .from(patients)
                .where(eq(patients.id, id))
                .limit(1);

            if (!patient) {
                return reply.status(404).send({ message: "Patient not found." });
            }

            const lastVitalSign = await db.query.vitalSigns.findFirst({
                where: eq(vitalSigns.patientId, id),
                orderBy: desc(vitalSigns.measuredAt),
            });

            const lastAnalysis = await db.query.analyses.findFirst({
                where: eq(analyses.patientId, id),
                orderBy: desc(analyses.createdAt),
            });

            return reply.status(200).send({
                ...patient,
                lastVitalSign: lastVitalSign ?? null,
                analyses: lastAnalysis ?? null,
            });
        }
    );
};
