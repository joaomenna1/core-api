CREATE TABLE "analyses" (
	"id" text PRIMARY KEY NOT NULL,
	"avg_bpm" integer NOT NULL,
	"min_bpm" integer NOT NULL,
	"max_bpm" integer NOT NULL,
	"classification" text NOT NULL,
	"risk_percentage" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"patient_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"sex" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vital_signs" (
	"id" text PRIMARY KEY NOT NULL,
	"bpm" integer NOT NULL,
	"measured_at" timestamp DEFAULT now() NOT NULL,
	"patient_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;