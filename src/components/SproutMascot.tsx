import React from 'react';
import { motion } from 'motion/react';

export const SproutMascot: React.FC<{ message?: string; className?: string }> = ({ message, className }) => {
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
