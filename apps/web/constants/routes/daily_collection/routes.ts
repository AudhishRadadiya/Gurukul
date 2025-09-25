import type { ReportMode } from "@web/components/report/dailyCollectionReport/hooks/useGetDailyCollectionReport";
import { API, PDF } from "@web/constants/routes/common";

export const DAILY_COLLECTION_BASE_URL = `${API}/daily_collection` as const;

export const DAILY_COLLECTION_ROUTES = {
  generate: (reportMode: ReportMode) =>
    `${DAILY_COLLECTION_BASE_URL}/${PDF}/${reportMode}` as const,

  post: `${DAILY_COLLECTION_BASE_URL}/${PDF}/summary_report` as const,
} as const;
