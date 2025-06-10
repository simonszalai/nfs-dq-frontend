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
  const report = await prisma.enrichmentReport.findUnique({
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

  if (!report) {
    return null;
  }

  // Filter out duplicate export_column values, keeping only the first occurrence
  const seenExportColumns = new Set<string>();
  const uniqueColumnMappings = report.column_mappings.filter((mapping) => {
    if (!mapping.export_column) {
      return false; // Exclude mappings with null export_column
    }

    if (seenExportColumns.has(mapping.export_column)) {
      return false; // Skip duplicate export_column
    }

    seenExportColumns.add(mapping.export_column);
    return true;
  });

  return {
    ...report,
    column_mappings: uniqueColumnMappings,
  };
}
