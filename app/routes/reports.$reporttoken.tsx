import { z } from "zod";
import { DataQualityCards } from "../components/report/DataQualityCards";
import { EnrichmentPlan } from "../components/report/EnrichmentPlan";
import { FieldAnalysisSection } from "../components/report/FieldAnalysisSection";
import { GlobalIssuesSection } from "../components/report/GlobalIssuesSection";
import { RecommendedActions } from "../components/report/RecommendedActions";
import { ReportHeader } from "../components/report/ReportHeader";
import {
  calculateDataQualityScore,
  getIssueStats,
  getReportByToken,
} from "../models/report.server";
import type { Route } from "./+types/reports.$reporttoken";

// Zod schema for the report config
const ReportConfigSchema = z.object({
  critical_columns: z.object({
    company_info: z.record(z.string()),
    financial_data: z.record(z.string()),
    size_and_structure: z.record(z.string()),
  }),
});

type ReportConfig = z.infer<typeof ReportConfigSchema>;

export async function loader({ params }: Route.LoaderArgs) {
  const { reporttoken } = params;

  if (!reporttoken) {
    throw new Response("Report token is required", { status: 400 });
  }

  const report = await getReportByToken(reporttoken);

  if (!report) {
    throw new Response("Report not found", { status: 404 });
  }

  const dataQualityScore = calculateDataQualityScore(report);
  const issueStats = getIssueStats(report);

  // Calculate population stats
  const populationStats = {
    empty: 0,
    low: 0, // >0-25%
    medium: 0, // 25-75%
    high: 0, // >75%
  };

  report.fields.forEach((field) => {
    const populationRate = (field.populated_count / report.total_records) * 100;

    if (populationRate === 0) {
      populationStats.empty++;
    } else if (populationRate <= 25) {
      populationStats.low++;
    } else if (populationRate <= 75) {
      populationStats.medium++;
    } else {
      populationStats.high++;
    }
  });

  // Parse the config with Zod for type safety
  const config = ReportConfigSchema.parse(report.config);

  // Process columns data for DataQualityCards
  const columns = [];

  // Iterate through each category in the config
  for (const [categorySlug, categoryColumns] of Object.entries(
    config.critical_columns
  )) {
    for (const [displayName, actualColumnName] of Object.entries(
      categoryColumns
    )) {
      // Find the corresponding field in the report by matching the actual column name
      const field = report.fields.find(
        (f) => f.column_name === actualColumnName
      );

      if (field) {
        const fillPercentage = Math.round(
          (field.populated_count / report.total_records) * 100
        );

        columns.push({
          categorySlug,
          name: displayName,
          columnName: field.column_name,
          fillPercentage,
          field,
          warnings: field.warnings.map((w) => ({
            id: w.id,
            message: w.message,
            severity: w.severity,
          })),
        });
      } else {
        // If field doesn't exist in report, still include it with 0% fill
        columns.push({
          categorySlug,
          name: displayName,
          columnName: actualColumnName,
          fillPercentage: 0,
          warnings: [],
        });
      }
    }
  }

  return {
    report,
    dataQualityScore,
    issueStats,
    populationStats,
    columns,
  };
}

export default function ReportPage({ loaderData }: Route.ComponentProps) {
  const { report, dataQualityScore, issueStats, populationStats, columns } =
    loaderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <ReportHeader
              companyName={report.company_name}
              generatedAt={report.generated_at}
              totalRecords={report.total_records}
              totalFields={report.total_fields}
              fieldsWithIssues={report.fields_with_issues}
              dataQualityScore={dataQualityScore}
              issueStats={issueStats}
              populationStats={populationStats}
            />

            <DataQualityCards report={report} columns={columns} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FieldAnalysisSection
                  fields={report.fields}
                  totalRecords={report.total_records}
                />
              </div>
              <div className="lg:col-span-1">
                <GlobalIssuesSection globalIssues={report.global_issues} />
              </div>
            </div>

            {/* Add Recommended Actions and Enrichment Plan */}
            <RecommendedActions report={report} issueStats={issueStats} />
            <EnrichmentPlan report={report} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
}
