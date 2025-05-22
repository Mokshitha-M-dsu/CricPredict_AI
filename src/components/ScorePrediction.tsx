import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ErrorMessage } from './common/ErrorMessage';
import { ResponseDisplay } from './common/ResponseDisplay';
import { ScorePredictionForm } from './ScorePrediction/ScorePredictionForm';
import { usePrediction } from './ScorePrediction/usePrediction';
import { toast } from 'react-hot-toast';

export function ScorePrediction() {
  const { predict, initialized, error: modelError } = usePrediction();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentScore: '',
    overs: '',
    wickets: '',
    pitchConditions: '',
    weather: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    if (!initialized) {
      toast.error('Prediction model is not ready');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await predict({
        current_score: parseInt(formData.currentScore),
        overs: parseFloat(formData.overs),
        wickets: parseInt(formData.wickets),
        pitch_conditions: formData.pitchConditions,
        weather: formData.weather,
      });

      const predictionText = `
T20 Match Prediction (20 overs):
--------------------------------
Current Score: ${formData.currentScore}/${formData.wickets} (${formData.overs} overs)
Predicted Final Score: ${result.predictedScore}
Required Run Rate: ${result.projectedRunRate}/over
Confidence: ${result.confidence}%

Similar T20 Matches:
${result.similarMatches.map(match => 
  `• ${match.current_score}/${match.wickets} (${match.overs}) → ${match.final_score}`
).join('\n')}
      `.trim();

      setPrediction(predictionText);
      toast.success('T20 prediction generated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate prediction';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="T20 Score Prediction" icon={TrendingUp} iconColor="text-blue-600">
      {modelError && (
        <ErrorMessage message="Failed to initialize T20 prediction model" />
      )}
      
      <ScorePredictionForm formData={formData} onChange={handleInputChange} />
      
      <Button
        onClick={handlePredict}
        loading={loading}
        disabled={loading || !initialized}
        color="bg-blue-600"
      >
        Predict T20 Score
      </Button>

      {error && <ErrorMessage message={error} />}
      
      {prediction && (
        <ResponseDisplay
          response={prediction}
          color="bg-blue-50 border-blue-100"
          title="T20 Prediction Result"
        />
      )}
    </Card>
  );
}