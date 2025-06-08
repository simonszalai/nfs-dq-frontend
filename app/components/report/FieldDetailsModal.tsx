import { useEffect } from "react";
import type { ReportWithRelations } from "../../models/report.server";

interface FieldDetailsModalProps {
  field: ReportWithRelations["fields"][0];
  totalRecords: number;
  onClose: () => void;
}

export function FieldDetailsModal({
  field,
  totalRecords,
  onClose,
}: FieldDetailsModalProps) {
  const populationRate = Math.round(
    (field.populated_count / totalRecords) * 100
  );

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, " ").toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-sm p-8 max-w-2xl w-full max-h-[90vh] flex flex-col border border-white/20 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {field.column_name}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">
              Type: <span className="text-gray-300">{field.inferred_type}</span>
            </span>
          </div>
        </div>

        {/* Population Stats */}
        <div className="bg-white/5 rounded-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Population Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Population Rate</p>
              <p className="text-3xl font-bold text-white">{populationRate}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Populated Records</p>
              <p className="text-3xl font-bold text-white">
                {field.populated_count.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-4">
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  populationRate === 0
                    ? "bg-gray-600"
                    : populationRate < 25
                    ? "bg-red-500"
                    : populationRate < 70
                    ? "bg-orange-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${populationRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Warnings */}
        {field.warnings.length > 0 && (
          <div className="bg-white/5 rounded-sm p-6 flex flex-col min-h-0">
            <h3 className="text-lg font-semibold text-white mb-4 flex-shrink-0">
              Warnings ({field.warnings.length})
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-24rem)] pr-2">
              {field.warnings.map((warning) => (
                <div key={warning.id} className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-lg ${getSeverityColor(
                        warning.severity
                      )}`}
                    >
                      {warning.severity === "CRITICAL"
                        ? "🚨"
                        : warning.severity === "HIGH"
                        ? "⚠️"
                        : warning.severity === "MEDIUM"
                        ? "📋"
                        : "ℹ️"}
                    </span>
                    <div className="flex-1">
                      <p className="text-white mb-2">{warning.message}</p>
                      <div className="flex gap-2 items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getSeverityBgColor(
                            warning.severity
                          )}`}
                        >
                          {warning.severity}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                          {formatCategoryName(warning.type)}
                        </span>
                      </div>
                      {warning.meta && (
                        <>
                          {(warning.meta as any).affected_count && (
                            <div className="mt-2 text-sm text-gray-400">
                              Affected records:{" "}
                              <span className="text-gray-300">
                                {(
                                  warning.meta as any
                                ).affected_count.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {(warning.meta as any).examples && (
                            <div className="mt-3 p-3 bg-black/20 rounded-sm">
                              <p className="text-xs text-gray-400 mb-1">
                                Examples:
                              </p>
                              <div className="text-sm text-gray-300 font-mono">
                                {Array.isArray((warning.meta as any).examples)
                                  ? (warning.meta as any).examples.join(", ")
                                  : (warning.meta as any).examples}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
