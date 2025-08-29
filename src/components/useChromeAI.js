import { useCallback } from "react";
import axios from 'axios';

// Use API base from .env
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function useChromeAI() {
  const detectLanguage = useCallback(async (text) => {
    try{
      if(!text || typeof text !== 'string'){
        throw new Error("Invalid input for language detection.");
      }
      const res = await axios.post(`${API_BASE_URL}/api/detect`, 
        { text },
        { headers: { 'Content-Type': 'application/json'
          } 
             });
      if(!res.data || res.data.length === 0){
        throw new Error('No language detected');
      }
      const result = res.data[0];

      return{
        detectedLanguage: result.language,
        confidence: result.confidence || 1,
      };
    }catch (error){
      throw new Error('Language detection failed');
    }
}, []);

const translateText = useCallback (async (text, targetLang= 'en') => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/translate`, {
      text,
      to: targetLang,
    },
    {headers: {'Content-Type':'application/json'}}
    );
    if (Array.isArray(res.data) && res.data[0]?.translations?.length) {
      return res.data[0].translations[0].text;
    }

    return "No Translation Available";
  } catch (error) {
   if (error.response) {
  console.error("Translationerror:", error.response.data);
} else {
  console.error("Translationerror:", error?.message || error);
}
    throw new Error('Translation failed');
  } 
}, []);

const summarizeText = useCallback(async (text) => {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error("Invalid input for summarization.");
    }

    // Frontend 150-word check
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 150) {
      throw new Error(`Text must be at least 150 words long to summarize. You currently have ${wordCount} words.`);
    }

    const res = await axios.post(`${API_BASE_URL}/api/summarize`,
      { text },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return res.data.summary;
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error(error.message || 'Summarization failed');
  }
}, []);



 return{
  detectLanguage,
  translateText,
  summarizeText,
 };
}

