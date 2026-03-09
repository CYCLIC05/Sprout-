import React from 'react';
import { Asset } from '../types';
import { TrendingUp, TrendingDown, Star, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface AssetCardProps {
  asset: Asset;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (asset: Asset) => void;
  onClick?: (asset: Asset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, isWatchlisted, onToggleWatchlist, onClick }) => {
  const isPositive = asset.change_24h >= 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-4 rounded-2xl flex items-center justify-between group cursor-pointer"
      onClick={() => onClick?.(asset)}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
          ${asset.type === 'username' ? 'bg-blue-100 text-blue-600' : 
            asset.type === 'nft' ? 'bg-purple-100 text-purple-600' :
            asset.type === 'gift' ? 'bg-pink-100 text-pink-600' : 'bg-green-100 text-green-600'}`}>
          {asset.name[0].toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{asset.name}</h3>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{asset.type}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="font-bold text-slate-900">{asset.price.toLocaleString()} TON</div>
          <div className={`text-xs font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(asset.change_24h)}%
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist?.(asset);
          }}
          className={`p-2 rounded-full transition-colors ${isWatchlisted ? 'text-yellow-500 bg-yellow-50' : 'text-slate-300 hover:bg-slate-100'}`}
        >
          <Star size={20} fill={isWatchlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
    </motion.div>
  );
};
