export type PlayerRole = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  battingAverage?: number;
  strikeRate?: number;
  bowlingAverage?: number;
  economyRate?: number;
  matches: number;
  recentForm: 'Excellent' | 'Good' | 'Average' | 'Poor';
}