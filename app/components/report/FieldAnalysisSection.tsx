import { useEffect, useState } from "react";
import type { ReportWithRelations } from "../../models/report.server";
import { FieldPopulationChart } from "../charts/FieldPopulationChart";
import { FieldDetailsModal } from "./FieldDetailsModal";

interface FieldAnalysisSectionProps {
  fields: ReportWithRelations["fields"];
  totalRecords: number;
}

export function FieldAnalysisSection({
  fields,
  totalRecords,
}: FieldAnalysisSectionProps) {
  const [selectedField, setSelectedField] = useState<
    ReportWithRelations["fields"][0] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter fields based on search term
  const filteredFields = fields.filter((field) =>
    field.column_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Prepare data for chart - filtered fields ordered by population rate descending
  const chartData = filteredFields
    .map((field) => ({
      name: field.column_name,
      value: Math.round((field.populated_count / totalRecords) * 100),
      populatedCount: field.populated_count,
      warnings: field.warnings.length,
    }))
    .sort((a, b) => b.value - a.value); // Sort by population rate descending

  // Sort filtered fields alphabetically for the scrollable list
  const fieldsAlphabetical = [...filteredFields].sort((a, b) =>
    a.column_name.localeCompare(b.column_name)
  );

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 relative z-20">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Field Analysis
          </h3>

          {/* Search Input */}
          <div className="relative">
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search columns..."
              className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-6">
          <h4 className="text-sm text-gray-400 mb-4">
            Fields by Population Rate (Click to view details) -{" "}
            {chartData.length} fields
          </h4>
          <div className="h-80 relative bg-white/5 rounded-lg overflow-hidden py-3">
            {chartData.length > 0 ? (
              <FieldPopulationChart
                data={chartData}
                onFieldClick={(field) => {
                  const fullField = fields.find(
                    (f) => f.column_name === field.name
                  );
                  if (fullField) setSelectedField(fullField);
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                {debouncedSearchTerm ? (
                  <p>No columns match "{debouncedSearchTerm}"</p>
                ) : (
                  <p>No data to display</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Field List */}
        {fieldsAlphabetical.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {fieldsAlphabetical.map((field) => {
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
                  className="bg-white/5 rounded p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer"
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
                      <div className="w-24 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full ${severityColor} rounded-full transition-all duration-300`}
                          style={{ width: `${populationRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
