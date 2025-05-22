import { useState, useEffect } from 'react';
import { loadMatchData, MatchRecord } from '../../utils/data/csvLoader';
import { ScorePredictor } from '../../utils/prediction/scorePredictor';

const predictor = new ScorePredictor();

export function usePrediction() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePredictor = async () => {
      try {
        const data = await loadMatchData('/data/match_data.csv');
        await predictor.initialize(data);
        setInitialized(true);
      } catch (err) {
        setError('Failed to initialize prediction model');
        console.error(err);
      }
    };

    initializePredictor();
  }, []);

  const predict = async (input: {
    current_score: number;
    overs: number;
    wickets: number;
    pitch_conditions: string;
    weather: string;
  }) => {
    if (!initialized) {
      throw new Error('Prediction model not initialized');
    }

    return predictor.predict(input);
  };

  return { predict, initialized, error };
}