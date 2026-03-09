import React from 'react';
import { motion } from 'motion/react';

export const SproutMascot: React.FC<{ message?: React.ReactNode; className?: string; variant?: 'default' | 'alert' }> = ({ message, className, variant = 'default' }) => {
  if (variant === 'alert') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`bg-slate-800/80 backdrop-blur-xl border border-sprout-green/30 p-4 rounded-[32px] flex items-center gap-4 shadow-2xl shadow-sprout-green/10 ${className}`}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-14 h-14 bg-sprout-green rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-sprout-green/20"
        >
          🌱
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-sprout-green uppercase tracking-[0.2em]">Sprout spotted something!</span>
            <div className="h-1 w-1 bg-sprout-green rounded-full animate-pulse" />
          </div>
          <p className="text-sm text-slate-200 font-medium leading-tight">
            {message}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-24 h-24"
      >
        {/* Using the full-body mascot sticker image provided by user */}
        <img 
          src="https://picsum.photos/seed/sprout-full/200/200" 
          alt="Sprout Mascot" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-sprout-green/20 relative"
        >
          <p className="text-sm font-medium text-slate-700">{message}</p>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white" />
        </motion.div>
      )}
    </div>
  );
};
