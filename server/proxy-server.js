const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Environment variables
const translatorKey = process.env.AZURE_TRANSLATOR_KEY;
const translatorRegion = process.env.AZURE_TRANSLATOR_REGION;
const translatorEndpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const openaiApikey = process.env.OPENAI_API_KEY;

// ✅ Check that env variables exist at startup
if (!translatorKey || !translatorRegion || !translatorEndpoint) {
  console.warn("⚠️ Azure Translator env vars missing!");
}
if (!openaiApikey) {
  console.warn("⚠️ OpenAI API key missing!");
}

// -------------------- Detect Language --------------------
app.post('/api/detect', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
    }

    const response = await axios({
      baseURL: translatorEndpoint,
      url: '/detect',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': translatorKey,
        'Ocp-Apim-Subscription-Region': translatorRegion,
        'Content-type': 'application/json',
      },
      params: { 'api-version': '3.0' },
      data: [{ Text: text }],
      timeout: 15000 // ⏳ 15s timeout
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Detect API Error:", {
      message: error.message,
      code: error.code,
      response: error.response?.data || null
    });
    res.status(500).json({
      error: 'Language detection failed',
      details: error.message,
      apiResponse: error.response?.data || null
    });
  }
});

// -------------------- Translate Text --------------------
app.post('/api/translate', async (req, res) => {
  try {
    const { text, to } = req.body;
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
    }

    if (!to) {
      return res.status(400).json({ error: '"to" language code is required' });
    }

    const response = await axios({
      baseURL: translatorEndpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': translatorKey,
        'Ocp-Apim-Subscription-Region': translatorRegion,
        'Content-type': 'application/json',
      },
      params: { 'api-version': '3.0', to },
      data: [{ Text: text }],
      timeout: 15000
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Translate API Error:", {
      message: error.message,
      code: error.code,
      response: error.response?.data || null
    });
    res.status(500).json({
      error: 'Translation failed',
      details: error.message,
      apiResponse: error.response?.data || null
    });
  }
});

// -------------------- Summarize Text --------------------
app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required for summarization' });
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 150) {
      return res.status(400).json({ error: 'Text must be at least 150 words long to summarize' });
    }

    const makeRequest = async () => {
      return await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that summarizes text.' },
            { role: 'user', content: `Summarize this text in a concise way: ${text}` }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApikey}`,
            'Content-Type': 'application/json'
          },
          timeout: 120000
        }
      );
    };

    // Retry logic (2 attempts)
    let response;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await makeRequest();
        break;
      } catch (err) {
        if (attempt === 1) throw err;
      }
    }

    const summary = response?.data?.choices?.[0]?.message?.content?.trim() || '';
    res.json({ summary });

  } catch (error) {
    console.error("❌ Summarization API Error:", {
      message: error.message,
      code: error.code,
      response: error.response?.data || null
    });
    res.status(500).json({
      error: 'Summarization failed',
      details: error.message,
      apiResponse: error.response?.data || null
    });
  }
});

// -------------------- Health Check --------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    azure: {
      key: !!translatorKey,
      region: !!translatorRegion,
      endpoint: !!translatorEndpoint
    },
    openai: !!openaiApikey
  });
});

// -------------------- Start Server --------------------
app.listen(port, () => {
  console.log(`✅ Proxy server running on http://localhost:${port}`);
});
