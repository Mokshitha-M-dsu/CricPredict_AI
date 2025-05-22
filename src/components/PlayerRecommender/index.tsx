import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { ResponseDisplay } from '../common/ResponseDisplay';
import { usePlayerRecommendation } from '../../hooks/usePlayerRecommendation';
import { PlayerRecommenderForm } from './PlayerRecommenderForm';

export function PlayerRecommender() {
  const { recommendPlayer, loading } = usePlayerRecommendation();
  const [situation, setSituation] = useState('');
  const [stats, setStats] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async () => {
    try {
      const result = await recommendPlayer(situation, stats);
      setRecommendation(result);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <Card title="Player Recommender" icon={UserCheck} iconColor="text-purple-600">
      <PlayerRecommenderForm
        situation={situation}
        stats={stats}
        onSituationChange={setSituation}
        onStatsChange={setStats}
      />
      <Button
        onClick={handleRecommend}
        loading={loading}
        disabled={loading || !situation.trim() || !stats.trim()}
        color="bg-purple-600"
      >
        Recommend Player
      </Button>
      {error && <ErrorMessage message={error} />}
      {recommendation && (
        <ResponseDisplay
          response={recommendation}
          color="bg-purple-50 border-purple-100"
          title="Recommendation"
        />
      )}
    </Card>
  );
}