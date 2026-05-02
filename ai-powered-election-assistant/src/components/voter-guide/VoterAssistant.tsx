/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Minimize2, Maximize2, MessageSquare } from 'lucide-react';
import { askElectionAssistant, ChatMessage } from '../../lib/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export default function VoterAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your AI Election Assistant. How can I help you prepare for voting day? You can ask me about registration, NOTA, EVMs, or eligibility." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  const handleSend = async () => {
    if (!query.trim() || isTyping) return;

    const userMsg = query.trim();
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await askElectionAssistant(userMsg, history);
    
    setHistory(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        id="assistant-trigger"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-civic-navy text-civic-gold rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-civic-navy/95 transition-colors cursor-pointer"
      >
        <MessageSquare className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-civic-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-civic-gold"></span>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[600px] max-h-[70vh] glass-card z-50 flex flex-col overflow-hidden shadow-2xl border-civic-gold/20"
          >
            {/* Header */}
            <div className="bg-civic-navy p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-civic-gold flex items-center justify-center text-civic-navy">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Election Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-[10px] text-civic-gold-light uppercase tracking-widest font-semibold">Live Guidance</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-civic-bg"
            >
              {history.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-civic-navy text-white rounded-tr-none' 
                      : 'bg-white border border-civic-navy/10 text-civic-navy shadow-sm rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-civic-navy/10 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-civic-gold" />
                    <span className="text-xs text-slate-500 font-medium italic">Analyzing facts...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-civic-navy/10">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ask me anything about voting..."
                  className="w-full pl-4 pr-12 py-3 bg-civic-bg border border-civic-navy/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-civic-gold/50 transition-all text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="absolute right-2 top-1.5 p-2 bg-civic-navy text-white rounded-lg hover:bg-civic-navy/90 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-slate-400 font-medium">
                Powered by Gemini AI • Always verify with official EC sources
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
