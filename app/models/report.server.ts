import type { Field, GlobalIssue, Report, Warning } from "@prisma/client";
import { prisma } from "./db.server";

export type ReportWithRelations = Report & {
  fields: (Field & {
    warnings: Warning[];
  })[];
  global_issues: GlobalIssue[];
};

export async function getReportByToken(
  token: string
): Promise<ReportWithRelations | null> {
  return prisma.report.findUnique({
    where: { token },
    include: {
      fields: {
        include: {
          warnings: {
            orderBy: { severity: "desc" },
          },
        },
        orderBy: { column_name: "asc" },
      },
      global_issues: {
        orderBy: { severity: "desc" },
      },
    },
  });
}

export function calculateDataQualityScore(report: ReportWithRelations): number {
  if (report.total_fields === 0) return 0;

  const qualityRatio = 1 - report.fields_with_issues / report.total_fields;
  return Math.round(qualityRatio * 100);
}

export function getFieldsByCategory(
  fields: ReportWithRelations["fields"],
  report: ReportWithRelations
) {
  const categories = {
    critical: [] as typeof fields,
    warning: [] as typeof fields,
    good: [] as typeof fields,
    empty: [] as typeof fields,
  };

  const criticalColumns = (report.config as any)?.criticalColumns || [];

  fields.forEach((field) => {
    const populationRate = (field.populated_count / report.total_records) * 100;

    if (populationRate === 0) {
      categories.empty.push(field);
    } else if (populationRate < 25) {
      categories.critical.push(field);
    } else if (populationRate < 70) {
      categories.warning.push(field);
    } else {
      categories.good.push(field);
    }
  });

  return categories;
}

export function getIssueStats(report: ReportWithRelations) {
  const stats = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    total: 0,
  };

  // Count global issues
  report.global_issues.forEach((issue) => {
    stats[issue.severity.toLowerCase() as keyof typeof stats]++;
    stats.total++;
  });

  // Count field warnings
  report.fields.forEach((field) => {
    field.warnings.forEach((warning) => {
      stats[warning.severity.toLowerCase() as keyof typeof stats]++;
      stats.total++;
    });
  });

  return stats;
}
