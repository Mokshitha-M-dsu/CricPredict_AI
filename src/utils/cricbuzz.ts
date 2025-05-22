import axios from 'axios';

const CRICBUZZ_BASE_URL = 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1';

const api = axios.create({
  baseURL: CRICBUZZ_BASE_URL,
  headers: {
    'X-RapidAPI-Key': process.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
  }
});

export interface LiveMatch {
  id: string;
  name: string;
  status: string;
  score: {
    runs: number;
    wickets: number;
    overs: number;
  };
  teams: {
    team1: string;
    team2: string;
  };
}

export const getLiveMatches = async (): Promise<LiveMatch[]> => {
  try {
    const response = await api.get('/live');
    return response.data.typeMatches
      .flatMap((type: any) => type.seriesMatches)
      .flatMap((series: any) => series.matches)
      .map((match: any) => ({
        id: match.matchInfo.matchId,
        name: match.matchInfo.matchDesc,
        status: match.matchInfo.status,
        score: {
          runs: match.matchScore?.inningsScore?.[0]?.runs || 0,
          wickets: match.matchScore?.inningsScore?.[0]?.wickets || 0,
          overs: match.matchScore?.inningsScore?.[0]?.overs || 0,
        },
        teams: {
          team1: match.matchInfo.team1.teamName,
          team2: match.matchInfo.team2.teamName,
        }
      }));
  } catch (error) {
    console.error('Failed to fetch live matches:', error);
    throw new Error('Failed to fetch live matches');
  }
};

export const getMatchDetails = async (matchId: string) => {
  try {
    const response = await api.get(`/match/${matchId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch match details:', error);
    throw new Error('Failed to fetch match details');
  }
};