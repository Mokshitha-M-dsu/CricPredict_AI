import axios from 'axios';
import { LiveMatch, MatchDetails } from '../types/cricbuzz';
import { API_CONFIG } from '../config';
import { parseLiveMatches } from '../parsers/matchParser';

const api = axios.create({
  baseURL: API_CONFIG.CRICBUZZ_BASE_URL,
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
  }
});

export const getLiveMatches = async (): Promise<LiveMatch[]> => {
  try {
    const response = await api.get('/matches/v1/recent');
    return parseLiveMatches(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch live matches';
      console.error('API Error:', {
        status: error.response?.status,
        message: errorMessage,
        details: error.response?.data
      });
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const getMatchDetails = async (matchId: string): Promise<MatchDetails> => {
  try {
    const response = await api.get(`/matches/v1/${matchId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch match details';
      console.error('API Error:', {
        status: error.response?.status,
        message: errorMessage,
        details: error.response?.data
      });
      throw new Error(errorMessage);
    }
    throw error;
  }
};