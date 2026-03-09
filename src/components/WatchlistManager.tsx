import React from 'react';
import { Asset, WatchlistItem } from '../types';
import { Star, Bell, BellOff, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WatchlistManagerProps {
  watchlist: WatchlistItem[];
  assets: Asset[];
  alerts: string[];
  onToggleWatchlist: (asset: Asset) => void;
  onToggleAlert: (id: string) => void;
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({ watchlist, assets, alerts, onToggleWatchlist, onToggleAlert }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Star className="text-yellow-500" size={20} fill="currentColor" />
          Watchlist & Alerts
        </h3>
      </div>

      <AnimatePresence mode="popLayout">
        {watchlist.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm italic">
            No assets in your watchlist yet.
          </div>
        ) : (
          <div className="space-y-3">
            {watchlist.map((item) => {
              const asset = assets.find(a => a.id === item.id);
              if (!asset) return null;
              const hasAlert = alerts.includes(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-4 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600">
                      {asset.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{asset.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{asset.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleAlert(item.id)}
                      className={`p-2 rounded-xl transition-colors ${hasAlert ? 'bg-sprout-green text-white shadow-lg shadow-sprout-green/20' : 'bg-slate-50 text-slate-400 hover:text-sprout-green'}`}
                    >
                      {hasAlert ? <Bell size={18} fill="currentColor" /> : <BellOff size={18} />}
                    </button>
                    <button
                      onClick={() => onToggleWatchlist(asset)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
