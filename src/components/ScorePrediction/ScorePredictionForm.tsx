import React from 'react';

interface ScorePredictionFormProps {
  formData: {
    currentScore: string;
    overs: string;
    wickets: string;
    pitchConditions: string;
    weather: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ScorePredictionForm({ formData, onChange }: ScorePredictionFormProps) {
  const pitchOptions = ['Batting', 'Bowling', 'Neutral', 'Spinning', 'Seaming'];
  const weatherOptions = ['Sunny', 'Cloudy', 'Overcast', 'Light Rain', 'Humid'];

  const handleOversChange = (value: string) => {
    // Parse the input value
    let [wholePart, decimalPart] = value.split('.');
    
    // Handle decimal part if it exists
    if (decimalPart) {
      // Ensure decimal part is not greater than 5
      decimalPart = parseInt(decimalPart) > 5 ? '5' : decimalPart;
      value = `${wholePart}.${decimalPart}`;
    }

    // Ensure the whole number part doesn't exceed 19
    // (since 19.5 is the maximum valid over count in T20)
    if (parseInt(wholePart) > 19) {
      value = '19.5';
    }

    onChange('overs', value);
  };

  return (
    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Score
        </label>
        <input
          type="number"
          value={formData.currentScore}
          onChange={(e) => onChange('currentScore', e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter current score"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Overs Played
        </label>
        <input
          type="number"
          value={formData.overs}
          onChange={(e) => handleOversChange(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter overs played"
          min="0"
          max="19.5"
          step="0.1"
        />
        <p className="text-sm text-gray-500 mt-1">Format: XX.Y where Y is 0-5 (e.g., 6.4 means 6 overs and 4 balls)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Wickets
        </label>
        <input
          type="number"
          value={formData.wickets}
          onChange={(e) => onChange('wickets', e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter wickets fallen"
          min="0"
          max="10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pitch Conditions
        </label>
        <select
          value={formData.pitchConditions}
          onChange={(e) => onChange('pitchConditions', e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select pitch condition</option>
          {pitchOptions.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weather
        </label>
        <select
          value={formData.weather}
          onChange={(e) => onChange('weather', e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select weather condition</option>
          {weatherOptions.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}