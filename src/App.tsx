import React from 'react';
import { Trophy } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { ScorePrediction } from './components/ScorePrediction';
import { PlayerRecommender } from './components/PlayerRecommender';
import { TeamSelector } from './components/TeamSelector';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Toaster position="top-right" />
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              CricPredict AI
            </h1>
          </div>
          <p className="mt-2 text-gray-600">Advanced Cricket Analytics & Predictions</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ScorePrediction />
          <TeamSelector />
          <PlayerRecommender />
        </div>
      </main>

      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            CricPredict AI - Making cricket predictions smarter with artificial intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;