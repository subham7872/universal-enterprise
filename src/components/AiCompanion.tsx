import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, PhoneCall, Send, Bot, X, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';
import { ChatMessage, Product } from '../types';

interface AiCompanionProps {
  onSuggestSelect: (partNumber: string) => void;
  productsDatabaseSample: Product[];
}

export default function AiCompanion({ onSuggestSelect, productsDatabaseSample }: AiCompanionProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Welcome to Universal Sourcing Assistant! I am grounded on our global NTN, NSK, THK, and SKF inventory. What part number or brand can I check or quote for you today?',
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

  // References and APIs
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-IN'; // set English India/Global
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsVoiceActive(true);
          setVoiceTranscript('Listening for bearing name or part code...');
        };

        recognition.onerror = (e: any) => {
          console.error('Speech recognition error:', e);
          setIsVoiceActive(false);
        };

        recognition.onend = () => {
          setIsVoiceActive(false);
        };

        recognition.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setVoiceTranscript(resultText);
          handleVoiceSearchSubmit(resultText);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Speak response out loud using Web Speech API Synthesis
  const speakText = (text: string) => {
    if (!synthesisRef.current) return;
    
    // Stop preceding voice
    synthesisRef.current.cancel();

    // Clean text of symbols / markdown for tidy audio
    const cleanText = text.replace(/[*#_₹-]/g, ' ').replace(/\s+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      const data = await res.json();
      if (res.ok) {
        const botMsg: ChatMessage = {
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedProducts: data.preMatchedProducts || []
        };
        
        setMessages((prev) => [...prev, botMsg]);

        // Synthesize voice aloud for engaging call agent feel!
        speakText(data.text);
      } else {
        throw new Error(data.error || 'Server error.');
      }
    } catch (err: any) {
      console.error('Chat Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Apologies, my satellite sourcing connection is busy right now. Please reach Chennai Sourcing Team directly +91 44 6686 7700 or sales@ntnbearing.in.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearchSubmit = (spokenText: string) => {
    if (spokenText) {
      handleSendMessage(`Voice Search input: "${spokenText}"`);
    }
  };

  const triggerVoiceInput = () => {
    if (!voiceSupported) {
      alert('Speech Recognition is not supported or permitted in this iframe context. Try using text chat!');
      return;
    }
    
    if (isVoiceActive) {
      recognitionRef.current?.stop();
    } else {
      // cancel speech synthesis first to avoid microphone loops
      synthesisRef.current?.cancel();
      setIsSpeaking(false);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // try and force reset
        recognitionRef.current?.stop();
        setTimeout(() => recognitionRef.current?.start(), 100);
      }
    }
  };

  const toggleVoiceMute = () => {
    if (isSpeaking) {
      synthesisRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* 3 FLOATING ACTION BUTTONS ON RIGHT SCREEN EDGE WITH PULSING AND SHADOWS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3.5 items-end">
        
        {/* WhatsApp Float */}
        <a
          href="https://api.whatsapp.com/send?phone=+914466867700&text=Hello%20Universal%20Enterprise,%20I%20would%20like%20to%20request%20bearing%20quotations."
          target="_blank"
          rel="noreferrer"
          className="group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Direct WhatsApp Support"
        >
          {/* Pulsing ring */}
          <span className="absolute inset-x-0 inset-y-0 rounded-full bg-green-400 opacity-50 animate-ping group-hover:block hidden"></span>
          <svg className="w-5 h-5 sm:w-6.5 sm:h-6.5 fill-white" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.371a9.936 9.936 0 004.777 1.22h.005c5.505 0 9.989-4.478 9.99-9.984A9.945 9.945 0 0012.012 2zm5.77 14.316c-.242.682-1.383 1.328-1.921 1.393-.538.065-1.127.345-3.344-.572-2.73-1.129-4.502-3.896-4.639-4.08-.135-.181-1.1-1.464-1.1-2.793 0-1.33.682-1.983.924-2.242.242-.257.538-.323.717-.323.18 0 .359.002.516.01.164.008.384-.061.602.464.242.585.83 2.02.902 2.167.073.149.121.323.02.515-.1.196-.149.323-.298.496-.149.18-.313.4-.447.536-.15.152-.307.317-.133.619.173.3.771 1.272 1.657 2.059.1.09.2.18.3.27 1.135.975 2.19 1.274 2.505 1.41.314.135.511.11.701-.11.19-.222.812-.942 1.03-1.264.218-.323.44-.27.734-.161.295.111 1.868.88 2.187 1.04.319.162.532.242.612.378.08.136.08.788-.162 1.47z"/>
          </svg>
          <span className="absolute right-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded tracking-wide font-bold hidden sm:group-hover:block transition whitespace-nowrap uppercase">
            WhatsApp Desk
          </span>
        </a>

        {/* AI Voice Agent Ring */}
        <button
          onClick={triggerVoiceInput}
          className={`group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 ${isVoiceActive ? 'bg-red-600 animate-pulse' : 'bg-amber-500 hover:bg-amber-600'} text-slate-950 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer`}
          title="Direct AI Voice Search Sourcing"
        >
          {/* Always spin glow ring to show voice ability */}
          <span className={`absolute inset-x-0 inset-y-0 rounded-full border-2 ${isVoiceActive ? 'border-red-500' : 'border-amber-400'} animate-ping opacity-60`}></span>
          {isVoiceActive ? (
            <MicOff className="w-5 h-5 sm:w-6 h-6 text-white" />
          ) : (
            <PhoneCall className="w-5 h-5 sm:w-6 h-6 text-slate-950" />
          )}
          <span className="absolute right-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded tracking-wide font-bold hidden sm:group-hover:block transition whitespace-nowrap uppercase">
            AI Voice Search Call
          </span>
        </button>

        {/* Primary AI Chatbot trigger */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="group relative flex items-center justify-center w-13 h-13 sm:w-15 sm:h-15 bg-gradient-to-tr from-[#003366] to-[#0A84FF] hover:from-[#002244] hover:to-[#0056b3] text-white rounded-full shadow-3xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
          title="Open Universal AI Sourcing Engine"
        >
          <span className="absolute -top-1 -right-0.5 bg-[#f2cc4d] w-3.5 h-3.5 rounded-full border-2 border-white animate-bounce"></span>
          <Bot className="w-7.5 h-7.5 text-white animate-spin-slow" />
          <span className="absolute right-16 bg-slate-900 text-white text-[10px] px-2 py-1 rounded tracking-wide font-bold hidden sm:group-hover:block transition whitespace-nowrap uppercase">
            Ask AI Chatbot
          </span>
        </button>
      </div>

      {/* VOICE FLOATING LIVE NOTIF PANEL */}
      {isVoiceActive && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white p-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 border-2 border-red-500 w-80 max-w-sm">
          <div className="relative">
            <div className="w-4 h-4 bg-red-600 rounded-full shrink-0 animate-ping"></div>
            <Mic className="w-4 h-4 text-red-500 absolute top-0 left-0" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-amber-400 tracking-wider">Hearing Voice Query...</p>
            <p className="text-[11px] text-slate-300 font-mono italic truncate">{voiceTranscript || "Listening..."}</p>
          </div>
          <button onClick={() => recognitionRef.current?.stop()} className="text-slate-400 hover:text-white ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* INTERACTIVE COMPANION CHAT SLIDE OUT DRAWER */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 max-w-full pl-10 flex z-50">
          <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl border-l-4 border-amber-400 flex flex-col h-full text-slate-800">
            
            {/* Drawer Header */}
            <div className="bg-[#003366] text-white py-5 px-4 sm:px-6 border-b-4 border-amber-400 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-400 hover:bg-amber-500 p-1.5 rounded-lg text-slate-950">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-tight flex items-center gap-1">
                    Grounded AI Assistant
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </h3>
                  <p className="text-[10px] text-slate-300 font-mono">Model: gemini-3.5-flash</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <button 
                    onClick={toggleVoiceMute}
                    className="p-1 px-2 text-[10px] rounded bg-red-800 hover:bg-red-900 font-bold transition text-white flex items-center gap-1 shrink-0"
                    title="Mute spoken response"
                  >
                    <Volume2 className="w-3 h-3 text-white" />
                    Speaking
                  </button>
                )}
                <button onClick={() => setIsChatOpen(false)} className="rounded p-1 text-slate-200 hover:text-white hover:bg-slate-800 cursor-pointer">
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg p-3 max-w-[85%] text-xs shadow-xs relative ${
                    m.sender === 'user' 
                      ? 'bg-[#003366] text-white rounded-tr-none' 
                      : 'bg-white border rounded-tl-none border-slate-200'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    
                    {/* Timestamp */}
                    <span className="block mt-1 text-[9px] text-slate-400 text-right uppercase">
                      {m.timestamp}
                    </span>

                    {/* Pre-matched Products direct search recommendation results */}
                    {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                        <span className="block text-[9px] font-black uppercase text-slate-400">Inventory matched details</span>
                        {m.suggestedProducts.map((p) => (
                          <div key={p.id} className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-800 flex justify-between items-center">
                            <div>
                              <strong className="block text-[11px] text-[#003366]">{p.partNumber}</strong>
                              <span className="text-[10px] text-slate-500">{p.brand} | {p.category}</span>
                            </div>
                            <button
                              onClick={() => {
                                onSuggestSelect(p.partNumber);
                                setIsChatOpen(false);
                              }}
                              className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded transition shrink-0 ml-1 cursor-pointer"
                            >
                              Show spec Table
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Default fast option suggestions */}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {m.suggestions.map((s, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(s)}
                            className="bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded border border-slate-200 transition text-left shrink-0 cursor-pointer"
                          >
                            💡 {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                    <span className="text-slate-400">Sourcing direct from warehouse log...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input submission box */}
            <div className="p-3 border-t bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex gap-2"
              >
                <button
                  type="button"
                  onClick={triggerVoiceInput}
                  className={`p-2.5 rounded border transition cursor-pointer flex items-center justify-center shrink-0 ${isVoiceActive ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  title="Search by voice"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask stock, replacement equivalents, address..."
                  className="flex-1 text-xs px-3 py-2 border rounded focus:ring-1 focus:ring-[#003366] focus:border-[#003366] bg-slate-50 text-slate-800"
                />
                <button
                  type="submit"
                  className="bg-[#003366] hover:bg-[#0056b3] text-white p-2.5 rounded transition flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
