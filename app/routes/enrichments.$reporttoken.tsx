import { ColumnMappingsSection } from "../components/enrichment/ColumnMappingsSection";
import { DataComparisonStats } from "../components/enrichment/DataComparisonStats";
import { EnrichmentHeader } from "../components/enrichment/EnrichmentHeader";
import { getEnrichmentReportByToken } from "../models/enrichment";
import type { Route } from "./+types/enrichments.$reporttoken";

export async function loader({ params }: Route.LoaderArgs) {
  const { reporttoken } = params;

  if (!reporttoken) {
    throw new Response("Report token is required", { status: 400 });
  }

  const enrichmentReport = await getEnrichmentReportByToken(reporttoken);

  if (!enrichmentReport) {
    throw new Response("Enrichment report not found", { status: 404 });
  }

  // Calculate key metrics
  const dataImprovementRate =
    (enrichmentReport.column_mappings.reduce((sum: number, mapping) => {
      if (mapping.comparison_stats) {
        const total =
          mapping.comparison_stats.discarded_invalid_data +
          mapping.comparison_stats.added_new_data +
          mapping.comparison_stats.fixed_data +
          mapping.comparison_stats.good_data;
        const improved =
          mapping.comparison_stats.added_new_data +
          mapping.comparison_stats.fixed_data;
        return sum + (total > 0 ? improved / total : 0);
      }
      return sum;
    }, 0) /
      enrichmentReport.column_mappings.length) *
    100;

  // Calculate aggregated data points stats
  const totalDataPointsAdded = enrichmentReport.column_mappings.reduce(
    (sum: number, mapping) =>
      sum + (mapping.comparison_stats?.added_new_data || 0),
    0
  );

  const totalDataPointsDiscarded = enrichmentReport.column_mappings.reduce(
    (sum: number, mapping) =>
      sum + (mapping.comparison_stats?.discarded_invalid_data || 0),
    0
  );

  const totalDataPointsEnriched = enrichmentReport.column_mappings.reduce(
    (sum: number, mapping) => sum + (mapping.comparison_stats?.fixed_data || 0),
    0
  );

  const enrichmentCoverage =
    (enrichmentReport.records_modified_count / enrichmentReport.total_rows) *
    100;

  return {
    enrichmentReport,
    dataImprovementRate,
    totalDataPointsAdded,
    totalDataPointsDiscarded,
    totalDataPointsEnriched,
    enrichmentCoverage,
  };
}

export default function EnrichmentReportPage({
  loaderData,
}: Route.ComponentProps) {
  const {
    enrichmentReport,
    dataImprovementRate,
    totalDataPointsAdded,
    totalDataPointsDiscarded,
    totalDataPointsEnriched,
    enrichmentCoverage,
  } = loaderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <EnrichmentHeader
              createdAt={enrichmentReport.created_at}
              totalRows={enrichmentReport.total_rows}
              title={enrichmentReport.filename}
              dataImprovementRate={dataImprovementRate}
              totalDataPointsAdded={totalDataPointsAdded}
              totalDataPointsDiscarded={totalDataPointsDiscarded}
              totalDataPointsEnriched={totalDataPointsEnriched}
              enrichmentCoverage={enrichmentCoverage}
              recordsModified={enrichmentReport.records_modified_count}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ColumnMappingsSection
                  columnMappings={enrichmentReport.column_mappings}
                  totalRows={enrichmentReport.total_rows}
                />
              </div>
              <div className="lg:col-span-1">
                <DataComparisonStats
                  columnMappings={enrichmentReport.column_mappings}
                  totalRows={enrichmentReport.total_rows}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
