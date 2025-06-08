import { useState } from "react";
import type { ReportWithRelations } from "../../models/report.server";
import { FieldPopulationChart } from "../charts/FieldPopulationChart";
import { FieldDetailsModal } from "./FieldDetailsModal";

interface FieldAnalysisSectionProps {
  fieldCategories: {
    critical: ReportWithRelations["fields"];
    warning: ReportWithRelations["fields"];
    good: ReportWithRelations["fields"];
    empty: ReportWithRelations["fields"];
  };
  totalRecords: number;
}

export function FieldAnalysisSection({
  fieldCategories,
  totalRecords,
}: FieldAnalysisSectionProps) {
  const [selectedField, setSelectedField] = useState<
    ReportWithRelations["fields"][0] | null
  >(null);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "critical" | "warning" | "good" | "empty"
  >("all");

  const categories = [
    { key: "all", label: "All Fields", color: "bg-gray-500" },
    {
      key: "critical",
      label: "Critical",
      color: "bg-red-500",
      count: fieldCategories.critical.length,
    },
    {
      key: "warning",
      label: "Warning",
      color: "bg-orange-500",
      count: fieldCategories.warning.length,
    },
    {
      key: "good",
      label: "Good",
      color: "bg-emerald-500",
      count: fieldCategories.good.length,
    },
    {
      key: "empty",
      label: "Empty",
      color: "bg-gray-600",
      count: fieldCategories.empty.length,
    },
  ];

  const getFieldsToDisplay = () => {
    if (activeCategory === "all") {
      return [
        ...fieldCategories.critical,
        ...fieldCategories.warning,
        ...fieldCategories.good,
        ...fieldCategories.empty,
      ];
    }
    return fieldCategories[activeCategory];
  };

  const fieldsToDisplay = getFieldsToDisplay();

  // Prepare data for Rosen chart
  const chartData = fieldsToDisplay.slice(0, 20).map((field) => ({
    name: field.column_name,
    value: Math.round((field.populated_count / totalRecords) * 100),
    populatedCount: field.populated_count,
    warnings: field.warnings.length,
  }));

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Field Analysis
          </h3>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key as any)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  activeCategory === category.key
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category.label}
                {category.count !== undefined && (
                  <span className="ml-2 text-sm">({category.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        {chartData.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm text-gray-400 mb-4">
              Top Fields by Population Rate
            </h4>
            <div className="h-80 relative">
              <FieldPopulationChart
                data={chartData}
                onFieldClick={(field) => {
                  const fullField = fieldsToDisplay.find(
                    (f) => f.column_name === field.name
                  );
                  if (fullField) setSelectedField(fullField);
                }}
              />
            </div>
          </div>
        )}

        {/* Field List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {fieldsToDisplay.map((field) => {
            const populationRate = Math.round(
              (field.populated_count / totalRecords) * 100
            );
            const severityColor =
              populationRate === 0
                ? "bg-gray-600"
                : populationRate < 25
                ? "bg-red-500"
                : populationRate < 70
                ? "bg-orange-500"
                : "bg-emerald-500";

            return (
              <div
                key={field.id}
                onClick={() => setSelectedField(field)}
                className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">
                      {field.column_name}
                    </h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-400 text-sm">
                        Type:{" "}
                        <span className="text-gray-300">
                          {field.inferred_type}
                        </span>
                      </span>
                      {field.warnings.length > 0 && (
                        <span className="text-orange-400 text-sm">
                          ⚠️ {field.warnings.length} warning
                          {field.warnings.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {populationRate}%
                    </div>
                    <div className="text-gray-400 text-sm">
                      {field.populated_count.toLocaleString()} records
                    </div>
                    <div
                      className={`w-24 h-2 ${severityColor} rounded-full mt-2`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Details Modal */}
      {selectedField && (
        <FieldDetailsModal
          field={selectedField}
          totalRecords={totalRecords}
          onClose={() => setSelectedField(null)}
        />
      )}
    </>
  );
}
