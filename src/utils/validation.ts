export const validateMatchData = (input: string): boolean => {
  if (!input?.trim()) return false;
  
  // Basic validation for match data format
  const requiredFields = ['score', 'overs', 'wickets'];
  const hasRequiredInfo = requiredFields.some(field => 
    input.toLowerCase().includes(field)
  );
  
  return hasRequiredInfo;
};

export const validateSquadData = (input: string): boolean => {
  if (!input?.trim()) return false;
  
  // Check if input contains a list of players (comma-separated)
  const players = input.split(',').map(p => p.trim());
  return players.length >= 11;
};

export const validateSituationData = (input: string): boolean => {
  if (!input?.trim()) return false;
  
  // Check if situation description is detailed enough
  const minWords = 10;
  const words = input.trim().split(/\s+/);
  return words.length >= minWords;
};