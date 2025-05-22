import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ErrorMessage } from './common/ErrorMessage';
import { ResponseDisplay } from './common/ResponseDisplay';
import { usePlayerRecommendation } from '../hooks/usePlayerRecommendation';

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
      setRecommendation('');
    }
  };

  return (
    <Card title="Player Recommender" icon={UserCheck} iconColor="text-purple-600">
      <textarea
        className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        placeholder="Describe the match situation:
- Required run rate
- Overs remaining
- Wickets in hand
- Match phase (powerplay/middle/death)"
      />
      <textarea
        className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
        value={stats}
        onChange={(e) => setStats(e.target.value)}
        placeholder="Enter player statistics:
- Batting average
- Strike rate
- Recent form
- Performance in similar situations"
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