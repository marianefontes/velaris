import { getApiBaseUrl } from "./apiConfig";

export interface ResultDistributionItem {
  key: string;
  count: number;
  percentage: number;
}

export interface StudyResults {
  generated_at: string;
  participants: {
    invited: number;
    started: number;
    completed: number;
    active: number;
    completion_rate: number;
  };
  profiles: {
    primary_area: ResultDistributionItem[];
    experience_range: ResultDistributionItem[];
    design_system_experience: ResultDistributionItem[];
    design_system_frequency: ResultDistributionItem[];
  };
  usage: {
    total_events: number;
    page_views: number;
    prompts: number;
    responses: number;
    errors: number;
    perspective_changes: number;
    average_prompts_per_session: number;
    average_session_minutes: number | null;
    latest_activity: string | null;
  };
  privacy: {
    aggregation_only: boolean;
    minimum_identity_exposure: number;
  };
}

export async function fetchStudyResults(signal?: AbortSignal): Promise<StudyResults> {
  const response = await fetch(`${getApiBaseUrl()}/study/results`, { signal });
  if (!response.ok) throw new Error("study_results_unavailable");
  return response.json() as Promise<StudyResults>;
}
