-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('vendor', 'distributor');

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('pending', 'verified', 'rejected');

-- CreateEnum
CREATE TYPE "public"."OnboardingStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "public"."ProductRequestStatus" AS ENUM ('open', 'matched', 'closed');

-- CreateEnum
CREATE TYPE "public"."PartnershipStatus" AS ENUM ('pending', 'accepted', 'contract_sent', 'contract_signed', 'active', 'terminated');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('product_request', 'partnership_update', 'contract', 'training', 'system');

-- CreateEnum
CREATE TYPE "public"."TrainingStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "public"."AlertType" AS ENUM ('contract_pending', 'training_incomplete', 'onboarding_stalled', 'partnership_request');

-- CreateEnum
CREATE TYPE "public"."AlertPriority" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "user_type" "public"."UserType" NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "company_name" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vendors" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "company_description" TEXT,
    "business_license" TEXT,
    "tax_id" TEXT,
    "address" TEXT,
    "website" TEXT,
    "verification_status" "public"."VerificationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distributors" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "experience_years" INTEGER,
    "coverage_areas" TEXT,
    "distribution_channels" TEXT,
    "portfolio_size" INTEGER,
    "verification_status" "public"."VerificationStatus" NOT NULL DEFAULT 'pending',
    "onboarding_status" "public"."OnboardingStatus" NOT NULL DEFAULT 'not_started',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_requests" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "product_category" TEXT,
    "target_market" TEXT,
    "commission_rate" DECIMAL(5,2),
    "requirements" TEXT,
    "status" "public"."ProductRequestStatus" NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."partnerships" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "distributor_id" INTEGER NOT NULL,
    "product_request_id" INTEGER NOT NULL,
    "status" "public"."PartnershipStatus" NOT NULL DEFAULT 'pending',
    "accepted_at" TIMESTAMP(3),
    "contract_sent_at" TIMESTAMP(3),
    "contract_signed_at" TIMESTAMP(3),
    "activated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partnerships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contracts" (
    "id" SERIAL NOT NULL,
    "partnership_id" INTEGER NOT NULL,
    "contract_template_id" INTEGER NOT NULL,
    "welcome_link_token" TEXT,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "terms_and_conditions" TEXT NOT NULL,
    "services_description" TEXT,
    "license_details" TEXT,
    "obligations" TEXT,
    "is_signed" BOOLEAN NOT NULL DEFAULT false,
    "signed_at" TIMESTAMP(3),
    "signed_by_ip" TEXT,
    "digital_signature" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_templates" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "template_content" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "related_id" INTEGER,
    "related_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distributor_access" (
    "id" SERIAL NOT NULL,
    "partnership_id" INTEGER NOT NULL,
    "slack_workspace_url" TEXT,
    "slack_invite_sent" BOOLEAN NOT NULL DEFAULT false,
    "slack_invite_accepted" BOOLEAN NOT NULL DEFAULT false,
    "portal_username" TEXT,
    "portal_temp_password" TEXT,
    "portal_password_changed" BOOLEAN NOT NULL DEFAULT false,
    "access_granted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributor_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."training_modules" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_url" TEXT NOT NULL,
    "order_sequence" INTEGER NOT NULL,
    "estimated_duration" INTEGER,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."training_progress" (
    "id" SERIAL NOT NULL,
    "distributor_id" INTEGER NOT NULL,
    "training_module_id" INTEGER NOT NULL,
    "partnership_id" INTEGER NOT NULL,
    "status" "public"."TrainingStatus" NOT NULL DEFAULT 'not_started',
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "time_spent" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dashboard_stats" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "total_distributors" INTEGER NOT NULL DEFAULT 0,
    "available_distributors" INTEGER NOT NULL DEFAULT 0,
    "assigned_distributors" INTEGER NOT NULL DEFAULT 0,
    "pending_contracts" INTEGER NOT NULL DEFAULT 0,
    "signed_contracts" INTEGER NOT NULL DEFAULT 0,
    "training_completion_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "last_calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."automated_alerts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "alert_type" "public"."AlertType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "related_id" INTEGER,
    "related_type" TEXT,
    "priority" "public"."AlertPriority" NOT NULL DEFAULT 'medium',
    "is_sent" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3),
    "is_dismissed" BOOLEAN NOT NULL DEFAULT false,
    "dismissed_at" TIMESTAMP(3),
    "scheduled_for" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automated_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "description" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" SERIAL NOT NULL,
    "setting_key" TEXT NOT NULL,
    "setting_value" TEXT NOT NULL,
    "description" TEXT,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_user_id_key" ON "public"."vendors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "distributors_user_id_key" ON "public"."distributors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_welcome_link_token_key" ON "public"."contracts"("welcome_link_token");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_setting_key_key" ON "public"."system_settings"("setting_key");

-- AddForeignKey
ALTER TABLE "public"."vendors" ADD CONSTRAINT "vendors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distributors" ADD CONSTRAINT "distributors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_requests" ADD CONSTRAINT "product_requests_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."partnerships" ADD CONSTRAINT "partnerships_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."partnerships" ADD CONSTRAINT "partnerships_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "public"."distributors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."partnerships" ADD CONSTRAINT "partnerships_product_request_id_fkey" FOREIGN KEY ("product_request_id") REFERENCES "public"."product_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_partnership_id_fkey" FOREIGN KEY ("partnership_id") REFERENCES "public"."partnerships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_contract_template_id_fkey" FOREIGN KEY ("contract_template_id") REFERENCES "public"."contract_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_templates" ADD CONSTRAINT "contract_templates_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distributor_access" ADD CONSTRAINT "distributor_access_partnership_id_fkey" FOREIGN KEY ("partnership_id") REFERENCES "public"."partnerships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_modules" ADD CONSTRAINT "training_modules_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_progress" ADD CONSTRAINT "training_progress_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "public"."distributors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_progress" ADD CONSTRAINT "training_progress_training_module_id_fkey" FOREIGN KEY ("training_module_id") REFERENCES "public"."training_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_progress" ADD CONSTRAINT "training_progress_partnership_id_fkey" FOREIGN KEY ("partnership_id") REFERENCES "public"."partnerships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dashboard_stats" ADD CONSTRAINT "dashboard_stats_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."automated_alerts" ADD CONSTRAINT "automated_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."system_settings" ADD CONSTRAINT "system_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
