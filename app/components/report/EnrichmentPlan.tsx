interface EnrichmentPlanProps {
  report: {
    fields: Array<{
      id: string;
      column_name: string;
      populated_count: number;
      warnings: Array<{
        id: string;
        message: string;
        severity: string;
      }>;
    }>;
    total_records: number;
    total_fields: number;
  };
  columns: Array<{
    categorySlug: string;
    name: string;
    columnName: string;
    fillPercentage: number;
    warnings: Array<{
      id: string;
      message: string;
      severity: string;
    }>;
  }>;
}

export function EnrichmentPlan({ report, columns }: EnrichmentPlanProps) {
  // Analyze the data to determine which enrichment strategies to show
  const hasRevenueMissing = columns.some(
    (col) =>
      col.name.toLowerCase().includes("revenue") && col.fillPercentage < 25
  );

  const hasFundingMissing = columns.some(
    (col) =>
      (col.name.toLowerCase().includes("funding") ||
        col.name.toLowerCase().includes("investment")) &&
      col.fillPercentage < 25
  );

  const hasContactMissing = columns.some(
    (col) =>
      (col.name.toLowerCase().includes("linkedin") ||
        col.name.toLowerCase().includes("website") ||
        col.name.toLowerCase().includes("email") ||
        col.name.toLowerCase().includes("phone")) &&
      col.fillPercentage < 50
  );

  const hasIndustryIssues = columns.some(
    (col) =>
      col.name.toLowerCase().includes("industry") &&
      (col.fillPercentage < 70 || col.warnings.length > 0)
  );

  const hasFormatIssues = report.fields.some((f) =>
    f.warnings.some(
      (w) =>
        w.message.toLowerCase().includes("format") ||
        w.message.toLowerCase().includes("inconsistent")
    )
  );

  // Only show if there are enrichment opportunities
  if (
    !hasRevenueMissing &&
    !hasFundingMissing &&
    !hasContactMissing &&
    !hasIndustryIssues &&
    !hasFormatIssues
  ) {
    return null;
  }

  const enrichmentItems = [];

  if (hasRevenueMissing || hasFundingMissing) {
    enrichmentItems.push({
      icon: "🔍",
      title: "Data Discovery & Enrichment",
      description:
        "Fill critical gaps in revenue, funding, and financial data using premium data sources",
      priority: "high",
    });
  }

  if (hasIndustryIssues || hasFormatIssues) {
    enrichmentItems.push({
      icon: "🏗️",
      title: "Standardization & Normalization",
      description:
        "Clean and standardize industry classifications, company sizes, and contact formats",
      priority: "medium",
    });
  }

  const emptyFieldsCount = report.fields.filter(
    (f) => f.populated_count === 0
  ).length;
  if (emptyFieldsCount > 10) {
    enrichmentItems.push({
      icon: "🧹",
      title: "CRM Cleanup",
      description: `Remove ${emptyFieldsCount} unused fields to improve performance and user adoption`,
      priority: "medium",
    });
  }

  enrichmentItems.push({
    icon: "🎯",
    title: "Quality Validation",
    description: "Implement ongoing data quality checks and validation rules",
    priority: "low",
  });

  enrichmentItems.push({
    icon: "📊",
    title: "Results Reporting",
    description:
      "Provide detailed before/after analysis showing tangible improvements",
    priority: "low",
  });

  return (
    <div className="mt-8 mb-8">
      <div className="bg-gradient-to-br from-green-900/90 to-green-800/90 rounded-2xl p-8 border border-green-700">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          Our Enrichment Plan
        </h2>

        <p className="text-green-100 text-lg mb-6">
          Based on this analysis, we'll focus on these high-impact improvements:
        </p>

        <div className="space-y-4">
          {enrichmentItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg border border-green-700/50 hover:bg-gray-900/40 transition-colors"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{item.title}:</h3>
                <p className="text-green-100">{item.description}</p>
              </div>
              {item.priority === "high" && (
                <span className="px-3 py-1 bg-red-900/50 text-red-300 text-xs font-semibold rounded-full">
                  HIGH PRIORITY
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Add specific warnings if critical data is missing */}
        {(hasRevenueMissing || hasFundingMissing) && (
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <p className="text-yellow-300 font-medium">
              ⚠️ Critical financial data is severely lacking - this
              significantly impacts your ability to qualify and prioritize leads
            </p>
          </div>
        )}

        {hasContactMissing && (
          <div className="mt-4 p-4 bg-orange-900/20 border border-orange-700 rounded-lg">
            <p className="text-orange-300 font-medium">
              📧 Contact information gaps detected - enrichment will improve
              outreach effectiveness
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
