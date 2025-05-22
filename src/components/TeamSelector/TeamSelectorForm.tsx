import React from 'react';
import { TeamSelectorFormProps } from './types';

const PITCH_TYPES = ['Batting', 'Bowling', 'Spinning', 'Neutral'] as const;
const WEATHER_CONDITIONS = ['Sunny', 'Cloudy', 'Overcast', 'Light Rain'] as const;

export function TeamSelectorForm({ formData, onChange }: TeamSelectorFormProps) {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Squad List
        </label>
        <textarea
          value={formData.customSquad}
          onChange={(e) => onChange('customSquad', e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 min-h-[200px]"
          placeholder="Enter one player per line using the format:
Virat Kohli (Batsman)
Rohit Sharma (Batsman)
KL Rahul (Wicket-keeper)
Hardik Pandya (All-rounder)
Ravindra Jadeja (All-rounder)
Jasprit Bumrah (Bowler)

Valid roles: Batsman, Bowler, All-rounder, Wicket-keeper"
        />
        <p className="text-sm text-gray-500 mt-1">
          Format: Player Name (Role)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pitch Type
        </label>
        <select
          value={formData.pitchType}
          onChange={(e) => onChange('pitchType', e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select pitch type</option>
          {PITCH_TYPES.map((type) => (
            <option key={type} value={type.toLowerCase()}>
              {type}
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
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select weather condition</option>
          {WEATHER_CONDITIONS.map((condition) => (
            <option key={condition} value={condition.toLowerCase()}>
              {condition}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opposition Team & Strengths
        </label>
        <textarea
          value={formData.opposition}
          onChange={(e) => onChange('opposition', e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 min-h-[100px]"
          placeholder="Describe the opposition team and their strengths:
- Team name
- Key players
- Recent form
- Playing style (aggressive/defensive)
- Strengths (batting/bowling/fielding)"
        />
      </div>
    </div>
  );
}