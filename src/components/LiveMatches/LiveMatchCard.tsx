import React from 'react';
import { Activity } from 'lucide-react';
import { LiveMatch } from '../../utils/types/cricbuzz';

interface LiveMatchCardProps {
  match: LiveMatch;
  onSelect: (matchId: string) => void;
}

export function LiveMatchCard({ match, onSelect }: LiveMatchCardProps) {
  return (
    <div 
      onClick={() => onSelect(match.id)}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-red-500" />
        <span className="text-sm font-medium text-red-500">Live</span>
      </div>
      
      <h3 className="font-semibold mb-2">{match.name}</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{match.teams.team1}</span>
          <span className="font-medium">vs</span>
          <span className="text-gray-600">{match.teams.team2}</span>
        </div>
        
        <div className="text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Score: {match.score.runs}/{match.score.wickets}</span>
            <span>Overs: {match.score.overs}</span>
          </div>
          <div className="mt-1">
            <span>Status: {match.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}