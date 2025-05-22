import React from 'react';
import { MatchDetails as MatchDetailsType } from '../../utils/types/cricbuzz';

interface MatchDetailsProps {
  details: MatchDetailsType;
  onClose: () => void;
}

export function MatchDetails({ details, onClose }: MatchDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{details.matchInfo.matchDesc}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{details.matchInfo.team1.teamName}</p>
              <p className="text-gray-600">{details.matchInfo.team1.teamScore}</p>
            </div>
            <span className="text-gray-500">vs</span>
            <div className="text-right">
              <p className="font-medium">{details.matchInfo.team2.teamName}</p>
              <p className="text-gray-600">{details.matchInfo.team2.teamScore}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Status: {details.matchInfo.status}</p>
            {details.matchScore?.inningsScore?.[0] && (
              <p>
                Current Score: {details.matchScore.inningsScore[0].runs}/
                {details.matchScore.inningsScore[0].wickets} 
                ({details.matchScore.inningsScore[0].overs} overs)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}