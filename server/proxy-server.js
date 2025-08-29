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

const translatorKey = process.env.AZURE_TRANSLATOR_KEY;
const translatorRegion = process.env.AZURE_TRANSLATOR_REGION;
const translatorEndpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const openaiApikey = process.env.OPENAI_API_KEY;

// Detect language
app.post('/api/detect', async (req, res) => {
  try {
    const { text } = req.body;
if(!text || typeof text !== 'string' || text.trim() === ''){
    return res.status(400).json({error: 'Text is required and must be a non-empty string'});
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
      params: {
        'api-version': '3.0'
      },
      data: [{ Text: text }],
      responseType: 'json'
    });

    res.json(response.data);
  } catch (error) {
   console.error("Detect API Error: ", error.response?.data || error.message);
   res.status(500).json({
    error: 'Language detection failed',
    details: error.message,
    apiResponse: error.response?.data|| null
   });
  }
});

// Translate text
app.post('/api/translate', async (req, res) => {
  try {
    const { text, to } = req.body;
    if(!text || typeof text !== 'string' || text.trim() === ''){
    return res.status(400).json({error: 'Text is required and must be a non-empty string'});
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
      params: {
        'api-version': '3.0',
        to: to
      },
      data: [{ Text: text }],
      responseType: 'json'
    });

    res.json(response.data);
  } catch (error) {
    console.error("Translate API Error: ", error.response?.data || error.message);
   res.status(500).json({
    error: 'Translation failed',
    details: error.message,
    apiResponse: error.response?.data|| null
   });
  }
});

//Summarize Text
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
          timeout: 120000, // 2 minutes
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          httpAgent: new (require('http').Agent)({ keepAlive: true }),
          httpsAgent: new (require('https').Agent)({ keepAlive: true })
        }
      );
    };

    // Retry logic: 2 attempts
    let response;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await makeRequest();
        break; // success
      } catch (err) {
        if (attempt === 1) throw err; // throw after last attempt
      }
    }

    const summary = response?.data?.choices?.[0]?.message?.content?.trim() || '';
    res.json({ summary });

  } catch (error) {
    console.error("Summarization API Error:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Summarization failed',
      details: error.message,
      apiResponse: error.response?.data || null
    });
  }
});
  app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});

//To start the Backend its "node" then the main name of the backend file .
// "node proxy-server.js" if "proxy-server.js" is the main file 