interface EnhancementOverviewProps {
  totalCrmColumns: number;
  totalExportColumns: number;
  newColumnsCount: number;
  manyToOneCount: number;
  columnsReducedByMerging: number;
  exportColumnsCreated: number;
}

export function EnhancementOverview({
  totalCrmColumns,
  totalExportColumns,
  newColumnsCount,
  manyToOneCount,
  columnsReducedByMerging,
  exportColumnsCreated,
}: EnhancementOverviewProps) {
  return (
    <div className="mb-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <svg
            className="h-6 w-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Enhancement Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Original vs Enhanced Columns */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">CRM Columns</span>
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white">
              {totalCrmColumns}
            </div>
            <div className="text-xs text-gray-500 mt-1">Original dataset</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Export Columns</span>
              <svg
                className="h-4 w-4 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white">
              {totalExportColumns}
            </div>
            <div className="text-xs text-emerald-400 mt-1">
              Enhanced dataset
            </div>
          </div>

          {/* New Columns Added */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">New Columns</span>
              <svg
                className="h-4 w-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white">
              {newColumnsCount}
            </div>
            <div className="text-xs text-blue-400 mt-1">Added from export</div>
          </div>

          {/* Many-to-One Mappings */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Many-to-One</span>
              <svg
                className="h-4 w-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white">
              {manyToOneCount}
            </div>
            <div className="text-xs text-purple-400 mt-1">Merged mappings</div>
          </div>

          {/* Columns Reduced */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Merged Away</span>
              <svg
                className="h-4 w-4 text-orange-400"
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
            </div>
            <div className="text-2xl font-bold text-white">
              {columnsReducedByMerging}
            </div>
            <div className="text-xs text-orange-400 mt-1">
              Columns consolidated
            </div>
          </div>

          {/* Export Columns Created */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Created</span>
              <svg
                className="h-4 w-4 text-cyan-400"
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
            </div>
            <div className="text-2xl font-bold text-white">
              {exportColumnsCreated}
            </div>
            <div className="text-xs text-cyan-400 mt-1">New export columns</div>
          </div>
        </div>

        {/* Net Change Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Net Column Change</span>
            <div className="flex items-center gap-2">
              {totalExportColumns > totalCrmColumns ? (
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
              ) : (
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
              )}
              <span
                className={`text-lg font-semibold ${
                  totalExportColumns > totalCrmColumns
                    ? "text-emerald-400"
                    : "text-orange-400"
                }`}
              >
                {Math.abs(totalExportColumns - totalCrmColumns)} columns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
