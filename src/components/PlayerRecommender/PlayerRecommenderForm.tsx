import React from 'react';

interface PlayerRecommenderFormProps {
  situation: string;
  stats: string;
  onSituationChange: (value: string) => void;
  onStatsChange: (value: string) => void;
}

export function PlayerRecommenderForm({
  situation,
  stats,
  onSituationChange,
  onStatsChange,
}: PlayerRecommenderFormProps) {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Match Situation
        </label>
        <textarea
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 min-h-[100px]"
          value={situation}
          onChange={(e) => onSituationChange(e.target.value)}
          placeholder="Describe the match situation:
- Required run rate
- Overs remaining
- Wickets in hand
- Match phase (powerplay/middle/death)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Player Statistics
        </label>
        <textarea
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 min-h-[100px]"
          value={stats}
          onChange={(e) => onStatsChange(e.target.value)}
          placeholder="Enter player statistics:
- Batting average
- Strike rate
- Recent form
- Performance in similar situations"
        />
      </div>
    </div>
  );
}