import { format } from "date-fns";

interface ReportHeaderProps {
  companyName: string;
  generatedAt: Date | string;
  totalRecords: number;
  totalFields: number;
  dataQualityScore: number;
}

export function ReportHeader({
  companyName,
  generatedAt,
  totalRecords,
  totalFields,
  dataQualityScore,
}: ReportHeaderProps) {
  const date =
    typeof generatedAt === "string" ? new Date(generatedAt) : generatedAt;

  return (
    <div className="mb-8">
      {/* Main header card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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

          {/* Quality Score Circle */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={
                    dataQualityScore >= 80
                      ? "#10b981"
                      : dataQualityScore >= 60
                      ? "#f59e0b"
                      : "#ef4444"
                  }
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(dataQualityScore / 100) * 352} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {dataQualityScore}%
                </span>
                <span className="text-xs text-gray-400">Quality Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Total Records</p>
            <p className="text-2xl font-semibold text-white mt-1">
              {totalRecords.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Fields</p>
            <p className="text-2xl font-semibold text-white mt-1">
              {totalFields.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Fields Analyzed</p>
            <p className="text-2xl font-semibold text-white mt-1">
              {totalFields.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Report Status</p>
            <p className="text-2xl font-semibold text-emerald-400 mt-1">
              Complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
