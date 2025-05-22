import { Player, PlayerRole } from '../types/player';

export const players: Player[] = [
  // Batsmen
  { id: 'vk18', name: 'Virat Kohli', role: 'Batsman', battingAverage: 52.73, strikeRate: 138.5, matches: 115, recentForm: 'Excellent' },
  { id: 'rs45', name: 'Rohit Sharma', role: 'Batsman', battingAverage: 48.20, strikeRate: 142.3, matches: 148, recentForm: 'Good' },
  { id: 'kl1', name: 'KL Rahul', role: 'Batsman', battingAverage: 45.80, strikeRate: 135.8, matches: 72, recentForm: 'Good' },
  { id: 'ss17', name: 'Shubman Gill', role: 'Batsman', battingAverage: 42.50, strikeRate: 146.2, matches: 25, recentForm: 'Excellent' },
  { id: 'si63', name: 'Suryakumar Yadav', role: 'Batsman', battingAverage: 46.30, strikeRate: 172.4, matches: 55, recentForm: 'Good' },
  { id: 'rt17', name: 'Rituraj Gaikwad', role: 'Batsman', battingAverage: 38.20, strikeRate: 135.8, matches: 18, recentForm: 'Average' },

  // All-rounders
  { id: 'hp33', name: 'Hardik Pandya', role: 'All-rounder', battingAverage: 32.50, strikeRate: 145.2, bowlingAverage: 28.5, economyRate: 8.2, matches: 92, recentForm: 'Good' },
  { id: 'rj8', name: 'Ravindra Jadeja', role: 'All-rounder', battingAverage: 28.40, strikeRate: 132.5, bowlingAverage: 24.8, economyRate: 7.4, matches: 64, recentForm: 'Good' },
  { id: 'aa34', name: 'Axar Patel', role: 'All-rounder', battingAverage: 25.60, strikeRate: 138.4, bowlingAverage: 25.2, economyRate: 7.8, matches: 48, recentForm: 'Average' },
  { id: 'wa47', name: 'Washington Sundar', role: 'All-rounder', battingAverage: 22.40, strikeRate: 128.5, bowlingAverage: 26.8, economyRate: 7.2, matches: 35, recentForm: 'Average' },

  // Bowlers
  { id: 'bs99', name: 'Bumrah', role: 'Bowler', bowlingAverage: 22.40, economyRate: 6.8, matches: 85, recentForm: 'Excellent' },
  { id: 'ms87', name: 'Mohammed Shami', role: 'Bowler', bowlingAverage: 24.80, economyRate: 7.4, matches: 75, recentForm: 'Good' },
  { id: 'ks23', name: 'Kuldeep Yadav', role: 'Bowler', bowlingAverage: 23.50, economyRate: 7.2, matches: 58, recentForm: 'Good' },
  { id: 'ma19', name: 'Mohammed Arshdeep', role: 'Bowler', bowlingAverage: 25.60, economyRate: 7.8, matches: 42, recentForm: 'Average' },
  { id: 'mc34', name: 'Mukesh Kumar', role: 'Bowler', bowlingAverage: 26.80, economyRate: 8.1, matches: 15, recentForm: 'Average' },

  // Wicket-keepers
  { id: 'rp17', name: 'Rishabh Pant', role: 'Wicket-keeper', battingAverage: 42.30, strikeRate: 152.4, matches: 78, recentForm: 'Good' },
  { id: 'ik77', name: 'Ishan Kishan', role: 'Wicket-keeper', battingAverage: 38.50, strikeRate: 145.8, matches: 45, recentForm: 'Average' },
  { id: 'ss91', name: 'Sanju Samson', role: 'Wicket-keeper', battingAverage: 36.40, strikeRate: 148.2, matches: 38, recentForm: 'Average' }
];