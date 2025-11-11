CREATE TABLE "free_trials" (
	"id" varchar PRIMARY KEY NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"buyer_name" varchar(255) NOT NULL,
	"storyteller_name" varchar(255) NOT NULL,
	"selected_album" varchar(255) NOT NULL,
	"storyteller_phone" varchar(20),
	"conversation_state" varchar(50) DEFAULT 'awaiting_initial_contact' NOT NULL,
	"current_question_index" integer DEFAULT 0 NOT NULL,
	"retry_readiness_at" timestamp with time zone,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"last_readiness_response" varchar(50),
	"welcome_sent_at" timestamp with time zone,
	"readiness_asked_at" timestamp with time zone,
	"last_question_sent_at" timestamp with time zone,
	"reminder_sent_at" timestamp with time zone,
	"next_question_scheduled_for" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_notes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"free_trial_id" varchar(255) NOT NULL,
	"question_index" integer NOT NULL,
	"question_text" text NOT NULL,
	"media_id" varchar(255) NOT NULL,
	"media_url" text,
	"local_file_path" text,
	"mime_type" varchar(100),
	"media_sha256" varchar(64),
	"download_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"size_bytes" integer,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "voice_notes" ADD CONSTRAINT "voice_notes_free_trial_id_free_trials_id_fk" FOREIGN KEY ("free_trial_id") REFERENCES "public"."free_trials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "free_trials_conversation_state_idx" ON "free_trials" USING btree ("conversation_state");--> statement-breakpoint
CREATE INDEX "free_trials_retry_readiness_at_idx" ON "free_trials" USING btree ("retry_readiness_at");--> statement-breakpoint
CREATE INDEX "free_trials_next_question_scheduled_idx" ON "free_trials" USING btree ("next_question_scheduled_for");--> statement-breakpoint
CREATE INDEX "voice_notes_free_trial_id_idx" ON "voice_notes" USING btree ("free_trial_id");--> statement-breakpoint
CREATE UNIQUE INDEX "voice_notes_trial_question_idx" ON "voice_notes" USING btree ("free_trial_id","question_index");