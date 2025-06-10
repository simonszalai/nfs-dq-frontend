import type { ColumnComparisonStats, ColumnMapping } from "@prisma/client";

interface ColumnMappingsSectionProps {
  columnMappings: (ColumnMapping & {
    comparison_stats: ColumnComparisonStats | null;
  })[];
  totalRows: number;
}

export function ColumnMappingsSection({
  columnMappings,
  totalRows,
}: ColumnMappingsSectionProps) {
  // Only show mappings that have comparison stats (actual enhancement)
  const enhancedMappings = columnMappings.filter(
    (mapping) => mapping.comparison_stats
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-emerald-400";
    if (confidence >= 0.7) return "text-yellow-400";
    return "text-orange-400";
  };

  const getDataChangeIcon = (stats: ColumnComparisonStats | null) => {
    if (!stats) return null;

    const improved = stats.added_new_data + stats.fixed_data;
    const total = stats.discarded_invalid_data + improved + stats.good_data;
    const improvementRate = total > 0 ? improved / total : 0;

    if (improvementRate > 0.1) {
      return (
        <svg
          className="h-5 w-5 text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      );
    } else if (stats.discarded_invalid_data > stats.added_new_data) {
      return (
        <svg
          className="h-5 w-5 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      );
    }
    return (
      <svg
        className="h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14"
        />
      </svg>
    );
  };

  const cleanColumnName = (columnName: string) => {
    return columnName.replace(/^export\./, "");
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes moveStripes {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 17px 0;
            }
          }
        `,
        }}
      />
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg
          className="h-6 w-6 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        Enhancement Breakdown
      </h2>

      <div className="space-y-4">
        {enhancedMappings.map((mapping) => (
          <div
            key={mapping.id}
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all"
          >
            {/* Mapping Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {cleanColumnName(mapping.export_column || "No mapping")}
                  </span>
                  {mapping.is_many_to_one && (
                    <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                      Many-to-One
                    </span>
                  )}
                </div>
                {mapping.additional_crm_columns &&
                  Array.isArray(mapping.additional_crm_columns) &&
                  mapping.additional_crm_columns.length > 0 && (
                    <div className="mt-1 text-sm text-gray-400">
                      Also includes:{" "}
                      {(mapping.additional_crm_columns as string[]).join(", ")}
                    </div>
                  )}
              </div>
              <div className="flex items-center gap-3">
                {getDataChangeIcon(mapping.comparison_stats)}
                {mapping.comparison_stats && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">
                      +
                      {(
                        mapping.comparison_stats.correct_percentage_after -
                        mapping.comparison_stats.correct_percentage_before
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-xs text-gray-400">accuracy</div>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Stats */}
            {mapping.comparison_stats && (
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div className="bg-gray-900/50 rounded p-2">
                  <div className="text-emerald-400 font-semibold">
                    {mapping.comparison_stats.added_new_data}
                  </div>
                  <div className="text-xs text-gray-400">Added</div>
                </div>
                <div className="bg-gray-900/50 rounded p-2">
                  <div className="text-blue-400 font-semibold">
                    {mapping.comparison_stats.fixed_data}
                  </div>
                  <div className="text-xs text-gray-400">Fixed</div>
                </div>
                <div className="bg-gray-900/50 rounded p-2">
                  <div className="text-orange-400 font-semibold">
                    {mapping.comparison_stats.discarded_invalid_data}
                  </div>
                  <div className="text-xs text-gray-400">Discarded</div>
                </div>
                <div className="bg-gray-900/50 rounded p-2">
                  <div className="text-gray-400 font-semibold">
                    {mapping.comparison_stats.good_data}
                  </div>
                  <div className="text-xs text-gray-400">Unchanged</div>
                </div>
              </div>
            )}

            {/* Accuracy Improvement Bar */}
            {mapping.comparison_stats && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Data Accuracy</span>
                  <span>
                    {mapping.comparison_stats.correct_percentage_before.toFixed(
                      1
                    )}
                    % →{" "}
                    {mapping.comparison_stats.correct_percentage_after.toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-gray-500"
                      style={{
                        width: `${mapping.comparison_stats.correct_percentage_before}%`,
                      }}
                    />
                    <div
                      className="relative overflow-hidden"
                      style={{
                        width: `${
                          mapping.comparison_stats.correct_percentage_after -
                          mapping.comparison_stats.correct_percentage_before
                        }%`,
                        background: `
                          repeating-linear-gradient(
                            45deg,
                            #34d399 0px,
                            #34d399 6px,
                            #10b981 6px,
                            #10b981 12px
                          )
                        `,
                        backgroundSize: "17px 17px",
                        animation: "moveStripes 2s linear infinite",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
