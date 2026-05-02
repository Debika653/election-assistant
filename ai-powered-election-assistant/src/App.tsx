/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Vote, 
  MapPin, 
  ChevronRight, 
  Flag, 
  Info,
  Calendar,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import VoterAssistant from './components/voter-guide/VoterAssistant';
import EligibilityWizard from './components/voter-guide/EligibilityWizard';
import VoterChecklistModal from './components/voter-guide/VoterChecklistModal';
import { INITIAL_CHECKLIST } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useFirebase } from './contexts/FirebaseContext';
import { syncUserData, subscribeToUserData } from './lib/firestoreUtils';
import { useEffect } from 'react';

export default function App() {
  const { user, login, logout, loading: authLoading } = useFirebase();
  const [checklist, setChecklist] = useLocalStorage('civic-checklist', INITIAL_CHECKLIST);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  // Sync with Firestore when logged in
  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToUserData(user.uid, (data) => {
        if (data?.checklist) {
          setChecklist(data.checklist);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const toggleCheck = (id: string) => {
    const nextChecklist = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(nextChecklist);
    
    if (user) {
      syncUserData(user.uid, { checklist: nextChecklist });
    }
  };

  const completedCount = checklist.filter(i => i.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnimatePresence>
        {isWizardOpen && (
          <EligibilityWizard onClose={() => setIsWizardOpen(false)} />
        )}
        {isRoadmapOpen && (
          <VoterChecklistModal 
            checklist={checklist} 
            onToggle={toggleCheck} 
            onClose={() => setIsRoadmapOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Editorial Navigation */}
      <nav className="h-20 border-b border-civic-navy/5 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-civic-navy rounded-xl flex items-center justify-center text-civic-gold">
            <Vote className="w-6 h-6" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">CivicGate</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase text-civic-navy/70">
          <a href="#guide" className="hover:text-civic-gold transition-colors">Voter Guide</a>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="hover:text-civic-gold transition-colors cursor-pointer"
          >
            Eligibility Checker
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 normal-case">Logged in as</span>
                <span className="text-civic-navy lowercase font-bold">{user.email?.split('@')[0]}</span>
              </div>
              <button 
                onClick={logout}
                className="civic-button-outline px-4 py-2 text-[10px] border-slate-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="civic-button-primary px-5 py-2.5 text-xs flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Secure Login
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-civic-gold/10 rounded-full border border-civic-gold/20 mb-6 font-mono text-[10px] font-bold text-civic-gold uppercase tracking-[0.2em]">
                <span className="w-2 h-2 rounded-full bg-civic-gold animate-pulse"></span>
                Elections 2026 • Live Handbook
              </div>
              <h1 className="text-6xl md:text-8xl mb-8 leading-[0.9] text-civic-navy tracking-tighter">
                Your Voice. <br />
                <span className="italic font-normal text-civic-gold">Simplified.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-light">
                Empowering every citizen with AI-driven insights, eligibility verification, 
                and a clear path to the polling station.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsWizardOpen(true)}
                  className="civic-button-primary flex items-center justify-center gap-2 group"
                >
                  Start Resident Guide <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setIsRoadmapOpen(true)}
                  className="civic-button-outline"
                >
                  Voter Roadmap
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-civic-gold/10 rounded-[3rem] -rotate-3 scale-105 blur-3xl"></div>
              <div className="glass-card p-2 relative overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/civic-hero/800/600?grayscale" 
                  alt="Democracy Representation" 
                  className="rounded-[2rem] w-full object-cover shadow-2xl transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur shadow-sm border border-civic-navy/5 rounded-full text-[10px] font-bold tracking-widest uppercase text-civic-navy">
                  Editorial Exclusive
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-civic-navy/5 animate-float">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trust Score</div>
                    <div className="text-sm font-bold text-civic-navy">99.9% Official Data</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Action Center - Grid */}
        <section id="guide" className="px-6 py-20 bg-white border-y border-civic-navy/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-4xl mb-4">The Citizen's Interactive Guide</h2>
                <p className="text-slate-500 font-light leading-relaxed">Everything you need to navigate the democratic process with zero friction and total transparency.</p>
              </div>
              <div className="flex bg-civic-bg p-1 rounded-xl border border-civic-navy/5 font-mono text-[10px] items-center">
                <button className="px-5 py-2 bg-white rounded-lg shadow-sm font-bold uppercase tracking-widest">Essential</button>
                <button className="px-5 py-2 rounded-lg font-bold uppercase tracking-widest text-slate-400 hover:text-civic-navy">Advanced</button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Eligibility Checker */}
              <motion.div 
                whileHover={{ y: -8 }} 
                className="glass-card p-8 flex flex-col hover:border-civic-gold/50 transition-colors group"
              >
                <div className="w-14 h-14 bg-civic-navy/5 rounded-2xl flex items-center justify-center text-civic-navy mb-6 group-hover:bg-civic-navy group-hover:text-white transition-colors">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl mb-4">Eligibility Engine</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-light">
                  A high-stakes diagnostic tool to confirm your voting rights based on ECI criterion. 
                  Checks residency, age requirements, and citizenship.
                </p>
                <button 
                  onClick={() => setIsWizardOpen(true)}
                  className="mt-auto flex items-center gap-2 text-civic-navy font-bold text-sm tracking-tight hover:text-civic-gold transition-colors group/btn"
                >
                  Verify Now <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Feature 2: Tasklist */}
              <motion.div 
                whileHover={{ y: -8 }} 
                className="glass-card p-8 flex flex-col border-civic-navy/10 relative overflow-hidden"
              >
                <div className="w-14 h-14 civic-gold-gradient rounded-2xl flex items-center justify-center text-white mb-6">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-2xl mb-4">Action Roadmap</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed font-light">
                  Stay organized with your personalized preparation path. Every checkmark is recorded for your session.
                </p>
                
                {/* Progress Visual */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Readiness</span>
                  <span className="text-[10px] font-bold text-civic-navy">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-civic-gold"
                  ></motion.div>
                </div>

                <div className="space-y-3 mb-6">
                  {checklist.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleCheck(item.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          item.completed ? 'bg-civic-navy border-civic-navy' : 'bg-transparent border-slate-300 hover:border-civic-gold'
                        }`}
                      >
                        {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <span className={`text-xs transition-all ${item.completed ? 'text-slate-400 line-through' : 'text-civic-navy font-medium'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setIsRoadmapOpen(true)}
                  className="mt-auto flex items-center gap-2 text-civic-navy font-bold text-sm tracking-tight hover:text-civic-gold transition-colors group/btn"
                >
                  Manage Checklist <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Feature 3: FAQ / AI */}
              <motion.div 
                whileHover={{ y: -8 }} 
                className="glass-card p-8 flex flex-col bg-civic-navy text-white hover:shadow-xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-civic-gold/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-civic-gold mb-6">
                  <Info className="w-8 h-8" />
                </div>
                <h3 className="text-2xl mb-4 text-civic-gold font-serif italic">Digital Civic Library</h3>
                <p className="text-white/70 text-sm mb-8 leading-relaxed font-light">
                  Explore electoral terminology: What is NOTA? How does the EVM work? Get expert, non-partisan context instantly.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 relative z-10">
                  {['NOTA', 'EVM', 'VVPAT', 'ID Proofs'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-widest lowercase border border-white/5 hover:bg-civic-gold/20 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Polling Statistics / Trust Bar */}
        <section className="px-6 py-12 bg-civic-navy text-white overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-12 opacity-80">
            <div className="flex flex-col">
              <span className="text-3xl font-serif text-civic-gold">100k+</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">Citizens Guided</span>
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif text-civic-gold">100%</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">Neutral Information</span>
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif text-civic-gold">Real-time</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">ECI Regulation Updates</span>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-civic-navy/5 bg-civic-bg px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-civic-navy rounded-lg flex items-center justify-center text-civic-gold">
              <Vote className="w-4 h-4" />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight">CivicGate</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            &copy; 2026 CivicGate Foundation • Secure Civic Tech Pro
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-civic-navy transition-colors"><Calendar className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-civic-navy transition-colors"><MapPin className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-civic-navy transition-colors"><Flag className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>

      {/* AI Assistant Overlay */}
      <VoterAssistant />
    </div>
  );
}
