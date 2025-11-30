import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Beat } from '../types';

export const Beats: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBeat, setEditingBeat] = useState<string | null>(null);
  const [editScript, setEditScript] = useState('');

  useEffect(() => {
    if (jobId) {
      loadBeats();
    }
  }, [jobId]);

  const loadBeats = async () => {
    try {
      const beatsData = await api.getBeats(jobId!);
      setBeats(beatsData);
    } catch (error) {
      console.error('Failed to load beats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (beatId: string) => {
    try {
      await api.approveBeat(jobId!, beatId);
      setBeats(beats.map(beat => 
        beat.id === beatId ? { ...beat, approved: true } : beat
      ));
    } catch (error) {
      console.error('Failed to approve beat:', error);
    }
  };

  const handleEdit = (beat: Beat) => {
    setEditingBeat(beat.id);
    setEditScript(beat.script || '');
  };

  const handleSaveEdit = (beatId: string) => {
    setBeats(beats.map(beat => 
      beat.id === beatId ? { ...beat, script: editScript } : beat
    ));
    setEditingBeat(null);
    setEditScript('');
  };

  const allApproved = beats.filter(b => b.requires_approval).every(b => b.approved);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading beats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Review Beats</h1>
          <div className="space-x-2">
            {allApproved && (
              <button
                onClick={() => navigate(`/player/${jobId}`)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Generate Audio
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              New Upload
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {beats.map((beat) => (
            <div key={beat.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{beat.title}</h3>
                  <p className="text-gray-600">{beat.content_summary}</p>
                  <p className="text-sm text-gray-500">Duration: {beat.duration_minutes} minutes</p>
                </div>
                <div className="flex space-x-2">
                  {beat.requires_approval && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      beat.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {beat.approved ? 'Approved' : 'Needs Approval'}
                    </span>
                  )}
                </div>
              </div>

              {beat.script && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Script:
                  </label>
                  {editingBeat === beat.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editScript}
                        onChange={(e) => setEditScript(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        rows={4}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(beat.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingBeat(null)}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-800">{beat.script}</p>
                      <button
                        onClick={() => handleEdit(beat)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit Script
                      </button>
                    </div>
                  )}
                </div>
              )}

              {beat.requires_approval && !beat.approved && (
                <button
                  onClick={() => handleApprove(beat.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Approve Beat
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
