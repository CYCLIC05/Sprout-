import React from 'react';
import { Asset } from '../types';
import { History, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface UsernameTrackerProps {
  asset: Asset;
  history: { date: string; price: number }[];
}

export const UsernameTracker: React.FC<UsernameTrackerProps> = ({ asset, history }) => {
  return (
    <div className="glass-card p-6 rounded-3xl space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="text-blue-500" size={20} />
            {asset.name}
          </h3>
          <p className="text-sm text-slate-400">Username Value Tracking</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-slate-900">{asset.price.toLocaleString()} TON</div>
          <div className="text-xs text-emerald-500 font-bold">+{asset.change_24h}% (24h)</div>
        </div>
      </div>

      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
            <Tooltip />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <History size={14} /> Recent Sales History
        </h4>
        <div className="space-y-2">
          {history.slice(-3).reverse().map((sale, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-slate-500">{sale.date}</span>
              <span className="font-bold text-slate-700">{sale.price} TON</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
