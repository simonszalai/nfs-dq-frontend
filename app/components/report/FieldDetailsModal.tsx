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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
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
            {field.format_count && (
              <span className="text-gray-400">
                Formats:{" "}
                <span className="text-gray-300">{field.format_count}</span>
              </span>
            )}
          </div>
        </div>

        {/* Population Stats */}
        <div className="bg-white/5 rounded-md p-6 mb-6">
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
          <div className="bg-white/5 rounded-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Warnings ({field.warnings.length})
            </h3>
            <div className="space-y-3">
              {field.warnings.map((warning) => (
                <div key={warning.id} className="flex items-start gap-3">
                  <span
                    className={`text-lg ${getSeverityColor(warning.severity)}`}
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
                    <p className="text-white">{warning.message}</p>
                    <p
                      className={`text-sm mt-1 ${getSeverityColor(
                        warning.severity
                      )}`}
                    >
                      {warning.type.replace(/_/g, " ").toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            Recommendations
          </h3>
          <ul className="space-y-2 text-gray-300">
            {populationRate === 0 && (
              <li>• Consider removing this field if it's no longer needed</li>
            )}
            {populationRate > 0 && populationRate < 25 && (
              <li>• Implement data enrichment to fill missing values</li>
            )}
            {field.format_count && field.format_count > 3 && (
              <li>• Standardize data format to improve consistency</li>
            )}
            {field.warnings.some((w) => w.type === "DUPLICATE_DATA") && (
              <li>• Review and deduplicate redundant data</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
