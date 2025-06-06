require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-frontend-url.vercel.app'] // Fallback in case FRONTEND_URL is not set
    : ['http://localhost:3000'], // Allow local frontend
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('URL Summarizer API is running!');
});

const summarizeRoutes = require('./routes/summarize');
app.use('/api/summarize', summarizeRoutes);

// Start server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
