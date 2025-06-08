interface RecommendedActionsProps {
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
  issueStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
}

export function RecommendedActions({
  report,
  issueStats,
}: RecommendedActionsProps) {
  // Categorize fields directly in the component
  const categorizeFields = () => {
    const categories = {
      empty: [] as typeof report.fields,
      critical: [] as typeof report.fields,
      warning: [] as typeof report.fields,
      good: [] as typeof report.fields,
    };

    report.fields.forEach((field) => {
      const populationRate =
        (field.populated_count / report.total_records) * 100;

      if (populationRate === 0) {
        categories.empty.push(field);
      } else if (populationRate < 25) {
        categories.critical.push(field);
      } else if (populationRate < 70) {
        categories.warning.push(field);
      } else {
        categories.good.push(field);
      }
    });

    return categories;
  };

  const categories = categorizeFields();

  // Calculate statistics for recommendations
  const emptyFieldsCount = categories.empty.length;
  const sparseFieldsCount = categories.critical.length;
  const inconsistentFieldsCount = report.fields.filter((f) =>
    f.warnings.some(
      (w) =>
        w.message.toLowerCase().includes("inconsistent") ||
        w.message.toLowerCase().includes("format")
    )
  ).length;

  const totalProblematicFields =
    emptyFieldsCount + sparseFieldsCount + inconsistentFieldsCount;
  const reductionPercentage = Math.round(
    (totalProblematicFields / report.total_fields) * 100
  );

  // Only show if there are actual issues
  if (issueStats.total === 0 && totalProblematicFields === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">🧹</span>
          Recommended Actions
        </h2>

        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <p className="text-lg font-semibold text-white mb-4">
            Immediate Priority: Remove {totalProblematicFields}{" "}
            unused/problematic fields ({reductionPercentage}% reduction)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {emptyFieldsCount > 0 && (
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                  <span>🗑️</span> Delete ({emptyFieldsCount} fields)
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Completely empty properties</li>
                  <li>• Deprecated custom fields</li>
                  <li>• Duplicate data points</li>
                </ul>
              </div>
            )}

            {sparseFieldsCount > 0 && (
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                  <span>🔧</span> Fix & Enrich ({sparseFieldsCount} fields)
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Critical business fields</li>
                  <li>• Revenue and funding data</li>
                  <li>• Contact information</li>
                </ul>
              </div>
            )}

            {inconsistentFieldsCount > 0 && (
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                  <span>📝</span> Normalize ({inconsistentFieldsCount} fields)
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Standardize formats</li>
                  <li>• Consolidate variants</li>
                  <li>• Apply consistent naming</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Show specific recommendations based on critical issues */}
        {issueStats.critical > 0 && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 font-medium">
              ⚠️ Critical: {issueStats.critical} critical issues found that
              require immediate attention
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
