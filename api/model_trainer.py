import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
from fastapi import HTTPException
import logging

class ModelTrainer:
    def __init__(self):
        self.model = None
        self.le_pitch = LabelEncoder()
        self.le_weather = LabelEncoder()
        self.logger = logging.getLogger(__name__)
    
    def train_model(self, data_path: str = 'data/match_data.csv'):
        try:
            # Load real match data
            df = pd.read_csv(data_path)
            
            # Prepare features
            X = pd.DataFrame({
                'score': df['current_score'],
                'overs': df['overs'],
                'wickets': df['wickets'],
                'pitch': self.le_pitch.fit_transform(df['pitch_conditions']),
                'weather': self.le_weather.fit_transform(df['weather'])
            })
            y = df['final_score']
            
            # Split dataset
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model
            self.model.fit(X_train, y_train)
            
            # Save trained model and encoders
            joblib.dump(self.model, 'models/cricket_model.joblib')
            joblib.dump(self.le_pitch, 'models/pitch_encoder.joblib')
            joblib.dump(self.le_weather, 'models/weather_encoder.joblib')
            
            # Calculate metrics
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            
            return {
                'train_score': train_score,
                'test_score': test_score,
                'feature_importance': dict(zip(X.columns, self.model.feature_importances_))
            }
            
        except Exception as e:
            self.logger.error(f"Error training model: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")

    def load_model(self):
        try:
            self.model = joblib.load('models/cricket_model.joblib')
            self.le_pitch = joblib.load('models/pitch_encoder.joblib')
            self.le_weather = joblib.load('models/weather_encoder.joblib')
        except Exception as e:
            self.logger.error(f"Error loading model: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to load model")