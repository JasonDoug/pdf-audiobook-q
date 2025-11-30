# PDF Audiobook Frontend

React frontend for the PDF to Audiobook pipeline built with Vite and Tailwind CSS.

## Features

- **Upload Page**: PDF file upload with progress indication
- **Beats Review Page**: Review and approve narrative beats with inline editing
- **Player Page**: Audio playback with chapter navigation

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment (optional):
```bash
cp .env.example .env
# Edit .env to set VITE_API_URL if backend is running
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000

### Mock Mode

When `VITE_API_URL` is not set, the app runs in mock mode with sample data:
- Upload returns mock job ID
- Beats page shows sample beats for review
- Player page shows sample audio manifest

### Build for Production

```bash
npm run build
npm run preview
```

## API Integration

The frontend expects these API endpoints:

- `POST /upload` - Upload PDF file
- `GET /job/{id}` - Get job status
- `GET /job/{id}/beats` - Get beats for review
- `POST /job/{id}/beats/{beat_id}/approve` - Approve beat (with TaskToken)
- `GET /job/{id}/audio` - Get audio manifest with presigned URLs

## Components

- **Upload**: File upload with validation
- **Beats**: Beat review with inline editing and approval
- **Player**: Audio player with chapter navigation
- **API Service**: Handles backend communication with mock fallback
