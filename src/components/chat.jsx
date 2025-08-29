import { useState, useRef, useEffect, useCallback } from "react";
import './chat.css';
import { Send } from 'lucide-react';
import { toast } from "../components/ui/use-toast";
import { useChromeAI } from "../components/useChromeAI";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const { detectLanguage, summarizeText, translateText,} = useChromeAI();

  const [availableFeatures, setAvailableFeatures] = useState({
    translator: false,
    languageDetector: false,
   summarizer: false,
   });
    useEffect(() => {
    setAvailableFeatures({
      translator: true,
      languageDetector: true,
      summarizer: true,
    });
  }, []);
 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateMessage = useCallback((id, updates) => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
  }, []);

  const generateMessageId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const handleSummarize = useCallback(async (msg) => {
    if (msg.detectedLanguage !== 'en' || msg.content.length <= 150) return;
    try {
      const summary = await summarizeText(msg.content);
      updateMessage(msg.id, { summary });
    } catch (error) {
      toast({
        title: "Summary failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  }, [summarizeText, updateMessage]);

  const handleTranslate = useCallback(async (msg) => {
    try {
      const translation = await translateText(msg.content, msg.selectedLanguage);
      updateMessage(msg.id, { translation });
    } catch (error) {
      toast({
        title: "Translation failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  }, [translateText, updateMessage]);

  const handleLanguageChange = useCallback((msgId, lang) => {
    updateMessage(msgId, { selectedLanguage: lang });
  }, [updateMessage]);

  const handleSendMessage = useCallback(async (content) => {
    const userMessageId = generateMessageId();
    const loadingMessageId = generateMessageId();

    const userMessage = {
      id: userMessageId,
      type: 'user',
      content,
      timestamp: new Date().toLocaleTimeString(),
      detectedLanguage: null,
      languageConfidence: null,
      summary: null,
      translation: null,
      selectedLanguage: 'fr'
    };

    const loadingMessage = {
      id: loadingMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsProcessing(true);
    try {
      const languageResult = await detectLanguage(content);

      updateMessage(userMessageId, {
        detectedLanguage: languageResult.detectedLanguage,
        languageConfidence: languageResult.confidence,
      });

      await handleSummarize({ id: userMessageId, content, detectedLanguage: languageResult.detectedLanguage });
      await handleTranslate({ id: userMessageId, content, selectedLanguage: 'en' });

      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
       const responseMessage = {
  id: generateMessageId(),
  type: 'ai',
  content: `✅ Done! Language: ${languageResult.detectedLanguage}`,
  timestamp: new Date().toLocaleTimeString(),
};
        return [...filtered, responseMessage];
      });

      toast({
        title: "Message processed",
        description: `Detected: ${languageResult.detectedLanguage}`,
      });

    } catch (error) {
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
        return [...filtered, {
          id: generateMessageId(),
          type: 'ai',
          content: `Error: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        }];
      });
    } finally {
      setIsProcessing(false);
    }
  }, [detectLanguage, updateMessage, handleSummarize, handleTranslate]);

  const handleSend = () => {
    if (!input.trim()) return;
    handleSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="main-chat-wrapper">
      <div className="chat-container">
        {messages.map((msg) =>
          msg.isLoading ? (
            <div key={msg.id} className="chat-message chat-message-ai fade-in-up">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <span className="processing-text">Processing your message...</span>
              </div>
            </div>
          ) : (
            <div key={msg.id} className={`chat-message ${msg.type === 'user' ? 'chat-message-user' : 'chat-message-ai'} fade-in-up`}>
              <div className="message-content">
                <p>{msg.content}</p>
              </div>
              <div className="message-meta">
                <span className="timestamp">{msg.timestamp}</span>
                {msg.detectedLanguage && (
                  <span className="language-badge">
                    {msg.detectedLanguage} ({Math.round(msg.languageConfidence * 100)}%)
                  </span>
                )}
              </div>
              {msg.detectedLanguage === 'en' && msg.content.length > 150 && !msg.summary && (
                <button onClick={() => handleSummarize(msg)} className="action-button">Summarize</button>
              )}
              {msg.summary && <div className="summary"><strong>Summary:</strong> {msg.summary}</div>}

              {availableFeatures.translator && (
              <div className="translate-section">
                <select 
                id={`language-select-${msg.id}`}
                name={`language-${msg.id}`}
                aria-label="Select target language"
                value={msg.selectedLanguage} 
                onChange={(e) => 
                handleLanguageChange(msg.id, e.target.value)}>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                 <option value="de">German</option>
                 <option value="ha">Hausa</option>
                  <option value="ig">Igbo</option>
                  <option value="es">Spanish</option>
                  <option value="tr">Turkish</option>
                  <option value="yo">Yoruba</option>
                 
                </select>
                <button onClick={() => handleTranslate(msg)} className="action-button">Translate</button>
              </div>
              )}
              {msg.translation && <div className="translation"><strong>Translation:</strong> {msg.translation}</div>}
            </div>
          )
        )}

        <div ref={messagesEndRef} />

        <div className="chat-input-wrapper">
          <textarea
           id="chat-input"
           name="chat"
            className="chat-textarea"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isProcessing}
          />
          <button onClick={handleSend} className="send-button" disabled={isProcessing}>
            <Send className="buttonsed" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
