import { DataQualityOverview } from "../components/report/DataQualityOverview";
import { FieldAnalysisSection } from "../components/report/FieldAnalysisSection";
import { GlobalIssuesSection } from "../components/report/GlobalIssuesSection";
import { ReportHeader } from "../components/report/ReportHeader";
import {
  calculateDataQualityScore,
  getFieldsByCategory,
  getIssueStats,
  getReportByToken,
} from "../models/report.server";
import type { Route } from "./+types/reports.$reporttoken";

export async function loader({ params }: Route.LoaderArgs) {
  const { reporttoken } = params;

  if (!reporttoken) {
    throw new Response("Report token is required", { status: 400 });
  }

  const report = await getReportByToken(reporttoken);

  if (!report) {
    throw new Response("Report not found", { status: 404 });
  }

  const dataQualityScore = calculateDataQualityScore(report);
  const fieldCategories = getFieldsByCategory(report.fields, report);
  const issueStats = getIssueStats(report);

  return {
    report,
    dataQualityScore,
    fieldCategories,
    issueStats,
  };
}

export default function ReportPage({ loaderData }: Route.ComponentProps) {
  const { report, dataQualityScore, fieldCategories, issueStats } = loaderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <ReportHeader
              companyName={report.companyName}
              generatedAt={report.generatedAt}
              totalRecords={report.totalRecords}
              totalFields={report.totalFields}
              dataQualityScore={dataQualityScore}
            />

            <DataQualityOverview
              issueStats={issueStats}
              fieldCategories={fieldCategories}
              totalFields={report.totalFields}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2">
                <FieldAnalysisSection
                  fieldCategories={fieldCategories}
                  totalRecords={report.totalRecords}
                />
              </div>
              <div className="lg:col-span-1">
                <GlobalIssuesSection globalIssues={report.globalIssues} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
