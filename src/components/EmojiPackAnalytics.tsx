import React from 'react';
import { Asset } from '../types';
import { Smile, Zap, Users } from 'lucide-react';

interface EmojiPackAnalyticsProps {
  packs: Asset[];
}

export const EmojiPackAnalytics: React.FC<EmojiPackAnalyticsProps> = ({ packs }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Smile className="text-yellow-500" size={20} />
          Emoji & Stickers
        </h3>
        <span className="text-xs font-bold text-sprout-green bg-sprout-green/10 px-2 py-1 rounded-lg">Trending</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {packs.map((pack) => (
          <div key={pack.id} className="glass-card p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-xl">
                ✨
              </div>
              <div>
                <div className="font-bold text-slate-800">{pack.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Users size={12} /> 1.2k installs today
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">{pack.price} TON</div>
              <div className="text-xs text-emerald-500 flex items-center justify-end gap-1">
                <Zap size={10} fill="currentColor" /> {pack.change_24h}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
