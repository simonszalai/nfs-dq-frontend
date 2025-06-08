import type { GlobalIssue } from "@prisma/client";

interface GlobalIssuesSectionProps {
  globalIssues: GlobalIssue[];
}

export function GlobalIssuesSection({
  globalIssues,
}: GlobalIssuesSectionProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500 text-red-100";
      case "high":
        return "bg-orange-500 text-orange-100";
      case "medium":
        return "bg-yellow-500 text-yellow-100";
      case "low":
        return "bg-blue-500 text-blue-100";
      default:
        return "bg-gray-500 text-gray-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "🚨";
      case "high":
        return "⚠️";
      case "medium":
        return "📋";
      case "low":
        return "ℹ️";
      default:
        return "📌";
    }
  };

  if (globalIssues.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-sm p-6 border border-white/20 relative z-20">
        <h3 className="text-xl font-semibold text-white mb-4">
          System-Wide Issues
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-400">No system-wide issues detected</p>
          <p className="text-emerald-400 text-sm mt-2">
            ✨ Your CRM configuration looks good!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-sm p-6 border border-white/20 relative z-20">
      <h3 className="text-xl font-semibold text-white mb-4">
        System-Wide Issues
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {globalIssues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white/5 rounded-sm p-4 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {getSeverityIcon(issue.severity)}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-medium">{issue.title}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                      issue.severity
                    )}`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{issue.description}</p>

                {issue.meta && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(issue.meta as Record<string, any>).map(
                        ([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-400">{key}:</span>
                            <span className="text-gray-300 ml-1">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {globalIssues.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Showing {globalIssues.length} system-wide issues
          </p>
        </div>
      )}
    </div>
  );
}
