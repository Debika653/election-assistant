/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  UserCircle, 
  Calendar, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface WizardProps {
  onClose: () => void;
}

type Step = 'nationality' | 'age' | 'residence' | 'result';

import { useFirebase } from '../../contexts/FirebaseContext';
import { syncUserData } from '../../lib/firestoreUtils';

export default function EligibilityWizard({ onClose }: WizardProps) {
  const { user } = useFirebase();
  const [currentStep, setCurrentStep] = useState<Step>('nationality');
  const [data, setData] = useState({
    isIndian: null as boolean | null,
    isAgeEligible: null as boolean | null,
    isResident: null as boolean | null,
  });

  const nextStep = (step: Step) => {
    setCurrentStep(step);
    if (step === 'result' && user) {
      syncUserData(user.uid, { eligibility: data });
    }
  };

  const isEligible = data.isIndian === true && data.isAgeEligible === true && data.isResident === true;

  const renderStep = () => {
    switch (currentStep) {
      case 'nationality':
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-civic-navy/5 rounded-full flex items-center justify-center text-civic-navy mx-auto mb-8">
              <UserCircle className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl mb-2">Citizenship</h3>
              <p className="text-slate-500 text-sm">Are you a citizen of India?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setData({ ...data, isIndian: true }); nextStep('age'); }}
                className="civic-button-outline py-4 hover:bg-civic-navy hover:text-white transition-all flex flex-col items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Yes, I am
              </button>
              <button 
                onClick={() => { setData({ ...data, isIndian: false }); nextStep('result'); }}
                className="civic-button-outline py-4 border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500 flex flex-col items-center gap-2"
              >
                <X className="w-5 h-5" />
                No, I'm not
              </button>
            </div>
          </motion.div>
        );

      case 'age':
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-civic-navy/5 rounded-full flex items-center justify-center text-civic-navy mx-auto mb-8">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl mb-2">Requirement</h3>
              <p className="text-slate-500 text-sm">Are you 18 years old or older as of today?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setData({ ...data, isAgeEligible: true }); nextStep('residence'); }}
                className="civic-button-outline py-4 hover:bg-civic-navy hover:text-white transition-all flex flex-col items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Yes
              </button>
              <button 
                onClick={() => { setData({ ...data, isAgeEligible: false }); nextStep('result'); }}
                className="civic-button-outline py-4 border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500 flex flex-col items-center gap-2"
              >
                <X className="w-5 h-5" />
                Under 18
              </button>
            </div>
          </motion.div>
        );

      case 'residence':
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-civic-navy/5 rounded-full flex items-center justify-center text-civic-navy mx-auto mb-8">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl mb-2">Residency</h3>
              <p className="text-slate-500 text-sm">Are you an "ordinarily resident" in your current constituency?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setData({ ...data, isResident: true }); nextStep('result'); }}
                className="civic-button-outline py-4 hover:bg-civic-navy hover:text-white transition-all flex flex-col items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Yes
              </button>
              <button 
                onClick={() => { setData({ ...data, isResident: false }); nextStep('result'); }}
                className="civic-button-outline py-4 border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500 flex flex-col items-center gap-2"
              >
                <X className="w-5 h-5" />
                No
              </button>
            </div>
          </motion.div>
        );

      case 'result':
        return (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            {isEligible ? (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl mb-2">You are Eligible!</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto font-light leading-relaxed">
                    Based on your responses, you meet the primary criteria to vote in the upcoming Indian elections.
                  </p>
                </div>
                <div className="bg-civic-bg p-4 rounded-xl text-left border border-civic-navy/5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Next Steps</div>
                  <ul className="text-xs space-y-2 text-civic-navy">
                    <li className="flex gap-2">
                      <div className="w-4 h-4 rounded-full bg-civic-gold/20 flex items-center justify-center text-[10px] font-bold">1</div>
                      Verify your name on the NVSP Voter Portal
                    </li>
                    <li className="flex gap-2">
                      <div className="w-4 h-4 rounded-full bg-civic-gold/20 flex items-center justify-center text-[10px] font-bold">2</div>
                      Download your Digital Voter Slip (e-EPIC)
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <button className="civic-button-primary w-full flex items-center justify-center gap-2">
                    Official NVSP Portal <ExternalLink className="w-4 h-4" />
                  </button>
                  <button onClick={onClose} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-civic-navy">Close Checker</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl mb-2">Limited Eligibility</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto font-light leading-relaxed">
                    You may not be eligible to vote at this time. Please review the official ECI requirements for exceptions.
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-left border border-red-100">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">Reason Codes</div>
                  <div className="text-xs font-medium text-red-900 italic">
                    {!data.isIndian && "• Non-citizen status detected"}
                    {!data.isAgeEligible && "• Underage requirement (Min. 18)"}
                    {!data.isResident && "• Ordinary Residency not established"}
                  </div>
                </div>
                <button 
                  onClick={() => { setData({ isIndian: null, isAgeEligible: null, isResident: null }); setCurrentStep('nationality'); }}
                  className="civic-button-outline w-full flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Restart Logic
                </button>
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-0">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-civic-navy/40 backdrop-blur-sm"
      ></motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 relative shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <motion.div 
            className="h-full bg-civic-gold"
            animate={{ 
              width: currentStep === 'nationality' ? '25%' : 
                     currentStep === 'age' ? '50%' : 
                     currentStep === 'residence' ? '75%' : '100%' 
            }}
          ></motion.div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-civic-navy transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
