import React from 'react';
import { motion } from 'motion/react';

interface WelcomePageProps {
  onStart: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-sprout-green z-[110] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sprout-dark/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 space-y-12"
      >
        <div className="relative">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-64 h-64 bg-yellow-300 rounded-full flex items-center justify-center shadow-2xl border-8 border-white/20"
          >
            {/* Using a placeholder for the head image provided by user */}
            <img 
              src="https://picsum.photos/seed/sprout-head-welcome/300/300" 
              alt="Sprout Mascot" 
              className="w-48 h-48 object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl"
          >
            <span className="text-2xl">🌱</span>
          </motion.div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tighter">
            SPROUT
          </h1>
          <p className="text-sprout-dark/80 font-bold text-lg max-w-xs mx-auto leading-tight">
            GROW YOUR DIGITAL ASSETS ON TON
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="bg-white text-sprout-green px-12 py-5 rounded-[32px] font-black text-xl shadow-2xl shadow-black/10 flex items-center gap-3 mx-auto"
        >
          ENTER APP
        </motion.button>
      </motion.div>

      <div className="absolute bottom-8 text-white/40 font-bold text-xs tracking-widest uppercase">
        Powered by TON Blockchain
      </div>
    </div>
  );
};
