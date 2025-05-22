import { LiveMatch, RawMatchData } from '../types/cricbuzz';

export const parseLiveMatches = (data: RawMatchData): LiveMatch[] => {
  if (!data?.typeMatches) {
    return [];
  }

  return data.typeMatches
    .flatMap((type) => type.seriesMatches || [])
    .flatMap((series) => series.matches || [])
    .filter((match) => match?.matchInfo) // Filter out invalid matches
    .map((match) => ({
      id: match.matchInfo.matchId,
      name: match.matchInfo.matchDesc || 'Unknown Match',
      status: match.matchInfo.status || 'Unknown Status',
      score: {
        runs: match.matchScore?.inningsScore?.[0]?.runs || 0,
        wickets: match.matchScore?.inningsScore?.[0]?.wickets || 0,
        overs: match.matchScore?.inningsScore?.[0]?.overs || 0,
      },
      teams: {
        team1: match.matchInfo.team1?.teamName || 'Team 1',
        team2: match.matchInfo.team2?.teamName || 'Team 2',
      }
    }));
};