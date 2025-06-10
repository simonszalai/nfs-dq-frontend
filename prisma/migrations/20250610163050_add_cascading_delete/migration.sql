-- DropForeignKey
ALTER TABLE "ColumnComparisonStats" DROP CONSTRAINT "ColumnComparisonStats_column_mapping_id_fkey";

-- DropForeignKey
ALTER TABLE "ColumnMapping" DROP CONSTRAINT "ColumnMapping_enrichment_report_id_fkey";

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_report_id_fkey";

-- DropForeignKey
ALTER TABLE "GlobalIssue" DROP CONSTRAINT "GlobalIssue_report_id_fkey";

-- DropForeignKey
ALTER TABLE "Warning" DROP CONSTRAINT "Warning_field_id_fkey";

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GlobalIssue" ADD CONSTRAINT "GlobalIssue_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ColumnMapping" ADD CONSTRAINT "ColumnMapping_enrichment_report_id_fkey" FOREIGN KEY ("enrichment_report_id") REFERENCES "EnrichmentReport"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ColumnComparisonStats" ADD CONSTRAINT "ColumnComparisonStats_column_mapping_id_fkey" FOREIGN KEY ("column_mapping_id") REFERENCES "ColumnMapping"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
