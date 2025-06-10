import { ColumnMappingsSection } from "../components/enhancement/ColumnMappingsSection";
import { DataComparisonStats } from "../components/enhancement/DataComparisonStats";
import { EnhancementHeader } from "../components/enhancement/EnhancementHeader";
import { EnhancementOverview } from "../components/enhancement/EnhancementOverview";
import { getEnhancementReportByToken } from "../models/enhancement.server";
import type { Route } from "./+types/enhancements.$reporttoken";

export async function loader({ params }: Route.LoaderArgs) {
  const { reporttoken } = params;

  if (!reporttoken) {
    throw new Response("Report token is required", { status: 400 });
  }

  const enhancementReport = await getEnhancementReportByToken(reporttoken);

  if (!enhancementReport) {
    throw new Response("Enhancement report not found", { status: 404 });
  }

  // Calculate key metrics
  const dataImprovementRate =
    (enhancementReport.column_mappings.reduce((sum: number, mapping) => {
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
      enhancementReport.column_mappings.length) *
    100;

  // Calculate aggregated data points stats
  const totalDataPointsAdded = enhancementReport.column_mappings.reduce(
    (sum: number, mapping) =>
      sum + (mapping.comparison_stats?.added_new_data || 0),
    0
  );

  const totalDataPointsDeleted = enhancementReport.column_mappings.reduce(
    (sum: number, mapping) =>
      sum + (mapping.comparison_stats?.discarded_invalid_data || 0),
    0
  );

  const totalDataPointsEnhanced = enhancementReport.column_mappings.reduce(
    (sum: number, mapping) => sum + (mapping.comparison_stats?.fixed_data || 0),
    0
  );

  const enhancementCoverage =
    (enhancementReport.records_modified_count / enhancementReport.total_rows) *
    100;

  return {
    enhancementReport,
    dataImprovementRate,
    totalDataPointsAdded,
    totalDataPointsDeleted,
    totalDataPointsEnhanced,
    enhancementCoverage,
  };
}

export default function EnhancementReportPage({
  loaderData,
}: Route.ComponentProps) {
  const {
    enhancementReport,
    dataImprovementRate,
    totalDataPointsAdded,
    totalDataPointsDeleted,
    totalDataPointsEnhanced,
    enhancementCoverage,
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
            <EnhancementHeader
              createdAt={enhancementReport.created_at}
              totalRows={enhancementReport.total_rows}
              dataImprovementRate={dataImprovementRate}
              totalDataPointsAdded={totalDataPointsAdded}
              totalDataPointsDeleted={totalDataPointsDeleted}
              totalDataPointsEnhanced={totalDataPointsEnhanced}
              enhancementCoverage={enhancementCoverage}
              recordsModified={enhancementReport.records_modified_count}
            />

            <EnhancementOverview
              totalCrmColumns={enhancementReport.total_crm_columns}
              totalExportColumns={enhancementReport.total_export_columns}
              newColumnsCount={enhancementReport.new_columns_count}
              manyToOneCount={enhancementReport.many_to_one_count}
              columnsReducedByMerging={
                enhancementReport.columns_reduced_by_merging
              }
              exportColumnsCreated={enhancementReport.export_columns_created}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ColumnMappingsSection
                  columnMappings={enhancementReport.column_mappings}
                  totalRows={enhancementReport.total_rows}
                />
              </div>
              <div className="lg:col-span-1">
                <DataComparisonStats
                  columnMappings={enhancementReport.column_mappings}
                  totalRows={enhancementReport.total_rows}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
