# Aluma Demo

Simple demo app: upload images (OCR via Google Vision) or audio (Whisper) and return extracted text.

Folders
- `backend` - Node/Express API that handles uploads and processing.
- `frontend` - Vite + React app for uploading files and showing results.

Quick start (macOS / zsh)

1) Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your OPENAI_API_KEY and GCP_CREDENTIALS_B64 (base64 of service account JSON)
npm run dev
```

2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Optionally set VITE_API_BASE_URL to your deployed backend URL
npm run dev
```

Testing

Use the form in the frontend or curl directly:

```bash
curl -F "file=@/path/to/note.jpg" http://localhost:3000/upload
curl -F "file=@/path/to/voice.m4a" http://localhost:3000/upload
```

Deployment notes

- Backend can be deployed to Railway or Render. Remember to set `OPENAI_API_KEY`, `GCP_CREDENTIALS_B64`, and `FRONTEND_ORIGIN` in the host's env.
- Frontend can be deployed to Netlify or GitHub Pages. Set `VITE_API_BASE_URL` to the backend `/upload` URL.
- Embed the frontend in a Vercel landing page via an iframe.
# aluma-demo