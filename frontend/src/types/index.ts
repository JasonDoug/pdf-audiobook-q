export interface Job {
  id: string;
  status: 'processing' | 'beats_ready' | 'completed' | 'failed';
  pdf_metadata?: {
    pages: number;
    size_mb: number;
    title: string;
  };
}

export interface Beat {
  id: string;
  title: string;
  duration_minutes: number;
  content_summary: string;
  requires_approval: boolean;
  approved?: boolean;
  script?: string;
  audio_url?: string;
}

export interface AudioManifest {
  job_id: string;
  beats: Beat[];
  total_duration_minutes: number;
}
