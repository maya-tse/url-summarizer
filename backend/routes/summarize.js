const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cheerio = require('cheerio');
const axios = require('axios');

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to validate URL
const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
};

// Helper function to fetch and scrape website content
async function scrapeContent(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);

    // Extract title
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || $('h1').first().text();

    // Extract main content (simplified - might need refinement for different sites)
    let mainContent = '';
    $('p').each((i, el) => {
      mainContent += $(el).text() + '\n';
    });

    if (!mainContent) {
        // Fallback: try to get text from body if no p tags found or they are empty
        mainContent = $('body').text().replace(/\s\s+/g, ' ').trim(); 
    }

    // Limit content to avoid exceeding API limits (e.g., first 5000 characters)
    mainContent = mainContent.substring(0, 5000);

    return { title: title.trim(), content: mainContent.trim() };
  } catch (error) {
    console.error('Error scraping content:', error);
    throw new Error('Failed to fetch or scrape content from the URL.');
  }
}

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ status: 'error', message: 'URL is required.' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ status: 'error', message: 'Invalid URL format.' });
  }

  try {
    const { title, content } = await scrapeContent(url);

    if (!content) {
      return res.status(500).json({ status: 'error', message: 'Could not extract content from the URL.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Or your preferred model
    const prompt = `以下のWebページの内容を日本語で1行（150文字以内）で要約してください。要点を簡潔にまとめ、読みやすい文章にしてください。記事のタイトルは「${title}」です。記事の内容：\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary: summary.trim(), title: title || 'No title found', status: 'success' });

  } catch (error) {
    console.error('Summarization error:', error);
    let errorMessage = 'Failed to summarize the URL.';
    if (error.message.includes('scrape')) {
        errorMessage = error.message;
    } else if (error.message.includes('API key not valid')) {
        errorMessage = 'Google Gemini API key is not valid. Please check your .env file.';
    }
    res.status(500).json({ status: 'error', message: errorMessage, details: error.message });
  }
});

module.exports = router;
