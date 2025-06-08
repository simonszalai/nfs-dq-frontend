import type { ReportWithRelations } from "../../models/report.server";
import { IssueDistributionChart } from "../charts/IssueDistributionChart";

interface DataQualityOverviewProps {
  issueStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  fieldCategories: {
    critical: ReportWithRelations["fields"];
    warning: ReportWithRelations["fields"];
    good: ReportWithRelations["fields"];
    empty: ReportWithRelations["fields"];
  };
  totalFields: number;
}

export function DataQualityOverview({
  issueStats,
  fieldCategories,
  totalFields,
}: DataQualityOverviewProps) {
  const cards = [
    {
      title: "Critical Issues",
      value: issueStats.critical,
      color: "from-red-500 to-red-600",
      icon: "🚨",
      description: "Immediate attention required",
    },
    {
      title: "High Priority",
      value: issueStats.high,
      color: "from-orange-500 to-orange-600",
      icon: "⚠️",
      description: "Should be addressed soon",
    },
    {
      title: "Medium Priority",
      value: issueStats.medium,
      color: "from-yellow-500 to-yellow-600",
      icon: "📋",
      description: "Plan for improvement",
    },
    {
      title: "Low Priority",
      value: issueStats.low,
      color: "from-blue-500 to-blue-600",
      icon: "ℹ️",
      description: "Monitor over time",
    },
  ];

  // Calculate exact percentages first
  const exactPercentages = [
    (fieldCategories.empty.length / totalFields) * 100,
    (fieldCategories.critical.length / totalFields) * 100,
    (fieldCategories.warning.length / totalFields) * 100,
    (fieldCategories.good.length / totalFields) * 100,
  ];

  // Round percentages and ensure they add up to 100%
  const roundedPercentages = exactPercentages.map((p) => Math.floor(p));
  const remainder = 100 - roundedPercentages.reduce((sum, p) => sum + p, 0);

  // Distribute the remainder based on decimal parts
  const decimalParts = exactPercentages.map((p, i) => ({
    index: i,
    decimal: p - roundedPercentages[i],
  }));
  decimalParts.sort((a, b) => b.decimal - a.decimal);

  // Add 1% to the categories with the largest decimal parts
  for (let i = 0; i < remainder; i++) {
    roundedPercentages[decimalParts[i].index]++;
  }

  const fieldStats = [
    {
      label: "Empty Fields",
      count: fieldCategories.empty.length,
      percentage: roundedPercentages[0],
      color: "bg-red-500",
    },
    {
      label: "Critical Fields",
      count: fieldCategories.critical.length,
      percentage: roundedPercentages[1],
      color: "bg-orange-500",
    },
    {
      label: "Warning Fields",
      count: fieldCategories.warning.length,
      percentage: roundedPercentages[2],
      color: "bg-yellow-500",
    },
    {
      label: "Good Fields",
      count: fieldCategories.good.length,
      percentage: roundedPercentages[3],
      color: "bg-emerald-500",
    },
  ];

  // Prepare data for donut chart
  const donutData = [
    { label: "Critical", value: issueStats.critical, color: "#ef4444" },
    { label: "High", value: issueStats.high, color: "#f97316" },
    { label: "Medium", value: issueStats.medium, color: "#f59e0b" },
    { label: "Low", value: issueStats.low, color: "#3b82f6" },
  ].filter((item) => item.value > 0);

  return (
    <div className="mb-8">
      {/* Issue Stats with Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Issue Distribution Chart */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-lg rounded-sm p-6 border border-white/20 h-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Issue Distribution
            </h3>
            <div className="h-64">
              <IssueDistributionChart
                data={donutData}
                centerText={issueStats.total.toString()}
                centerSubtext="Total Issues"
              />
            </div>
          </div>
        </div>

        {/* Issue Stats Cards */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white/10 backdrop-blur-lg rounded-sm p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                    <p
                      className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
                    >
                      {card.value}
                    </p>
                  </div>
                  <span className="text-3xl">{card.icon}</span>
                </div>
                <p className="text-gray-400 text-xs">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Field Distribution */}
      <div className="bg-white/10 backdrop-blur-lg rounded-sm p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">
          Field Distribution Analysis
        </h3>

        {/* Stacked Bar Chart */}
        <div className="mb-6">
          <div className="h-8 bg-white/5 rounded-md overflow-hidden flex">
            {fieldStats.map((stat) => (
              <div
                key={stat.label}
                className={`${stat.color} transition-all duration-1000`}
                style={{ width: `${stat.percentage}%` }}
                title={`${stat.label}: ${stat.count} (${stat.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fieldStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className={`w-4 h-4 ${stat.color}`} />
              <div>
                <p className="text-gray-300 text-sm">{stat.label}</p>
                <p className="text-white font-semibold">
                  {stat.count}{" "}
                  <span className="text-gray-400 text-sm">
                    ({stat.percentage}%)
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
