import { SentimentAnalyzer } from 'natural';
import * as natural from 'natural';
import nlp from 'compromise';

export class PlayerSentimentAnalyzer {
  private analyzer: SentimentAnalyzer;

  constructor() {
    this.analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  }

  analyzeSentiment(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    return this.analyzer.getSentiment(words);
  }

  analyzePlayerPerformance(recentPerformances: string): {
    sentiment: number;
    confidence: number;
    keywords: string[];
  } {
    const doc = nlp(recentPerformances);
    
    // Extract key performance indicators
    const scores = doc.match('(scored|made) [0-9]+ runs').out('array');
    const wickets = doc.match('took [0-9]+ wickets').out('array');
    const matchResults = doc.match('(won|lost|victory|defeat)').out('array');
    
    // Calculate base sentiment
    const sentiment = this.analyzeSentiment(recentPerformances);
    
    // Extract numbers for quantitative analysis
    const numbers = recentPerformances.match(/\d+/g)?.map(Number) || [];
    const hasHighScores = numbers.some(n => n > 50);
    
    // Keywords extraction
    const keywords = [
      ...doc.match('#Adjective (form|performance|batting|bowling)').out('array'),
      ...doc.match('(consistent|reliable|aggressive|defensive)').out('array')
    ];

    // Calculate confidence based on data points
    const confidence = Math.min(
      100,
      (scores.length * 15 + 
       wickets.length * 15 + 
       matchResults.length * 10 + 
       keywords.length * 5 + 
       (hasHighScores ? 20 : 0))
    );

    return {
      sentiment: sentiment,
      confidence: confidence,
      keywords: keywords
    };
  }

  analyzeMatchContext(matchSituation: string): {
    pressure: number;
    phase: 'early' | 'middle' | 'death';
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const doc = nlp(matchSituation);
    
    // Analyze pressure based on keywords
    const pressureWords = doc.match('(crucial|important|must-win|pressure|critical)').out('array');
    const pressure = Math.min(10, pressureWords.length * 2 + 5);

    // Determine match phase
    let phase: 'early' | 'middle' | 'death' = 'middle';
    if (doc.match('(powerplay|start|beginning|early)').found) {
      phase = 'early';
    } else if (doc.match('(death|final|last|ending)').found) {
      phase = 'death';
    }

    // Assess risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    const riskIndicators = doc.match('(risky|safe|conservative|aggressive)').out('array');
    const riskSentiment = this.analyzeSentiment(riskIndicators.join(' '));
    
    if (riskSentiment < -0.5) riskLevel = 'high';
    else if (riskSentiment > 0.5) riskLevel = 'low';

    return {
      pressure,
      phase,
      riskLevel
    };
  }
}