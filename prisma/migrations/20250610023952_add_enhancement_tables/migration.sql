-- CreateTable
CREATE TABLE "EnrichmentReport" (
    "id" VARCHAR NOT NULL,
    "token" VARCHAR NOT NULL,
    "filename" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "total_rows" INTEGER NOT NULL,
    "total_crm_columns" INTEGER NOT NULL,
    "total_export_columns" INTEGER NOT NULL,
    "new_columns_count" INTEGER NOT NULL,
    "many_to_one_count" INTEGER NOT NULL,
    "columns_reduced_by_merging" INTEGER NOT NULL,
    "records_modified_count" INTEGER NOT NULL,
    "export_columns_created" INTEGER NOT NULL,

    CONSTRAINT "EnrichmentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColumnMapping" (
    "id" VARCHAR NOT NULL,
    "enrichment_report_id" VARCHAR NOT NULL,
    "crm_column" VARCHAR NOT NULL,
    "export_column" VARCHAR,
    "is_many_to_one" BOOLEAN NOT NULL DEFAULT false,
    "additional_crm_columns" JSON,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" VARCHAR NOT NULL,

    CONSTRAINT "ColumnMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColumnComparisonStats" (
    "id" VARCHAR NOT NULL,
    "column_mapping_id" VARCHAR NOT NULL,
    "discarded_invalid_data" INTEGER NOT NULL DEFAULT 0,
    "added_new_data" INTEGER NOT NULL DEFAULT 0,
    "fixed_data" INTEGER NOT NULL DEFAULT 0,
    "good_data" INTEGER NOT NULL DEFAULT 0,
    "correct_values_before" INTEGER NOT NULL DEFAULT 0,
    "correct_values_after" INTEGER NOT NULL DEFAULT 0,
    "correct_percentage_before" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "correct_percentage_after" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "crm_data_type" VARCHAR,
    "crm_format_count" INTEGER NOT NULL DEFAULT 1,
    "export_data_type" VARCHAR,
    "export_format_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ColumnComparisonStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnrichmentReport_token_key" ON "EnrichmentReport"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ColumnComparisonStats_column_mapping_id_key" ON "ColumnComparisonStats"("column_mapping_id");

-- AddForeignKey
ALTER TABLE "ColumnMapping" ADD CONSTRAINT "ColumnMapping_enrichment_report_id_fkey" FOREIGN KEY ("enrichment_report_id") REFERENCES "EnrichmentReport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ColumnComparisonStats" ADD CONSTRAINT "ColumnComparisonStats_column_mapping_id_fkey" FOREIGN KEY ("column_mapping_id") REFERENCES "ColumnMapping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
