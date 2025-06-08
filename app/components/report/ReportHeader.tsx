import { format } from "date-fns";
import { IssueSeverityBar } from "../charts/IssueSeverityBar";

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
}

export function ReportHeader({
  companyName,
  generatedAt,
  totalRecords,
  totalFields,
  fieldsWithIssues,
  dataQualityScore,
  issueStats,
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
    <div className="mb-8 space-y-6">
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
        <div className="md:col-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 p-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
              Overall Score
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-6xl font-bold ${getScoreColor(
                  dataQualityScore
                )}`}
              >
                {dataQualityScore}
              </span>
              <span className="text-2xl text-gray-400">%</span>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {percentageWithoutIssues}% columns clean
            </p>
          </div>
        </div>

        {/* Data Overview */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/8 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {totalRecords.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">Total Records</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
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

          <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:bg-white/8 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {totalFields.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">Data Fields</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
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
        <div className="md:col-span-1 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-400 uppercase tracking-wider">
              Issue Summary
            </p>
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
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

      {/* Issue Distribution Bar */}
      {issueStats.total > 0 && (
        <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
            Issue Distribution
          </p>
          <IssueSeverityBar issueStats={issueStats} />
        </div>
      )}
    </div>
  );
}
