import Papa from 'papaparse';

export interface MatchRecord {
  current_score: number;
  overs: number;
  wickets: number;
  pitch_conditions: string;
  weather: string;
  final_score: number;
}

export const loadMatchData = async (): Promise<MatchRecord[]> => {
  try {
    // Update the path to load from src/data instead of public/data
    const response = await fetch('/src/data/match_data.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true, // Automatically convert numbers
        complete: (results) => {
          resolve(results.data as MatchRecord[]);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV data:', error);
    throw new Error('Failed to load match data');
  }
};