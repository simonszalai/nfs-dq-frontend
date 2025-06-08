import { useState } from "react";
import type { ReportWithRelations } from "../../models/report.server";
import { FieldDetailsModal } from "./FieldDetailsModal";

interface DataQualityCardsProps {
  report: ReportWithRelations;
  columns: Array<{
    categorySlug: string;
    name: string;
    columnName: string;
    fillPercentage: number;
    field?: ReportWithRelations["fields"][0];
    warnings: Array<{
      id: string;
      message: string;
      severity: string;
    }>;
  }>;
}

// Hardcoded categories
const CATEGORIES = [
  {
    slug: "company_info",
    title: "Company Info",
    icon: "🏢",
    description: "Core company details and online presence",
  },
  {
    slug: "financial_data",
    title: "Financial Data",
    icon: "💰",
    description: "Revenue, funding, and financial metrics",
  },
  {
    slug: "size_and_structure",
    title: "Size & Structure",
    icon: "👥",
    description: "Employee count, leadership, and locations",
  },
];

export function DataQualityCards({ report, columns }: DataQualityCardsProps) {
  const [selectedField, setSelectedField] = useState<
    ReportWithRelations["fields"][0] | null
  >(null);

  // Group columns by category
  const columnsByCategory = columns.reduce((acc, column) => {
    if (!acc[column.categorySlug]) {
      acc[column.categorySlug] = [];
    }
    acc[column.categorySlug].push(column);
    return acc;
  }, {} as Record<string, typeof columns>);

  // Get column warnings (including fill rate warnings)
  const getColumnWarnings = (column: (typeof columns)[0]) => {
    const warnings: Array<{
      id: string;
      message: string;
      severity: "critical" | "warning" | "info";
    }> = [];

    // Add warnings for low fill rate
    if (column.fillPercentage === 0) {
      warnings.push({
        id: `${column.columnName}-fill`,
        message: "Completely empty",
        severity: "critical",
      });
    } else if (column.fillPercentage < 25) {
      warnings.push({
        id: `${column.columnName}-fill`,
        message: "Very low data coverage",
        severity: "critical",
      });
    } else if (column.fillPercentage < 75) {
      warnings.push({
        id: `${column.columnName}-fill`,
        message: "Incomplete data",
        severity: "warning",
      });
    }

    // Add column-specific warnings from the data
    column.warnings.forEach((warning) => {
      warnings.push({
        id: warning.id,
        message: warning.message,
        severity: warning.severity.toLowerCase() as
          | "critical"
          | "warning"
          | "info",
      });
    });

    return warnings;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {CATEGORIES.map((category) => {
          const categoryColumns = columnsByCategory[category.slug] || [];

          return (
            <div
              key={category.slug}
              className="bg-white/10 backdrop-blur-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col"
            >
              {/* Header section */}
              <div className="flex-shrink-0">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-white">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Chart section with warning indicators */}
              <div className="flex-grow flex items-end">
                {categoryColumns.length > 0 ? (
                  <div className="w-full space-y-4">
                    {categoryColumns.map((column) => {
                      const columnWarnings = getColumnWarnings(column);
                      const warningCount = columnWarnings.length;
                      const hasCritical = columnWarnings.some(
                        (w) => w.severity === "critical"
                      );

                      return (
                        <div key={column.columnName} className="space-y-1">
                          {/* Title row with warning indicator */}
                          <div className="flex items-center gap-2">
                            {/* Warning indicator or checkmark */}
                            {warningCount > 0 ? (
                              <button
                                onClick={() => {
                                  if (column.field) {
                                    setSelectedField(column.field);
                                  }
                                }}
                                className={`flex items-center rounded-full gap-1 px-2 py-0.5 text-xs font-medium transition-all hover:scale-105 ${
                                  hasCritical
                                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                    : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                                }`}
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                  />
                                </svg>
                                {warningCount}
                              </button>
                            ) : (
                              <span className="text-green-400">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </span>
                            )}
                            <div className="text-sm text-gray-300">
                              {column.name}
                            </div>
                          </div>

                          {/* Progress bar row */}
                          <div className="flex items-center gap-2">
                            <div className="relative rounded-sm h-3 bg-gray-200/20 overflow-hidden flex-grow">
                              <div
                                className={`absolute inset-0 rounded-r-sm bg-gradient-to-r ${
                                  column.fillPercentage < 25
                                    ? "from-red-500 to-red-400"
                                    : column.fillPercentage < 75
                                    ? "from-orange-500 to-orange-400"
                                    : "from-green-500 to-green-400"
                                }`}
                                style={{
                                  width: `${column.fillPercentage}%`,
                                }}
                              />
                            </div>
                            <div
                              className={`text-sm tabular-nums ${
                                column.fillPercentage < 25
                                  ? "text-red-400"
                                  : column.fillPercentage < 75
                                  ? "text-orange-400"
                                  : "text-green-400"
                              }`}
                            >
                              {column.fillPercentage}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full text-center py-8 text-gray-400">
                    <p className="text-sm">No fields in this category</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Column-specific Warning Modal */}
      {selectedField && (
        <FieldDetailsModal
          field={selectedField}
          totalRecords={report.total_records}
          onClose={() => setSelectedField(null)}
        />
      )}
    </>
  );
}
