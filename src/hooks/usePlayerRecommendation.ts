import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function usePlayerRecommendation() {
  const [loading, setLoading] = useState(false);

  const recommendPlayer = async (situation: string, stats: string): Promise<string> => {
    if (!situation.trim() || !stats.trim()) {
      throw new Error('Please provide both situation and player statistics');
    }

    setLoading(true);
    try {
      // Parse match situation
      const isFirstInnings = determineInnings(situation);
      const currentScore = extractCurrentScore(situation);
      const currentOver = extractCurrentOver(situation);
      const wicketsInHand = extractWickets(situation);
      const matchPhase = determineMatchPhase(situation, currentOver);
      const pitchCondition = extractPitchCondition(situation);

      // Parse player stats
      const battingAverage = extractBattingAverage(stats);
      const strikeRate = extractStrikeRate(stats);
      const recentForm = analyzeRecentForm(stats);

      // Analyze suitability
      const analysis = analyzeSuitability(
        { 
          isFirstInnings,
          currentScore, 
          currentOver,
          wicketsInHand, 
          matchPhase,
          pitchCondition
        },
        { 
          battingAverage, 
          strikeRate, 
          recentForm
        }
      );

      return analysis;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate recommendation';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { recommendPlayer, loading };
}

function determineInnings(situation: string): boolean {
  return situation.toLowerCase().includes('first innings') || 
         situation.toLowerCase().includes('1st innings') ||
         !situation.toLowerCase().includes('chase') &&
         !situation.toLowerCase().includes('target') &&
         !situation.toLowerCase().includes('required rate');
}

function extractCurrentScore(situation: string): number | null {
  const match = situation.match(/(?:score|batting at)[:\s]+(\d+)(?:\/\d+)?/i);
  return match ? parseInt(match[1]) : null;
}

function extractCurrentOver(situation: string): number | null {
  const match = situation.match(/(?:over|overs)[:\s]+(\d+\.?\d*)/i);
  return match ? parseFloat(match[1]) : null;
}

function extractWickets(situation: string): number | null {
  const match = situation.match(/(\d+)\s*wickets?/i);
  return match ? parseInt(match[1]) : null;
}

function determineMatchPhase(situation: string, currentOver: number | null): 'powerplay' | 'middle' | 'death' {
  const situationLower = situation.toLowerCase();
  if (situationLower.includes('powerplay') || (currentOver !== null && currentOver <= 6)) {
    return 'powerplay';
  }
  if (situationLower.includes('death') || (currentOver !== null && currentOver >= 16)) {
    return 'death';
  }
  return 'middle';
}

function extractPitchCondition(situation: string): 'batting' | 'bowling' | 'neutral' {
  const situationLower = situation.toLowerCase();
  if (situationLower.includes('batting pitch') || situationLower.includes('batting friendly')) {
    return 'batting';
  }
  if (situationLower.includes('bowling pitch') || situationLower.includes('bowler friendly')) {
    return 'bowling';
  }
  return 'neutral';
}

function extractBattingAverage(stats: string): number | null {
  const match = stats.match(/average[:\s]+(\d+\.?\d*)/i);
  return match ? parseFloat(match[1]) : null;
}

function extractStrikeRate(stats: string): number | null {
  const match = stats.match(/strike rate[:\s]+(\d+\.?\d*)/i);
  return match ? parseFloat(match[1]) : null;
}

function analyzeRecentForm(stats: string): 'excellent' | 'good' | 'average' | 'poor' {
  const statsLower = stats.toLowerCase();
  if (statsLower.includes('excellent')) return 'excellent';
  if (statsLower.includes('good')) return 'good';
  if (statsLower.includes('poor')) return 'poor';
  return 'average';
}

function analyzeSuitability(
  situation: {
    isFirstInnings: boolean;
    currentScore: number | null;
    currentOver: number | null;
    wicketsInHand: number | null;
    matchPhase: 'powerplay' | 'middle' | 'death';
    pitchCondition: 'batting' | 'bowling' | 'neutral';
  },
  stats: {
    battingAverage: number | null;
    strikeRate: number | null;
    recentForm: 'excellent' | 'good' | 'average' | 'poor';
  }
): string {
  let recommendation = 'Player Suitability Analysis:\n\n';
  let suitabilityScore = 0;
  let maxScore = 0;
  const reasons: string[] = [];

  // Basic stats analysis
  if (stats.battingAverage && stats.battingAverage > 35) {
    suitabilityScore += 2;
    reasons.push('✅ Strong batting average');
  }
  maxScore += 2;

  if (stats.strikeRate && stats.strikeRate > 130) {
    suitabilityScore += 2;
    reasons.push('✅ Good strike rate for T20');
  }
  maxScore += 2;

  // Form analysis
  maxScore += 2;
  switch (stats.recentForm) {
    case 'excellent':
      suitabilityScore += 2;
      reasons.push('✅ Currently in excellent form');
      break;
    case 'good':
      suitabilityScore += 1.5;
      reasons.push('✅ Currently in good form');
      break;
    case 'poor':
      reasons.push('❌ Recent form is concerning');
      break;
  }

  // Match phase analysis
  maxScore += 2;
  if (situation.matchPhase === 'powerplay' && stats.strikeRate && stats.strikeRate > 140) {
    suitabilityScore += 2;
    reasons.push('✅ Strong powerplay performer');
  } else if (situation.matchPhase === 'death' && stats.strikeRate && stats.strikeRate > 150) {
    suitabilityScore += 2;
    reasons.push('✅ Excellent death overs striker');
  }

  // First Innings specific analysis
  if (situation.isFirstInnings) {
    maxScore += 2;
    if (situation.currentScore !== null && situation.currentOver !== null) {
      const currentRunRate = situation.currentScore / situation.currentOver;
      if (currentRunRate < 7 && stats.strikeRate && stats.strikeRate > 140) {
        suitabilityScore += 2;
        reasons.push('✅ Can accelerate scoring rate');
      }
    }
  }

  // Calculate suitability percentage
  const suitabilityPercentage = (suitabilityScore / maxScore) * 100;

  // Generate recommendation
  if (suitabilityPercentage >= 80) {
    recommendation += '🌟 Strongly Recommended\n\n';
  } else if (suitabilityPercentage >= 60) {
    recommendation += '✅ Recommended\n\n';
  } else if (suitabilityPercentage >= 40) {
    recommendation += '⚠️ Consider with Caution\n\n';
  } else {
    recommendation += '❌ Not Recommended\n\n';
  }

  recommendation += 'Analysis:\n';
  recommendation += reasons.join('\n');

  return recommendation;
}