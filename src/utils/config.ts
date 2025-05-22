export const API_CONFIG = {
  CRICBUZZ_BASE_URL: 'https://cricbuzz-cricket.p.rapidapi.com',
} as const;

export const REFRESH_INTERVALS = {
  LIVE_MATCHES: 120000, // 2 minutes
} as const;

export const T20_CONFIG = {
  MAX_OVERS: 20,
  MAX_WICKETS: 10,
  TYPICAL_SCORE: 170,
  PREDICTION_CONFIDENCE_THRESHOLD: 70, // minimum confidence percentage
} as const;