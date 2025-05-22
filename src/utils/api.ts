// ... existing code ...

export const getAvailablePlayers = async (): Promise<Player[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/players`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch available players');
  }
};

export const recommendTeam = async (data: {
  squad: string[];
  conditions: {
    pitch: string;
    weather: string;
    opposition: string;
  };
}): Promise<TeamRecommendationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recommend-team`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Failed to get team recommendation');
    }
    throw new Error('Failed to connect to recommendation service');
  }
};