interface EnhancementHeaderProps {
  createdAt: Date;
  totalRows: number;
  dataImprovementRate: number;
  totalDataPointsAdded: number;
  totalDataPointsDeleted: number;
  totalDataPointsEnhanced: number;
  enhancementCoverage: number;
  recordsModified: number;
}

export function EnhancementHeader({
  createdAt,
  totalRows,
  dataImprovementRate,
  totalDataPointsAdded,
  totalDataPointsDeleted,
  totalDataPointsEnhanced,
  enhancementCoverage,
  recordsModified,
}: EnhancementHeaderProps) {
  return (
    <div className="mb-8">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <svg
                className="h-10 w-10 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Data Enhancement Report
            </h1>
            <div className="flex items-center gap-2 text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">
                Generated {new Date(createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-emerald-400">
              {enhancementCoverage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Enhancement Coverage
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <svg
                className="h-8 w-8 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {recordsModified.toLocaleString()} of{" "}
                  {totalRows.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Records Enhanced</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <svg
                className="h-8 w-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {totalDataPointsAdded.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Data Points Added</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {totalDataPointsDeleted.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  Invalid Data Points Deleted
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <svg
                className="h-8 w-8 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {totalDataPointsEnhanced.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  Data Points Enhanced
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
