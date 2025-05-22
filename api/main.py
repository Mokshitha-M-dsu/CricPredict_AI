from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import pandas as pd
import numpy as np
from typing import List, Optional
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import json

app = FastAPI()

# Data Models
class MatchData(BaseModel):
    current_score: int
    overs: float
    wickets: int
    pitch_conditions: str
    weather: str

class PlayerStats(BaseModel):
    name: str
    matches: int
    runs: int
    average: float
    strike_rate: float
    wickets: Optional[int] = None
    economy: Optional[float] = None

class ModelMetrics(BaseModel):
    accuracy: float
    mse: float
    feature_importance: dict

# Global variables for models and encoders
model = None
le_pitch = LabelEncoder()
le_weather = LabelEncoder()

def initialize_model():
    global model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )

# Load custom dataset
def load_custom_dataset(file_path: str):
    try:
        return pd.read_csv(file_path)
    except Exception as e:
        raise Exception(f"Error loading dataset: {str(e)}")

# Train model with custom dataset
def train_model_with_data(df: pd.DataFrame):
    try:
        # Prepare features
        X = pd.DataFrame({
            'score': df['current_score'],
            'overs': df['overs'],
            'wickets': df['wickets'],
            'pitch': le_pitch.fit_transform(df['pitch_conditions']),
            'weather': le_weather.fit_transform(df['weather'])
        })
        y = df['final_score']

        # Split dataset
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Train model
        initialize_model()
        model.fit(X_train, y_train)

        # Calculate metrics
        train_score = model.score(X_train, y_train)
        test_score = model.score(X_test, y_test)
        
        # Feature importance
        feature_importance = dict(zip(X.columns, model.feature_importances_))

        return {
            'train_score': train_score,
            'test_score': test_score,
            'feature_importance': feature_importance
        }

    except Exception as e:
        raise Exception(f"Error training model: {str(e)}")

# API Endpoints
@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        file_path = f"data/{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Load and train with new dataset
        df = load_custom_dataset(file_path)
        metrics = train_model_with_data(df)

        # Save trained model
        joblib.dump(model, 'models/cricket_model.joblib')
        
        return {
            "message": "Model trained successfully",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-score")
async def predict_score(data: MatchData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not trained")

    try:
        input_data = pd.DataFrame({
            'score': [data.current_score],
            'overs': [data.overs],
            'wickets': [data.wickets],
            'pitch': le_pitch.transform([data.pitch_conditions]),
            'weather': le_weather.transform([data.weather])
        })
        prediction = model.predict(input_data)[0]
        
        confidence = model.predict_proba(input_data)[0] if hasattr(model, 'predict_proba') else None
        
        return {
            "predicted_score": round(prediction),
            "confidence": round(confidence * 100, 2) if confidence is not None else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-info")
async def get_model_info():
    if model is None:
        return {"status": "Model not trained"}
    
    return {
        "status": "Model trained",
        "parameters": model.get_params(),
        "feature_names": list(le_pitch.classes_) + list(le_weather.classes_)
    }

# Initialize model on startup
@app.on_event("startup")
async def startup_event():
    try:
        # Try to load pre-trained model
        model = joblib.load('models/cricket_model.joblib')
    except:
        # Initialize new model if no pre-trained model exists
        initialize_model()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)