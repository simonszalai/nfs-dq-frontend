import { format } from "date-fns";

interface ReportHeaderProps {
  companyName: string;
  generatedAt: Date | string;
  totalRecords: number;
  totalFields: number;
  fieldsWithIssues: number;
  dataQualityScore: number;
  issueStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  populationStats?: {
    empty: number; // 0%
    low: number; // >0-25%
    medium: number; // 25-75%
    high: number; // >75%
  };
}

export function ReportHeader({
  companyName,
  generatedAt,
  totalRecords,
  totalFields,
  fieldsWithIssues,
  dataQualityScore,
  issueStats,
  populationStats,
}: ReportHeaderProps) {
  const date =
    typeof generatedAt === "string" ? new Date(generatedAt) : generatedAt;

  // Get color for quality score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  // Calculate percentage of columns without issues
  const columnsWithoutIssues = totalFields - fieldsWithIssues;
  const percentageWithoutIssues =
    totalFields > 0
      ? Math.round((columnsWithoutIssues / totalFields) * 100)
      : 0;

  return (
    <div className="mb-6 space-y-6">
      {/* Company and Report Info */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          {companyName}
        </h1>
        <p className="text-xl text-gray-300">Data Quality Analysis</p>
        <p className="text-sm text-gray-500">
          {format(date, "MMMM d, yyyy 'at' h:mm a")}
        </p>
      </div>

      {/* Main Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quality Score Card - Featured */}
        <div className="md:col-span-1 relative overflow-hidden rounded-sm bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 p-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl"></div>
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                Data Quality Score
              </p>
              <span
                className={`text-8xl font-bold ${getScoreColor(
                  dataQualityScore
                )}`}
              >
                {dataQualityScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Data Overview */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-sm bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/8 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {totalRecords.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">Total Records</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-sm bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/8 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {totalFields.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">Data Fields</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Summary */}
        <div className="md:col-span-1 rounded-sm bg-white/5 backdrop-blur-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-400 uppercase tracking-wider">
              Issue Summary
            </p>
            <div className="w-10 h-10 bg-orange-500/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Fields with Issues</span>
              <span className="text-2xl font-bold text-white">
                {fieldsWithIssues}
              </span>
            </div>
            <div className="space-y-2">
              {issueStats.critical > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-400">Critical</span>
                  <span className="text-red-400 font-medium">
                    {issueStats.critical}
                  </span>
                </div>
              )}
              {issueStats.high > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-400">High</span>
                  <span className="text-orange-400 font-medium">
                    {issueStats.high}
                  </span>
                </div>
              )}
              {issueStats.medium > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-400">Medium</span>
                  <span className="text-yellow-400 font-medium">
                    {issueStats.medium}
                  </span>
                </div>
              )}
              {issueStats.low > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-400">Low</span>
                  <span className="text-blue-400 font-medium">
                    {issueStats.low}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Field Population Distribution Bar */}
      {populationStats && (
        <div className="rounded-sm bg-white/5 backdrop-blur-lg border border-white/10 p-6">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
            Field Population Distribution
          </p>
          <div className="space-y-4">
            {/* Population bars */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-8 flex overflow-hidden">
                  {populationStats.high > 0 && (
                    <div
                      className="bg-emerald-500 flex items-center justify-center text-white text-sm font-medium transition-all hover:opacity-80"
                      style={{
                        width: `${(populationStats.high / totalFields) * 100}%`,
                      }}
                      title={`${populationStats.high} fields with >75% population`}
                    >
                      {populationStats.high}
                    </div>
                  )}
                  {populationStats.medium > 0 && (
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-white text-sm font-medium transition-all hover:opacity-80"
                      style={{
                        width: `${
                          (populationStats.medium / totalFields) * 100
                        }%`,
                      }}
                      title={`${populationStats.medium} fields with 25-75% population`}
                    >
                      {populationStats.medium}
                    </div>
                  )}
                  {populationStats.low > 0 && (
                    <div
                      className="bg-orange-500 flex items-center justify-center text-white text-sm font-medium transition-all hover:opacity-80"
                      style={{
                        width: `${(populationStats.low / totalFields) * 100}%`,
                      }}
                      title={`${populationStats.low} fields with <25% population`}
                    >
                      {populationStats.low}
                    </div>
                  )}
                  {populationStats.empty > 0 && (
                    <div
                      className="bg-red-500 flex items-center justify-center text-white text-sm font-medium transition-all hover:opacity-80"
                      style={{
                        width: `${
                          (populationStats.empty / totalFields) * 100
                        }%`,
                      }}
                      title={`${populationStats.empty} empty fields`}
                    >
                      {populationStats.empty}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500"></div>
                <span className="text-gray-400">&gt;75% populated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500"></div>
                <span className="text-gray-400">25-75% populated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500"></div>
                <span className="text-gray-400">&lt;25% populated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500"></div>
                <span className="text-gray-400">Empty</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
