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

export interface RawMatchData {
  typeMatches: Array<{
    seriesMatches: Array<{
      matches: Array<{
        matchInfo: {
          matchId: string;
          matchDesc: string;
          status: string;
          team1: {
            teamName: string;
          };
          team2: {
            teamName: string;
          };
        };
        matchScore?: {
          inningsScore?: Array<{
            runs: number;
            wickets: number;
            overs: number;
          }>;
        };
      }>;
    }>;
  }>;
}

export interface MatchDetails {
  matchInfo: {
    matchId: string;
    matchDesc: string;
    status: string;
    team1: {
      teamName: string;
      teamScore: string;
    };
    team2: {
      teamName: string;
      teamScore: string;
    };
  };
  matchScore: {
    inningsScore: Array<{
      runs: number;
      wickets: number;
      overs: number;
    }>;
  };
}