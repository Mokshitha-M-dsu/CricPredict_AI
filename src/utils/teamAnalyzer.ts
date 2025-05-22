import { Player } from '../types/player';

interface TeamAnalysis {
  playing11: Player[];
  substitutes: {
    batsmen: Player[];
    bowlers: Player[];
    allRounders: Player[];
    wicketKeepers: Player[];
  };
  reasoning: string;
  oppositionAnalysis?: string;
}

export function analyzeTeamComposition(
  squadText: string,
  pitchType: string,
  weather: string,
  opposition?: string
): TeamAnalysis {
  // Parse squad
  const squad = parseCustomSquad(squadText);
  
  // Organize players by role
  const wicketKeepers = squad.filter(p => p.role === 'Wicket-keeper');
  const batsmen = squad.filter(p => p.role === 'Batsman');
  const allRounders = squad.filter(p => p.role === 'All-rounder');
  const bowlers = squad.filter(p => p.role === 'Bowler');

  // Determine optimal team composition based on conditions
  let composition = {
    wicketKeeper: 1,
    batsmen: 4,
    allRounders: 2,
    bowlers: 4
  };

  // Adjust composition based on pitch type
  if (pitchType.toLowerCase() === 'batting') {
    composition.batsmen = 5;
    composition.bowlers = 3;
  } else if (pitchType.toLowerCase() === 'bowling') {
    composition.batsmen = 3;
    composition.bowlers = 5;
  }

  // Adjust for weather conditions
  if (weather.toLowerCase() === 'overcast') {
    composition.bowlers = Math.min(composition.bowlers + 1, 5);
    composition.batsmen = Math.max(composition.batsmen - 1, 3);
  }

  // Select the best players for each role
  const playing11: Player[] = [];

  // Always include one wicket-keeper
  if (wicketKeepers.length > 0) {
    playing11.push(wicketKeepers[0]);
  }

  // Add batsmen
  playing11.push(...batsmen.slice(0, composition.batsmen));

  // Add all-rounders
  playing11.push(...allRounders.slice(0, composition.allRounders));

  // Add bowlers
  playing11.push(...bowlers.slice(0, composition.bowlers));

  // If we don't have 11 players yet, add more based on conditions
  while (playing11.length < 11 && squad.length > playing11.length) {
    const remainingPlayers = squad.filter(p => !playing11.includes(p));
    if (remainingPlayers.length > 0) {
      playing11.push(remainingPlayers[0]);
    }
  }

  // Remaining players are substitutes
  const substitutes = {
    batsmen: batsmen.filter(p => !playing11.includes(p)),
    bowlers: bowlers.filter(p => !playing11.includes(p)),
    allRounders: allRounders.filter(p => !playing11.includes(p)),
    wicketKeepers: wicketKeepers.filter(p => !playing11.includes(p))
  };

  // Generate analysis
  const reasoning = generateReasoning(playing11, pitchType, weather);
  const oppositionAnalysis = opposition ? analyzeOpposition(opposition, playing11) : undefined;

  return {
    playing11,
    substitutes,
    reasoning,
    oppositionAnalysis
  };
}

function parseCustomSquad(squadText: string): Player[] {
  const lines = squadText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return lines.map((line, index) => {
    const roleMatch = line.match(/^(.+?)\s*\((.+?)\)\s*$/);
    if (!roleMatch) {
      throw new Error(`Invalid player format for: "${line}". Use format: "Name (Role)"`);
    }

    const [_, name, role] = roleMatch;
    const validRoles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
    const normalizedRole = role.trim();
    
    if (!validRoles.includes(normalizedRole)) {
      throw new Error(`Invalid role "${role}" for player "${name}". Valid roles are: ${validRoles.join(', ')}`);
    }

    return {
      id: `player-${index}`,
      name: name.trim(),
      role: normalizedRole as Player['role'],
      matches: 0,
      recentForm: 'Good'
    };
  });
}

function generateReasoning(playing11: Player[], pitchType: string, weather: string): string {
  const roles = {
    batsmen: playing11.filter(p => p.role === 'Batsman').length,
    bowlers: playing11.filter(p => p.role === 'Bowler').length,
    allRounders: playing11.filter(p => p.role === 'All-rounder').length,
    wicketKeepers: playing11.filter(p => p.role === 'Wicket-keeper').length
  };

  return `
Team Composition Analysis:
• ${roles.batsmen} Batsmen
• ${roles.bowlers} Bowlers
• ${roles.allRounders} All-rounders
• ${roles.wicketKeepers} Wicket-keeper

Conditions Considered:
• Pitch: ${pitchType} - ${getPitchAnalysis(pitchType)}
• Weather: ${weather} - ${getWeatherAnalysis(weather)}

Strategy Recommendations:
${getStrategyRecommendations(pitchType, weather, playing11)}
`.trim();
}

function getPitchAnalysis(pitchType: string): string {
  switch (pitchType.toLowerCase()) {
    case 'batting':
      return 'Favors batting, team composition weighted towards batting strength';
    case 'bowling':
      return 'Assists bowlers, extra bowling options included';
    case 'spinning':
      return 'Spin-friendly conditions considered in selection';
    default:
      return 'Balanced conditions, maintaining standard team composition';
  }
}

function getWeatherAnalysis(weather: string): string {
  switch (weather.toLowerCase()) {
    case 'overcast':
      return 'Conditions favor seam bowling, adjusted bowling options accordingly';
    case 'sunny':
      return 'Good batting conditions expected';
    case 'light rain':
      return 'Potential for swing bowling, considered in bowler selection';
    default:
      return 'Standard playing conditions expected';
  }
}

function getStrategyRecommendations(pitchType: string, weather: string, playing11: Player[]): string {
  const bowlers = playing11.filter(p => p.role === 'Bowler' || p.role === 'All-rounder');
  const batsmen = playing11.filter(p => p.role === 'Batsman' || p.role === 'Wicket-keeper');
  
  let strategy = '';
  
  if (pitchType.toLowerCase() === 'batting') {
    strategy += '• Batting lineup strengthened for high-scoring potential\n';
    strategy += `• ${batsmen.length} capable batsmen in the XI\n`;
  } else if (pitchType.toLowerCase() === 'bowling') {
    strategy += '• Enhanced bowling attack for challenging conditions\n';
    strategy += `• ${bowlers.length} bowling options available\n`;
  }

  if (weather.toLowerCase() === 'overcast') {
    strategy += '• Seam bowling options prioritized for overcast conditions\n';
  }

  return strategy;
}

function analyzeOpposition(opposition: string, playing11: Player[]): string {
  const oppLower = opposition.toLowerCase();
  let analysis = '';

  if (oppLower.includes('strong batting') || oppLower.includes('aggressive')) {
    analysis += '• Selected bowling attack focused on containment and variety\n';
    analysis += '• Multiple bowling options available for tactical changes\n';
  }

  if (oppLower.includes('spin') || oppLower.includes('spinner')) {
    analysis += '• Batting lineup selected with spin-playing capability\n';
    analysis += '• Counter-attacking options available against spin\n';
  }

  if (oppLower.includes('pace') || oppLower.includes('fast')) {
    analysis += '• Batting order structured to handle pace bowling\n';
    analysis += '• Technical batsmen prioritized in selection\n';
  }

  return analysis;
}