/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Circle, ClipboardList, Info, Share2, Download } from 'lucide-react';
import { ChecklistItem } from '../../constants';

interface ModalProps {
  checklist: ChecklistItem[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export default function VoterChecklistModal({ checklist, onToggle, onClose }: ModalProps) {
  const categories = ['documentation', 'polling-day', 'post-vote'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-civic-navy/60 backdrop-blur-sm"
      ></motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white rounded-[2.5rem] p-6 sm:p-10 relative shadow-2xl z-[70] max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-civic-navy transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 civic-gold-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-serif">Voter Roadmap</h2>
            <p className="text-slate-500 text-sm font-light">Your step-by-step preparation for Polling Day 2026.</p>
          </div>
        </div>

        <div className="space-y-12">
          {categories.map((category) => {
            const items = checklist.filter(item => item.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-0.5 flex-1 bg-civic-gold/20"></div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-civic-gold bg-civic-gold/5 px-3 py-1 rounded-full">
                    {category.replace('-', ' ')}
                  </h4>
                  <div className="h-0.5 flex-1 bg-civic-gold/20"></div>
                </div>

                <div className="grid gap-4">
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      onClick={() => onToggle(item.id)}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                        item.completed 
                          ? 'bg-civic-navy/5 border-civic-navy/10' 
                          : 'bg-white border-slate-100 hover:border-civic-gold hover:shadow-md'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        item.completed 
                          ? 'bg-civic-navy border-civic-navy text-white' 
                          : 'border-slate-200 group-hover:border-civic-gold'
                      }`}>
                        {item.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 opacity-0" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium transition-all ${item.completed ? 'text-slate-400 line-through' : 'text-civic-navy'}`}>
                          {item.label}
                        </p>
                      </div>
                      <Info className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 civic-button-primary flex items-center justify-center gap-2 text-sm">
            <Share2 className="w-4 h-4" /> Share My Readiness
          </button>
          <button className="flex-1 civic-button-outline flex items-center justify-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Screenshot Guide
          </button>
        </div>
        
        <p className="mt-8 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-loose">
          CivicGate Roadmap • Protocol v2.4a • Secure Citizen Mode
        </p>
      </motion.div>
    </div>
  );
}
