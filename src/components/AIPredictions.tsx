import React from 'react';
import { BrainCircuit, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AIPredictionsProps {
  predictions: {
    assetName: string;
    prediction: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    reason: string;
  }[];
}

export const AIPredictions: React.FC<AIPredictionsProps> = ({ predictions }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BrainCircuit className="text-sprout-green" size={24} />
        <h3 className="text-lg font-bold text-slate-800">AI Predictions</h3>
      </div>

      <div className="space-y-3">
        {predictions.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-2xl border-l-4 border-l-sprout-green"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-bold text-slate-800">{p.assetName}</div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider
                ${p.prediction === 'bullish' ? 'bg-emerald-100 text-emerald-600' : 
                  p.prediction === 'bearish' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                {p.prediction}
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              <Sparkles size={12} className="inline mr-1 text-sprout-green" />
              {p.reason}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Confidence</div>
              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sprout-green" 
                  style={{ width: `${p.confidence}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
