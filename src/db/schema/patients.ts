import { pgTable, text, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const patients = pgTable('patients', {
    id: text().primaryKey().$defaultFn(() => uuidv7()),
    name: text().notNull(),
    age: integer().notNull(),
    sex: text({ enum: ["male", "female", "other"] }).notNull(),
    createdAt: timestamp().defaultNow(),
})

export const vitalSigns = pgTable("vital_signs", {
  id: text().primaryKey().$defaultFn(() => uuidv7()),
  bpm: integer().notNull(),
  measuredAt: timestamp().notNull().defaultNow(),
  patientId: text().notNull().references(() => patients.id),
});


export const analyses = pgTable("analyses", {
  id: text().primaryKey().$defaultFn(() => uuidv7()),
  avgBpm: integer().notNull(),
  minBpm: integer().notNull(),
  maxBpm: integer().notNull(),
  classification: text().notNull(),
  riskPercentage: numeric().notNull(),
  createdAt: timestamp().defaultNow(),
  patientId: text().notNull().references(() => patients.id),
});