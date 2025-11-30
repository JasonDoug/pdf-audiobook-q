import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AudioManifest, Beat } from '../types';

export const Player: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [manifest, setManifest] = useState<AudioManifest | null>(null);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (jobId) {
      loadAudioManifest();
    }
  }, [jobId]);

  const loadAudioManifest = async () => {
    try {
      const manifestData = await api.getAudioManifest(jobId!);
      setManifest(manifestData);
    } catch (error) {
      console.error('Failed to load audio manifest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleBeatSelect = (index: number) => {
    setCurrentBeat(index);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (manifest && currentBeat < manifest.beats.length - 1) {
      setCurrentBeat(currentBeat + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentBeat > 0) {
      setCurrentBeat(currentBeat - 1);
      setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading audiobook...</div>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Failed to load audiobook</div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  const currentBeatData = manifest.beats[currentBeat];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Audiobook Player</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            New Upload
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {currentBeatData.title}
            </h2>
            <p className="text-gray-600">{currentBeatData.content_summary}</p>
          </div>

          {/* Audio Player */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <audio
              ref={audioRef}
              src={currentBeatData.audio_url}
              onEnded={() => setIsPlaying(false)}
              className="w-full mb-4"
              controls
            />
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentBeat === 0}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-300"
              >
                Previous
              </button>
              
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentBeat === manifest.beats.length - 1}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>

          {/* Beat List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapters</h3>
            <div className="space-y-2">
              {manifest.beats.map((beat, index) => (
                <button
                  key={beat.id}
                  onClick={() => handleBeatSelect(index)}
                  className={`w-full text-left p-3 rounded-md border ${
                    index === currentBeat
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{beat.title}</div>
                      <div className="text-sm text-gray-600">{beat.content_summary}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {beat.duration_minutes} min
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600">
          Total Duration: {manifest.total_duration_minutes} minutes
        </div>
      </div>
    </div>
  );
};
