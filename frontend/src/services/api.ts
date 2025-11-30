import { Job, Beat, AudioManifest } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const USE_MOCK = !import.meta.env.VITE_API_URL;

// Mock data for development
const mockJob: Job = {
  id: 'job-123',
  status: 'beats_ready',
  pdf_metadata: {
    pages: 150,
    size_mb: 2.5,
    title: 'Sample Academic Paper'
  }
};

const mockBeats: Beat[] = [
  {
    id: 'beat-1',
    title: 'Introduction',
    duration_minutes: 3,
    content_summary: 'Opening hook and overview',
    requires_approval: true,
    script: 'Welcome to this fascinating exploration of...'
  },
  {
    id: 'beat-2', 
    title: 'Main Content',
    duration_minutes: 15,
    content_summary: 'Core concepts and analysis',
    requires_approval: false,
    script: 'Now let us dive deeper into the key findings...'
  }
];

export const api = {
  async uploadPdf(file: File): Promise<{ job_id: string }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { job_id: 'job-123' };
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  },

  async getJob(jobId: string): Promise<Job> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockJob;
    }
    
    const response = await fetch(`${API_BASE}/job/${jobId}`);
    return response.json();
  },

  async getBeats(jobId: string): Promise<Beat[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockBeats;
    }
    
    const response = await fetch(`${API_BASE}/job/${jobId}/beats`);
    return response.json();
  },

  async approveBeat(jobId: string, beatId: string, taskToken?: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    
    await fetch(`${API_BASE}/job/${jobId}/beats/${beatId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskToken })
    });
  },

  async getAudioManifest(jobId: string): Promise<AudioManifest> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        job_id: jobId,
        beats: mockBeats.map(beat => ({
          ...beat,
          audio_url: `https://example.com/audio/${beat.id}.mp3`
        })),
        total_duration_minutes: 18
      };
    }
    
    const response = await fetch(`${API_BASE}/job/${jobId}/audio`);
    return response.json();
  }
};
