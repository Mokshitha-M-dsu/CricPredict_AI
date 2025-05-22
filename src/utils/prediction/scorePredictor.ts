import { MatchRecord } from '../data/csvLoader';

interface PredictionInput {
  current_score: number;
  overs: number;
  wickets: number;
  pitch_conditions: string;
  weather: string;
}

interface PredictionResult {
  predictedScore: number;
  confidence: number;
  similarMatches: MatchRecord[];
  projectedRunRate: number;
}

export class ScorePredictor {
  private historicalData: MatchRecord[] = [];
  private readonly MAX_OVERS = 20;
  private readonly MAX_WICKETS = 10;
  private readonly TYPICAL_T20_SCORE = 170;

  async initialize(data: MatchRecord[]) {
    this.historicalData = data.filter(match => match.overs <= this.MAX_OVERS);
  }

  predict(input: PredictionInput): PredictionResult {
    this.validateInput(input);
    
    const similarMatches = this.findSimilarMatches(input);
    
    // Use data-driven or fallback prediction based on available matches
    const prediction = similarMatches.length >= 3 
      ? this.calculateDataDrivenPrediction(similarMatches, input)
      : this.calculateFallbackPrediction(input);
    
    return {
      predictedScore: Math.round(prediction.score),
      confidence: Math.round(prediction.confidence * 100) / 100,
      similarMatches: similarMatches.slice(0, 3),
      projectedRunRate: Math.round((prediction.score - input.current_score) / (this.MAX_OVERS - input.overs) * 10) / 10
    };
  }

  private validateInput(input: PredictionInput) {
    if (input.overs > this.MAX_OVERS) {
      throw new Error('Overs cannot exceed 20 in T20 format');
    }
    if (input.overs < 0 || input.wickets < 0 || input.current_score < 0) {
      throw new Error('Invalid negative values in input');
    }
    if (input.wickets >= this.MAX_WICKETS) {
      throw new Error('Invalid number of wickets');
    }
  }

  private findSimilarMatches(input: PredictionInput): MatchRecord[] {
    return this.historicalData
      .filter(match => {
        const oversInRange = Math.abs(match.overs - input.overs) <= 2;
        const wicketsInRange = Math.abs(match.wickets - input.wickets) <= 2;
        const scoreInRange = Math.abs(match.current_score - input.current_score) <= 25;
        return oversInRange && wicketsInRange && scoreInRange;
      })
      .sort((a, b) => this.calculateSimilarityScore(b, input) - this.calculateSimilarityScore(a, input))
      .slice(0, 5);
  }

  private calculateSimilarityScore(match: MatchRecord, input: PredictionInput): number {
    const oversWeight = 0.35;
    const wicketsWeight = 0.25;
    const scoreWeight = 0.25;
    const conditionsWeight = 0.15;

    const oversDiff = 1 - Math.abs(match.overs - input.overs) / this.MAX_OVERS;
    const wicketsDiff = 1 - Math.abs(match.wickets - input.wickets) / this.MAX_WICKETS;
    const scoreDiff = 1 - Math.abs(match.current_score - input.current_score) / this.TYPICAL_T20_SCORE;
    const conditionsMatch = (match.pitch_conditions === input.pitch_conditions && 
                           match.weather === input.weather) ? 1 : 0;

    return (
      oversDiff * oversWeight +
      wicketsDiff * wicketsWeight +
      scoreDiff * scoreWeight +
      conditionsMatch * conditionsWeight
    );
  }

  private calculateDataDrivenPrediction(
    similarMatches: MatchRecord[], 
    input: PredictionInput
  ) {
    const weights = similarMatches.map((_, index) => Math.exp(-0.5 * index));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    const weightedSum = similarMatches.reduce((sum, match, index) => {
      const remainingOversRatio = (this.MAX_OVERS - input.overs) / (this.MAX_OVERS - match.overs);
      const projectedScore = input.current_score + 
        (match.final_score - match.current_score) * remainingOversRatio;
      
      return sum + (projectedScore * weights[index]);
    }, 0);

    const predictedScore = weightedSum / totalWeight;
    const confidence = Math.min(75 + (similarMatches.length * 5), 90);

    return { score: predictedScore, confidence };
  }

  private calculateFallbackPrediction(input: PredictionInput): { score: number; confidence: number } {
    const remainingOvers = this.MAX_OVERS - input.overs;
    const currentRunRate = input.current_score / input.overs;
    
    // Adjust run rate based on match phase and conditions
    let projectedRunRate = currentRunRate;
    
    // Early overs (1-6)
    if (input.overs <= 6) {
      projectedRunRate *= 1.2; // Expect higher scoring in middle/death overs
    }
    // Middle overs (7-15)
    else if (input.overs <= 15) {
      projectedRunRate *= 1.1;
    }
    // Death overs (16-20)
    else {
      projectedRunRate *= 1.3;
    }

    // Adjust for wickets lost
    const wicketFactor = 1 - (input.wickets * 0.1);
    projectedRunRate *= wicketFactor;

    // Adjust for pitch and weather conditions
    if (input.pitch_conditions === 'batting') {
      projectedRunRate *= 1.1;
    } else if (input.pitch_conditions === 'bowling') {
      projectedRunRate *= 0.9;
    }

    if (input.weather === 'sunny') {
      projectedRunRate *= 1.05;
    } else if (input.weather === 'overcast') {
      projectedRunRate *= 0.95;
    }

    const predictedScore = input.current_score + (projectedRunRate * remainingOvers);
    
    // Lower confidence for fallback prediction
    const confidence = 60;

    return { score: predictedScore, confidence };
  }
}