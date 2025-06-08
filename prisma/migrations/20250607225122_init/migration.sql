-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "WarningType" AS ENUM ('EMPTY_FIELD', 'LOW_POPULATION', 'INCONSISTENT_FORMAT', 'DUPLICATE_DATA', 'DEPRECATED_FIELD', 'DATA_QUALITY', 'OTHER');

-- CreateTable
CREATE TABLE "Field" (
    "id" VARCHAR NOT NULL,
    "report_id" VARCHAR NOT NULL,
    "column_name" VARCHAR NOT NULL,
    "populated_count" INTEGER NOT NULL,
    "inferred_type" VARCHAR NOT NULL,
    "format_count" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalIssue" (
    "id" VARCHAR NOT NULL,
    "report_id" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "severity" "Severity" NOT NULL,
    "meta" JSON,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "GlobalIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" VARCHAR NOT NULL,
    "token" VARCHAR NOT NULL,
    "company_name" VARCHAR NOT NULL,
    "generated_at" TIMESTAMP(6) NOT NULL,
    "total_records" INTEGER NOT NULL,
    "total_fields" INTEGER NOT NULL,
    "fields_with_issues" INTEGER NOT NULL,
    "config" JSON,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warning" (
    "id" VARCHAR NOT NULL,
    "field_id" VARCHAR NOT NULL,
    "type" "WarningType" NOT NULL,
    "message" VARCHAR NOT NULL,
    "severity" "Severity" NOT NULL,
    "meta" JSON,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Warning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_token_key" ON "Report"("token");

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GlobalIssue" ADD CONSTRAINT "GlobalIssue_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
