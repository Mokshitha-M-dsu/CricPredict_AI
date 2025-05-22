import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ErrorMessage } from './common/ErrorMessage';
import { ResponseDisplay } from './common/ResponseDisplay';
import { TeamSelectorForm } from './TeamSelector/TeamSelectorForm';
import { analyzeTeamComposition } from '../utils/recommendations/teamAnalyzer';
import { FormData } from './TeamSelector/types';
import { toast } from 'react-hot-toast';

export function TeamSelector() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customSquad: '',
    pitchType: '',
    weather: '',
    opposition: ''
  });
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecommend = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.customSquad.trim()) {
        throw new Error('Please enter the squad list');
      }
      if (!formData.pitchType || !formData.weather) {
        throw new Error('Please select pitch type and weather conditions');
      }

      const result = analyzeTeamComposition(
        formData.customSquad,
        formData.pitchType,
        formData.weather,
        formData.opposition
      );

      const recommendationText = `
Playing XI Analysis:

Selected Team:
${result.playing11.map((p, i) => `${i + 1}. ${p.name} (${p.role})`).join('\n')}

Substitutes:
${Object.entries(result.substitutes)
  .filter(([_, players]) => players.length > 0)
  .map(([role, players]) => `${role}: ${players.map(p => p.name).join(', ')}`)
  .join('\n')}

Analysis & Strategy:
${result.reasoning}

Opposition Considerations:
${formData.opposition ? result.oppositionAnalysis || 'No specific opposition analysis' : 'No opposition analysis provided'}
`.trim();

      setRecommendation(recommendationText);
      toast.success('Team analysis completed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to analyze team';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Team Selector" icon={Users} iconColor="text-green-600">
      <TeamSelectorForm
        formData={formData}
        onChange={handleInputChange}
      />
      <Button
        onClick={handleRecommend}
        loading={loading}
        disabled={loading || !formData.customSquad.trim() || !formData.pitchType || !formData.weather}
        color="bg-green-600"
      >
        Analyze Squad
      </Button>
      {error && <ErrorMessage message={error} />}
      {recommendation && (
        <ResponseDisplay
          response={recommendation}
          color="bg-green-50 border-green-100"
          title="Team Analysis"
        />
      )}
    </Card>
  );
}