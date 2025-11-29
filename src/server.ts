import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { env } from './env'
import { registerPatients } from "./routes/register-patients";
import { listPatient } from "./routes/list-patient";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // credentials: true,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Core API",
      description: "API responsible for managing patients, vital signs, and clinical analyses within the IoT monitoring system.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(registerPatients)
app.register(listPatient)


app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running on http://localhost:3333!");
  console.log("Docs available at http://localhost:3333/docs");
});
