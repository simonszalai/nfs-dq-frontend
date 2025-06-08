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
    <div className="mb-8">
      {/* Main header card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20 shadow-xl">
        <div className="flex flex-col gap-6">
          {/* Top Section - Company info and Quality Score */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left side - Company info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {companyName}
              </h1>
              <p className="text-gray-300 text-lg">
                Data Quality Analysis Report
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Generated {format(date, "PPP 'at' p")}
              </p>
            </div>

            {/* Right side - Quality Score (now more prominent) */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Data Quality Score</p>
                <p
                  className={`text-5xl lg:text-6xl font-bold ${getScoreColor(
                    dataQualityScore
                  )} cursor-help transition-all hover:scale-105`}
                  title={`${percentageWithoutIssues}% of columns without any issues`}
                >
                  {dataQualityScore}%
                </p>
              </div>

              {/* Metrics Cards */}
              <div className="flex gap-3 lg:gap-4">
                <div className="bg-white/5 rounded-lg px-3 lg:px-4 py-2 lg:py-3 border border-white/10">
                  <p className="text-gray-400 text-xs">Records</p>
                  <p className="text-white font-semibold text-base lg:text-lg">
                    {totalRecords.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg px-3 lg:px-4 py-2 lg:py-3 border border-white/10">
                  <p className="text-gray-400 text-xs">Fields</p>
                  <p className="text-white font-semibold text-base lg:text-lg">
                    {totalFields.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg px-3 lg:px-4 py-2 lg:py-3 border border-white/10">
                  <p className="text-gray-400 text-xs">Issues</p>
                  <p className="text-white font-semibold text-base lg:text-lg">
                    {fieldsWithIssues.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Severity Distribution */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-sm text-gray-400 mb-4">
            Issue Severity Distribution
          </h3>
          <IssueSeverityBar issueStats={issueStats} />
        </div>
      </div>
    </div>
  );
}
