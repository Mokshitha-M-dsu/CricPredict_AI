export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  battingAverage: number;
  strikeRate: number;
  bowlingAverage?: number;
  economyRate?: number;
  matches: number;
  recentForm: 'Excellent' | 'Good' | 'Average' | 'Poor';
}

export interface TeamRecommendationResponse {
  playing_xi: Player[];
  batting_order: string[];
  reasoning: string;
  alternatives: Player[];
}

export interface MatchData {
  currentScore: number;
  overs: number;
  wickets: number;
  pitchConditions: string;
  weather: string;
}