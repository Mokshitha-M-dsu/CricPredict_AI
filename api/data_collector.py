import pandas as pd
import requests
from datetime import datetime
import json
import os

class CricketDataCollector:
    def __init__(self):
        self.api_key = os.getenv('RAPIDAPI_KEY')
        self.base_url = 'https://cricbuzz-cricket.p.rapidapi.com'
        self.headers = {
            'X-RapidAPI-Key': self.api_key,
            'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        }
        
    def collect_match_data(self):
        """Collect match data and save to CSV for model training"""
        try:
            # Fetch live and recent matches
            response = requests.get(
                f'{self.base_url}/matches/v1/recent',
                headers=self.headers
            )
            matches = response.json()
            
            # Process and structure the data
            match_data = []
            for match in matches['typeMatches']:
                for series in match['seriesMatches']:
                    if 'matches' not in series:
                        continue
                    for game in series['matches']:
                        if 'matchScore' not in game:
                            continue
                        
                        match_info = self._extract_match_info(game)
                        if match_info:
                            match_data.append(match_info)
            
            # Convert to DataFrame and save
            df = pd.DataFrame(match_data)
            df.to_csv('data/match_data.csv', index=False)
            print(f"Saved {len(match_data)} matches to CSV")
            
        except Exception as e:
            print(f"Error collecting match data: {str(e)}")
    
    def _extract_match_info(self, match):
        try:
            score_info = match['matchScore']['inningsScore'][0]
            return {
                'match_id': match['matchInfo']['matchId'],
                'current_score': score_info['runs'],
                'overs': score_info['overs'],
                'wickets': score_info['wickets'],
                'final_score': score_info.get('runs', 0),
                'pitch_conditions': self._get_pitch_conditions(match['matchInfo']['matchId']),
                'weather': self._get_weather_conditions(match['matchInfo']['matchId']),
                'date': datetime.now().strftime('%Y-%m-%d')
            }
        except (KeyError, IndexError):
            return None
    
    def _get_pitch_conditions(self, match_id):
        try:
            response = requests.get(
                f'{self.base_url}/matches/v1/{match_id}/pitch-report',
                headers=self.headers
            )
            return response.json().get('pitchReport', 'neutral')
        except:
            return 'neutral'
    
    def _get_weather_conditions(self, match_id):
        try:
            response = requests.get(
                f'{self.base_url}/matches/v1/{match_id}/weather',
                headers=self.headers
            )
            return response.json().get('weather', 'sunny')
        except:
            return 'sunny'

if __name__ == "__main__":
    collector = CricketDataCollector()
    collector.collect_match_data()