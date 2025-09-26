CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "user_type" enum(vendor,distributor) NOT NULL,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "phone" varchar(20),
  "company_name" varchar(255),
  "is_verified" boolean DEFAULT false,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "last_login" timestamp
);

CREATE TABLE "vendors" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "company_description" text,
  "business_license" varchar(255),
  "tax_id" varchar(100),
  "address" text,
  "website" varchar(255),
  "verification_status" enum(pending,verified,rejected) DEFAULT 'pending',
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "distributors" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "experience_years" integer,
  "coverage_areas" text,
  "distribution_channels" text,
  "portfolio_size" integer,
  "verification_status" enum(pending,verified,rejected) DEFAULT 'pending',
  "onboarding_status" enum(not_started,in_progress,completed) DEFAULT 'not_started',
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "product_requests" (
  "id" integer PRIMARY KEY,
  "vendor_id" integer,
  "title" varchar(255) NOT NULL,
  "product_description" text NOT NULL,
  "product_category" varchar(100),
  "target_market" text,
  "commission_rate" decimal(5,2),
  "requirements" text,
  "status" enum(open,matched,closed) DEFAULT 'open',
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "partnerships" (
  "id" integer PRIMARY KEY,
  "vendor_id" integer,
  "distributor_id" integer,
  "product_request_id" integer,
  "status" enum(pending,accepted,contract_sent,contract_signed,active,terminated) DEFAULT 'pending',
  "accepted_at" timestamp,
  "contract_sent_at" timestamp,
  "contract_signed_at" timestamp,
  "activated_at" timestamp,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "contracts" (
  "id" integer PRIMARY KEY,
  "partnership_id" integer,
  "contract_template_id" integer,
  "welcome_link_token" varchar(255) UNIQUE,
  "commission_rate" decimal(5,2) NOT NULL,
  "terms_and_conditions" text NOT NULL,
  "services_description" text,
  "license_details" text,
  "obligations" text,
  "is_signed" boolean DEFAULT false,
  "signed_at" timestamp,
  "signed_by_ip" varchar(45),
  "digital_signature" text,
  "expires_at" timestamp,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "contract_templates" (
  "id" integer PRIMARY KEY,
  "vendor_id" integer,
  "name" varchar(255) NOT NULL,
  "template_content" text NOT NULL,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "notifications" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "title" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "type" enum(product_request,partnership_update,contract,training,system) NOT NULL,
  "is_read" boolean DEFAULT false,
  "related_id" integer,
  "related_type" varchar(50),
  "created_at" timestamp DEFAULT (now()),
  "read_at" timestamp
);

CREATE TABLE "distributor_access" (
  "id" integer PRIMARY KEY,
  "partnership_id" integer,
  "slack_workspace_url" varchar(255),
  "slack_invite_sent" boolean DEFAULT false,
  "slack_invite_accepted" boolean DEFAULT false,
  "portal_username" varchar(100),
  "portal_temp_password" varchar(255),
  "portal_password_changed" boolean DEFAULT false,
  "access_granted_at" timestamp,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "training_modules" (
  "id" integer PRIMARY KEY,
  "vendor_id" integer,
  "title" varchar(255) NOT NULL,
  "description" text,
  "content_url" varchar(255) NOT NULL,
  "order_sequence" integer NOT NULL,
  "estimated_duration" integer,
  "is_mandatory" boolean DEFAULT true,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "training_progress" (
  "id" integer PRIMARY KEY,
  "distributor_id" integer,
  "training_module_id" integer,
  "partnership_id" integer,
  "status" enum(not_started,in_progress,completed) DEFAULT 'not_started',
  "progress_percentage" integer DEFAULT 0,
  "started_at" timestamp,
  "completed_at" timestamp,
  "time_spent" integer,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "dashboard_stats" (
  "id" integer PRIMARY KEY,
  "vendor_id" integer,
  "total_distributors" integer DEFAULT 0,
  "available_distributors" integer DEFAULT 0,
  "assigned_distributors" integer DEFAULT 0,
  "pending_contracts" integer DEFAULT 0,
  "signed_contracts" integer DEFAULT 0,
  "training_completion_rate" decimal(5,2) DEFAULT 0,
  "last_calculated_at" timestamp DEFAULT (now()),
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "automated_alerts" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "alert_type" enum(contract_pending,training_incomplete,onboarding_stalled,partnership_request) NOT NULL,
  "title" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "related_id" integer,
  "related_type" varchar(50),
  "priority" enum(low,medium,high) DEFAULT 'medium',
  "is_sent" boolean DEFAULT false,
  "sent_at" timestamp,
  "is_dismissed" boolean DEFAULT false,
  "dismissed_at" timestamp,
  "scheduled_for" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "activity_logs" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "action" varchar(100) NOT NULL,
  "entity_type" varchar(50) NOT NULL,
  "entity_id" integer NOT NULL,
  "description" text,
  "ip_address" varchar(45),
  "user_agent" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "system_settings" (
  "id" integer PRIMARY KEY,
  "setting_key" varchar(100) UNIQUE NOT NULL,
  "setting_value" text NOT NULL,
  "description" text,
  "updated_by" integer,
  "updated_at" timestamp DEFAULT (now()),
  "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "vendors" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "distributors" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "product_requests" ADD FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id");

ALTER TABLE "partnerships" ADD FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id");

ALTER TABLE "partnerships" ADD FOREIGN KEY ("distributor_id") REFERENCES "distributors" ("id");

ALTER TABLE "partnerships" ADD FOREIGN KEY ("product_request_id") REFERENCES "product_requests" ("id");

ALTER TABLE "contracts" ADD FOREIGN KEY ("partnership_id") REFERENCES "partnerships" ("id");

ALTER TABLE "contracts" ADD FOREIGN KEY ("contract_template_id") REFERENCES "contract_templates" ("id");

ALTER TABLE "contract_templates" ADD FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "distributor_access" ADD FOREIGN KEY ("partnership_id") REFERENCES "partnerships" ("id");

ALTER TABLE "training_modules" ADD FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id");

ALTER TABLE "training_progress" ADD FOREIGN KEY ("distributor_id") REFERENCES "distributors" ("id");

ALTER TABLE "training_progress" ADD FOREIGN KEY ("training_module_id") REFERENCES "training_modules" ("id");

ALTER TABLE "training_progress" ADD FOREIGN KEY ("partnership_id") REFERENCES "partnerships" ("id");

ALTER TABLE "dashboard_stats" ADD FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id");

ALTER TABLE "automated_alerts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "activity_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "system_settings" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
