import type { ColumnComparisonStats, ColumnMapping } from "@prisma/client";

interface DataComparisonStatsProps {
  columnMappings: (ColumnMapping & {
    comparison_stats: ColumnComparisonStats | null;
  })[];
  totalRows: number;
}

export function DataComparisonStats({
  columnMappings,
  totalRows,
}: DataComparisonStatsProps) {
  // Calculate aggregate statistics
  const totals = columnMappings.reduce(
    (acc, mapping) => {
      if (mapping.comparison_stats) {
        acc.discarded += mapping.comparison_stats.discarded_invalid_data;
        acc.added += mapping.comparison_stats.added_new_data;
        acc.fixed += mapping.comparison_stats.fixed_data;
        acc.good += mapping.comparison_stats.good_data;
      }
      return acc;
    },
    { discarded: 0, added: 0, fixed: 0, good: 0 }
  );

  const totalChanges =
    totals.discarded + totals.added + totals.fixed + totals.good;

  // Calculate average accuracy improvement
  const accuracyStats = columnMappings
    .filter((m) => m.comparison_stats)
    .map((m) => ({
      before: m.comparison_stats!.correct_percentage_before,
      after: m.comparison_stats!.correct_percentage_after,
    }));

  const avgAccuracyBefore =
    accuracyStats.length > 0
      ? accuracyStats.reduce((sum, s) => sum + s.before, 0) /
        accuracyStats.length
      : 0;

  const avgAccuracyAfter =
    accuracyStats.length > 0
      ? accuracyStats.reduce((sum, s) => sum + s.after, 0) /
        accuracyStats.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Data Changes Summary */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <svg
            className="h-6 w-6 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Data Changes Summary
        </h2>

        <div className="space-y-4">
          {/* Change Type Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <span className="text-sm text-gray-300">New Data Added</span>
              </div>
              <span className="text-emerald-400 font-semibold">
                {totals.added.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Data Fixed</span>
              </div>
              <span className="text-blue-400 font-semibold">
                {totals.fixed.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  Invalid Data Removed
                </span>
              </div>
              <span className="text-orange-400 font-semibold">
                {totals.discarded.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Unchanged</span>
              </div>
              <span className="text-gray-400 font-semibold">
                {totals.good.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Visual Distribution Bar */}
          {totalChanges > 0 && (
            <div className="mt-4">
              <div className="h-8 flex overflow-hidden rounded-lg">
                {totals.added > 0 && (
                  <div
                    className="bg-emerald-400 flex items-center justify-center text-xs font-medium text-white"
                    style={{ width: `${(totals.added / totalChanges) * 100}%` }}
                    title={`${((totals.added / totalChanges) * 100).toFixed(
                      1
                    )}%`}
                  />
                )}
                {totals.fixed > 0 && (
                  <div
                    className="bg-blue-400 flex items-center justify-center text-xs font-medium text-white"
                    style={{ width: `${(totals.fixed / totalChanges) * 100}%` }}
                    title={`${((totals.fixed / totalChanges) * 100).toFixed(
                      1
                    )}%`}
                  />
                )}
                {totals.discarded > 0 && (
                  <div
                    className="bg-orange-400 flex items-center justify-center text-xs font-medium text-white"
                    style={{
                      width: `${(totals.discarded / totalChanges) * 100}%`,
                    }}
                    title={`${((totals.discarded / totalChanges) * 100).toFixed(
                      1
                    )}%`}
                  />
                )}
                {totals.good > 0 && (
                  <div
                    className="bg-gray-400 flex items-center justify-center text-xs font-medium text-white"
                    style={{ width: `${(totals.good / totalChanges) * 100}%` }}
                    title={`${((totals.good / totalChanges) * 100).toFixed(
                      1
                    )}%`}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overall Accuracy Improvement */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Average Data Accuracy
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Before Enhancement</span>
            <span className="text-xl font-bold text-gray-300">
              {avgAccuracyBefore.toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">After Enhancement</span>
            <span className="text-xl font-bold text-emerald-400">
              {avgAccuracyAfter.toFixed(1)}%
            </span>
          </div>

          <div className="pt-3 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Improvement</span>
              <div className="flex items-center gap-2">
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
                <span className="text-xl font-bold text-emerald-400">
                  +{(avgAccuracyAfter - avgAccuracyBefore).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Format Analysis - Only show if there's format standardization */}
      {columnMappings.some(
        (m) =>
          m.comparison_stats &&
          m.comparison_stats.crm_format_count > 1 &&
          m.comparison_stats.crm_format_count >
            m.comparison_stats.export_format_count
      ) && (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Format Standardization
          </h3>

          <div className="space-y-3">
            {columnMappings
              .filter(
                (m) =>
                  m.comparison_stats &&
                  m.comparison_stats.crm_format_count > 1 &&
                  m.comparison_stats.crm_format_count >
                    m.comparison_stats.export_format_count
              )
              .slice(0, 5)
              .map((mapping) => (
                <div key={mapping.id} className="text-sm">
                  <div className="text-gray-300 mb-1">{mapping.crm_column}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">
                      {mapping.comparison_stats!.crm_format_count} formats
                    </span>
                    <svg
                      className="h-3 w-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-emerald-400">
                      {mapping.comparison_stats!.export_format_count} format
                    </span>
                  </div>
                </div>
              ))}

            {columnMappings.filter(
              (m) =>
                m.comparison_stats &&
                m.comparison_stats.crm_format_count > 1 &&
                m.comparison_stats.crm_format_count >
                  m.comparison_stats.export_format_count
            ).length > 5 && (
              <div className="text-xs text-gray-500 pt-2">
                +
                {columnMappings.filter(
                  (m) =>
                    m.comparison_stats &&
                    m.comparison_stats.crm_format_count > 1 &&
                    m.comparison_stats.crm_format_count >
                      m.comparison_stats.export_format_count
                ).length - 5}{" "}
                more columns...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
