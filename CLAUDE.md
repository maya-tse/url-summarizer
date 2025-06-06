# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run dev:backend` - Start backend server with nodemon (port 3001)
- `npm start` - Start production backend server
- `npm run start:frontend` - Start React development server (port 3000)

### Individual Package Management
- `npm run install:backend` - Install only backend dependencies
- `npm run install:frontend` - Install only frontend dependencies

### Build and Test
- `npm run build` - Build frontend for production (outputs to frontend/build)
- `cd frontend && npm test` - Run React tests
- `cd frontend && npm run test -- --watchAll=false` - Run tests once without watch mode

## Architecture Overview

This is a full-stack URL summarization service that uses Google Gemini AI to generate summaries of web page content.

### Application Structure
- **Monorepo**: Single repository containing both frontend and backend
- **Frontend**: React + TypeScript + Tailwind CSS (Create React App)
- **Backend**: Express.js server with REST API
- **AI Integration**: Google Gemini API for content summarization
- **Web Scraping**: Cheerio + Axios for extracting web page content
- **Deployment**: Vercel with serverless functions

### Key Components
- `backend/server.js` - Express server with CORS configuration for local/production environments
- `backend/routes/summarize.js` - Main API endpoint that handles URL scraping and AI summarization
- `frontend/src/App.tsx` - Single-page React application with form handling and API integration
- `vercel.json` - Deployment configuration for Vercel hosting

### Data Flow
1. User submits URL through React frontend
2. Frontend sends POST request to `/api/summarize`
3. Backend validates URL and scrapes content using Cheerio
4. Content is sent to Google Gemini API for summarization
5. Summary and title are returned to frontend for display

### Environment Configuration
Backend requires `.env` file with:
- `GEMINI_API_KEY` - Google Gemini API key
- `PORT` - Server port (default 3001)
- `NODE_ENV` - Environment mode
- `FRONTEND_URL` - Production frontend URL for CORS

### API Endpoints
- `GET /` - Health check endpoint
- `POST /api/summarize` - Main summarization endpoint accepting `{ url: string }`

### Production Deployment
Configured for Vercel with:
- Static frontend build serving
- Serverless backend functions
- API routes proxied to `/api/*`
- Environment variables managed through Vercel dashboard