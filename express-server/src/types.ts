export interface JobAnalysisResponse {
  summary: string;
  idealCandidate: string;
  resumeSuggestions: string;
  newResume: string;
}

export interface ApiError {
  error: {
    message: string;
    status: string;
  };
} 