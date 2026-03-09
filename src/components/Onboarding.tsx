import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to Sprout",
    description: "Your all-in-one companion for the TON ecosystem. Track usernames, NFTs, and more with ease.",
    image: "https://picsum.photos/seed/sprout-head/400/400", // Placeholder for input_file_0.png
    color: "bg-sprout-green"
  },
  {
    title: "Real-time Analytics",
    description: "Stay ahead of the market with live price tracking and volume indicators for every digital asset.",
    icon: <TrendingUp size={48} className="text-white" />,
    color: "bg-blue-500"
  },
  {
    title: "AI-Powered Insights",
    description: "Let Sprout analyze the data for you. Get predictions and summaries powered by advanced AI.",
    icon: <Sparkles size={48} className="text-white" />,
    color: "bg-purple-500"
  },
  {
    title: "Safe & Secure",
    description: "Monitor your favorite assets and set alerts without ever compromising your privacy.",
    icon: <ShieldCheck size={48} className="text-white" />,
    color: "bg-slate-900"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center space-y-8"
          >
            <div className={`w-48 h-48 rounded-[40px] ${steps[currentStep].color} flex items-center justify-center shadow-2xl shadow-current/20 overflow-hidden`}>
              {steps[currentStep].image ? (
                <img 
                  src={steps[currentStep].image} 
                  alt="Mascot" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                steps[currentStep].icon
              )}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                {steps[currentStep].title}
              </h1>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                {steps[currentStep].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`} 
            />
          ))}
        </div>
      </div>

      <div className="p-8">
        <button
          onClick={next}
          className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
        >
          {currentStep === steps.length - 1 ? (
            <>Get Started <Check size={20} /></>
          ) : (
            <>Next <ArrowRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
};
