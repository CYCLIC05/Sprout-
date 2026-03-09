import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

interface MarketplaceVolumeProps {
  data: { name: string; volume: number }[];
}

export const MarketplaceVolume: React.FC<MarketplaceVolumeProps> = ({ data }) => {
  return (
    <div className="glass-card p-6 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-rose-500" size={20} />
          Marketplace Volume
        </h3>
        <div className="text-xs font-bold text-slate-400">Last 7 Days</div>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" hide />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="volume" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Volume</div>
          <div className="text-lg font-bold text-slate-900">12.5M TON</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Active Traders</div>
          <div className="text-lg font-bold text-slate-900">45.2k</div>
        </div>
      </div>
    </div>
  );
};
