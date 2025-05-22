import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { getLiveMatches, getMatchDetails } from '../../utils/api/cricbuzz';
import { LiveMatch, MatchDetails as MatchDetailsType } from '../../utils/types/cricbuzz';
import { LiveMatchCard } from './LiveMatchCard';
import { MatchDetails } from './MatchDetails';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { toast } from 'react-hot-toast';
import { REFRESH_INTERVALS } from '../../utils/config';

export function LiveMatches() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveMatches = async () => {
    try {
      setError(null);
      const data = await getLiveMatches();
      if (data.length === 0) {
        setError('No live matches available');
      } else {
        setMatches(data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch live matches';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, REFRESH_INTERVALS.LIVE_MATCHES);
    return () => clearInterval(interval);
  }, []);

  const handleMatchSelect = async (matchId: string) => {
    try {
      const details = await getMatchDetails(matchId);
      setSelectedMatch(details);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch match details';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold">Live Matches</h2>
        </div>
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold">Live Matches</h2>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : matches.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No live matches at the moment</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <LiveMatchCard
              key={match.id}
              match={match}
              onSelect={handleMatchSelect}
            />
          ))}
        </div>
      )}

      {selectedMatch && (
        <MatchDetails
          details={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}