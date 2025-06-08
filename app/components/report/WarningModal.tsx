interface Warning {
  id: string;
  field: string;
  issue: string;
  severity: "critical" | "warning" | "info";
  description?: string;
}

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  warnings: Warning[];
  title: string;
}

export function WarningModal({
  isOpen,
  onClose,
  warnings,
  title,
}: WarningModalProps) {
  if (!isOpen) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "warning":
        return "text-orange-500 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20";
      default:
        return "text-blue-500 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative transform overflow-hidden bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-orange-600 dark:text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
                <div className="mt-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {warnings.map((warning) => (
                      <div
                        key={warning.id}
                        className="border border-gray-200 dark:border-gray-700 p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {warning.field}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {warning.issue}
                            </p>
                            {warning.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {warning.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                              warning.severity
                            )}`}
                          >
                            {warning.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 sm:ml-3 sm:w-auto"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
