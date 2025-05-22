export const generateScorePredictionPrompt = (matchData: string): string => {
  return `
Based on the following match data:
${matchData}

Provide:
1. Predicted final score
2. Run rate analysis
3. Key factors affecting the prediction
4. Confidence level of prediction

Note: Format response in clear sections without any asterisks or markdown symbols.
  `.trim();
};

export const generateTeamSelectionPrompt = (squad: string, conditions: string): string => {
  return `
Given the following:
Squad: ${squad}
Conditions: ${conditions}

Provide:
1. Recommended playing XI
2. Batting order
3. Reasoning for each selection
4. Alternative options for key positions

Note: Format response in clear sections without any asterisks or markdown symbols.
  `.trim();
};

export const generatePlayerRecommendationPrompt = (situation: string, stats: string): string => {
  return `
Match Situation: ${situation}
Player Statistics: ${stats}

Provide:
1. Recommended player choice
2. Statistical justification
3. Historical performance in similar situations
4. Risk assessment

Note: Format response in clear sections without any asterisks or markdown symbols.
  `.trim();
};