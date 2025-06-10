import type {
  ColumnComparisonStats,
  ColumnMapping,
  EnrichmentReport,
} from "@prisma/client";
import { prisma } from "./db.server";

export type EnhancementReportWithRelations = EnrichmentReport & {
  column_mappings: (ColumnMapping & {
    comparison_stats: ColumnComparisonStats | null;
  })[];
};

export async function getEnhancementReportByToken(
  token: string
): Promise<EnhancementReportWithRelations | null> {
  return prisma.enrichmentReport.findUnique({
    where: { token },
    include: {
      column_mappings: {
        include: {
          comparison_stats: true,
        },
        orderBy: { crm_column: "asc" },
      },
    },
  });
}
