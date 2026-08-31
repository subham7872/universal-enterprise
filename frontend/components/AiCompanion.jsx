"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, X, Mic, MicOff, Volume2, VolumeX, Sparkles, PhoneCall, RefreshCw } from 'lucide-react';
import api from '../lib/api';

export default function AiCompanion({ onSelectProduct }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Welcome to Universal Sourcing Assistant! I am grounded on our global NTN, NSK, THK, and SKF inventory. What part number, brand, or dimension can I quote for you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Check NTN 16001JRX', 'Equivalent of NTN 16030', 'Do you distribute THK components?', 'List Chennai location details']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Voice States
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // References
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-IN';
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsVoiceActive(true);
          setVoiceTranscript('Listening for bearing name or part code...');
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition notice:', e);
          setIsVoiceActive(false);
        };

        recognition.onend = () => {
          setIsVoiceActive(false);
        };

        recognition.onresult = (event) => {
          const resultText = event.results[0][0].transcript;
          setVoiceTranscript(resultText);
          handleSendMessage(resultText);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Speak response out loud using Web Speech API Synthesis
  const speakText = (text) => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel();

    const cleanText = text.replace(/[*#_₹-]/g, ' ').replace(/\s+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.02;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice Speech Recognition is not supported by your current browser.');
      return;
    }

    if (isVoiceActive) {
      recognitionRef.current.stop();
      setIsVoiceActive(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Voice start warning:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Auto lead capture detection in Chat
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = text.match(/(?:\+91|0)?[6789]\d{9}|\b\d{10}\b/);
      if (emailMatch || phoneMatch) {
        api.submitLead({
          name: 'Chatbot Visitor',
          email: emailMatch ? emailMatch[0] : '',
          phone: phoneMatch ? phoneMatch[0] : '',
          mobile: phoneMatch ? phoneMatch[0] : '',
          message: text,
          source: 'chatbot'
        }).catch(() => {});
      }

      const res = await api.sendChatMessage(newHistory);
      const assistantText = res.text || 'Thank you for your inquiry. Our engineering desk is verifying parameters.';

      const assistantMsg = {
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: res.preMatchedProducts || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(assistantText);
    } catch (err) {
      const fallbackMsg = {
        sender: 'assistant',
        text: `Universal Enterprise Desk note: We distribute genuine NTN, NSK, THK, and SKF units. Please contact ue14.email@gmail.com or call +91 9900726939 / 8123836939 for immediate quotes.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Voice Action Button on the Left */}
      {voiceSupported && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={toggleVoiceInput}
            className={`w-13 h-13 rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center ${
              isVoiceActive
                ? 'bg-red-600 border-white text-white animate-pulse'
                : 'bg-slate-900 border-[#f2cc4d] text-[#f2cc4d] hover:bg-slate-800 hover:text-white'
            }`}
            title={isVoiceActive ? 'Stop Listening' : 'Voice Search (Speech-to-Text)'}
          >
            {isVoiceActive ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>
      )}

      {/* Floating Circular Chatbot Action Button on the Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="group relative w-14 h-14 rounded-full bg-[#003366] hover:bg-[#002244] text-white border-2 border-[#f2cc4d] shadow-2xl transition transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
          title="AI Bearing Sourcing Desk"
        >
          <Bot className="w-7 h-7 text-[#f2cc4d] group-hover:rotate-12 transition-transform duration-200" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping"></span>
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] max-h-[600px] h-[80vh] bg-white border-2 border-[#003366] rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden text-slate-800 animate-in fade-in zoom-in duration-200 font-sans">
          
          {/* Header */}
          <div className="bg-[#003366] text-white p-3.5 border-b-2 border-[#f2cc4d] flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-[#f2cc4d]">
                <Bot className="w-4 h-4 text-[#003366]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  Universal AI Sourcing Desk
                  <Sparkles className="w-3.5 h-3.5 text-[#f2cc4d]" />
                </h4>
                <span className="text-[9px] text-[#f2cc4d] font-mono">Grounded on Authorized Global Stock</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isSpeaking ? (
                <button onClick={stopSpeaking} className="p-1 text-amber-400 hover:text-white" title="Mute Audio">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                </button>
              ) : (
                <button onClick={() => speakText(messages[messages.length - 1]?.text || '')} className="p-1 text-slate-300 hover:text-white" title="Vocalize response">
                  <VolumeX className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setIsChatOpen(false)} className="p-1 text-slate-300 hover:text-white" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice active ticker */}
          {isVoiceActive && (
            <div className="bg-amber-100 border-b border-amber-300 px-3 py-1.5 text-[11px] text-amber-900 flex items-center justify-between font-mono animate-pulse">
              <span>🎙 {voiceTranscript || 'Listening for bearing or part code...'}</span>
              <button onClick={toggleVoiceInput} className="text-xs font-bold text-red-700">Cancel</button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-md shadow-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#003366] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Pre-matched product badges */}
                  {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1.5">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase">Sourced Catalog Match:</span>
                      {m.suggestedProducts.map((p, pIdx) => (
                        <div key={pIdx} className="bg-slate-100 p-1.5 rounded flex justify-between items-center text-[11px]">
                          <div>
                            <strong className="text-[#003366]">{p.partNumber}</strong>
                            <span className="text-slate-500 ml-1.5">({p.brand})</span>
                          </div>
                          <span className="font-bold text-slate-900">₹{p.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1.5 font-mono ${m.sender === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </span>
                </div>

                {/* Suggestions chip shortcuts */}
                {m.suggestions && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestions.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(s)}
                        className="bg-white hover:bg-slate-100 text-[#003366] border border-[#003366]/30 text-[10px] px-2.5 py-1 rounded-full font-semibold transition shadow-2xs"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-white rounded border border-slate-200 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#003366]" />
                Searching warehouse inventory & tolerances...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex gap-2 items-center"
          >
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded ${isVoiceActive ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:text-slate-900'}`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about part numbers, equivalents, sizes..."
              className="flex-1 text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#003366] focus:bg-white"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#f2cc4d] hover:bg-[#ebd047] text-slate-900 p-2 rounded disabled:opacity-40 transition cursor-pointer"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
