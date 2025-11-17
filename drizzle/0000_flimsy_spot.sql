CREATE TABLE "fleets" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"title" varchar(255) NOT NULL,
	"tags" varchar(32)[] NOT NULL,
	"memo" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "fleets" USING btree ("user_id");
