import React, { useState, useEffect } from 'react';
import { Asset, WatchlistItem } from './types';
import { SproutMascot } from './components/SproutMascot';
import { AssetCard } from './components/AssetCard';
import { UsernameTracker } from './components/UsernameTracker';
import { EmojiPackAnalytics } from './components/EmojiPackAnalytics';
import { MarketplaceVolume } from './components/MarketplaceVolume';
import { AIPredictions } from './components/AIPredictions';
import { WatchlistManager } from './components/WatchlistManager';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Star, 
  Search, 
  Bell,
  ArrowUpRight,
  Zap,
  BrainCircuit,
  Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MOCK_VOLUME_DATA = [
  { name: 'Mon', volume: 4000 },
  { name: 'Tue', volume: 3000 },
  { name: 'Wed', volume: 5000 },
  { name: 'Thu', volume: 2780 },
  { name: 'Fri', volume: 1890 },
  { name: 'Sat', volume: 2390 },
  { name: 'Sun', volume: 3490 },
];

const MOCK_PREDICTIONS = [
  { assetName: 'sprout.ton', prediction: 'bullish' as const, confidence: 85, reason: 'High social engagement and scarcity in the .ton namespace.' },
  { assetName: 'TON Punks', prediction: 'neutral' as const, confidence: 60, reason: 'Market consolidation phase after recent floor price spike.' },
  { assetName: 'Diamond Heart', prediction: 'bearish' as const, confidence: 45, reason: 'Oversupply in secondary markets leading to price fatigue.' },
];

import { WelcomePage } from './components/WelcomePage';
import { Onboarding } from './components/Onboarding';
import { NewsSection } from './components/NewsSection';

type Timeframe = '1D' | '7D' | '1M' | '1Y';

const generateChartData = (timeframe: Timeframe, basePrice: number) => {
  const points = timeframe === '1D' ? 24 : timeframe === '7D' ? 7 : timeframe === '1M' ? 30 : 12;
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    price: basePrice * (0.95 + Math.random() * 0.1) + (i * (basePrice * 0.001)),
  }));
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trending' | 'watchlist' | 'insights' | 'news'>('dashboard');
  const [category, setCategory] = useState<'all' | 'usernames' | 'nfts' | 'gifts' | 'stickers'>('all');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('7D');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [generatingInsight, setGeneratingInsight] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, watchlistRes] = await Promise.all([
        fetch('/api/assets'),
        fetch('/api/watchlist')
      ]);
      const assetsData = await assetsRes.json();
      const watchlistData = await watchlistRes.json();
      setAssets(assetsData);
      setWatchlist(watchlistData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async (asset: Asset) => {
    const isWatchlisted = watchlist.some(w => w.id === asset.id);
    if (isWatchlisted) {
      await fetch(`/api/watchlist/${asset.id}`, { method: 'DELETE' });
    } else {
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: asset.id, type: asset.type, name: asset.name })
      });
    }
    fetchData();
  };

  const generateInsight = async (asset: Asset) => {
    setGeneratingInsight(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this TON blockchain asset: ${asset.name} (${asset.type}). 
        Current Price: ${asset.price} TON, 24h Change: ${asset.change_24h}%, 24h Volume: ${asset.volume_24h} TON.
        Provide a short, fun, and professional market insight as Sprout the mascot. Keep it under 100 words.`
      });
      setAiInsight(response.text);
    } catch (error) {
      setAiInsight("Sprout is taking a nap! Try again later.");
    } finally {
      setGeneratingInsight(false);
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || 
                           (category === 'usernames' && a.type === 'username') ||
                           (category === 'nfts' && a.type === 'nft') ||
                           (category === 'gifts' && a.type === 'gift') ||
                           (category === 'stickers' && a.type === 'sticker');
    return matchesSearch && matchesCategory;
  });

  const [alerts, setAlerts] = useState<string[]>([]);

  const toggleAlert = (id: string) => {
    setAlerts(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <SproutMascot message="Growing your data..." />
      </div>
    );

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {(['all', 'usernames', 'nfts', 'gifts', 'stickers'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
                    ${category === cat ? 'bg-sprout-green text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex gap-4">
                  <span className="w-4">#</span>
                  <span>Asset</span>
                </div>
                <div className="flex gap-12">
                  <span>Price</span>
                  <span className="w-16 text-right">Trust</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset, index) => (
                    <div 
                      key={asset.id}
                      onClick={() => {
                        setSelectedAsset(asset);
                        generateInsight(asset);
                      }}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-500 w-4">{index + 1}</span>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
                            ${asset.type === 'username' ? 'bg-blue-500/10 text-blue-400' : 
                              asset.type === 'nft' ? 'bg-purple-500/10 text-purple-400' :
                              asset.type === 'gift' ? 'bg-pink-500/10 text-pink-400' : 'bg-green-500/10 text-green-400'}`}>
                            {asset.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-100">{asset.name}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase">{asset.type}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="font-bold text-slate-100">{asset.price.toLocaleString()} TON</div>
                          <div className={`text-[10px] font-bold ${asset.change_24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {asset.change_24h > 0 ? '+' : ''}{asset.change_24h}%
                          </div>
                        </div>
                        <div className="w-16 flex justify-end">
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-lg border border-emerald-500/20">
                            10/10
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
                      <Search size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-1">No results found</h3>
                    <p className="text-sm text-slate-500">We couldn't find any assets matching "{searchQuery}"</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-sprout-green font-bold text-sm hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'trending':
        return (
          <div className="space-y-6">
            <EmojiPackAnalytics packs={assets.filter(a => a.type === 'sticker' || a.type === 'gift')} />
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Zap className="text-yellow-500" fill="currentColor" /> Trending Now
              </h2>
              <div className="space-y-2">
                {[...assets].sort((a, b) => b.change_24h - a.change_24h).map((asset, index) => (
                  <div 
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-500 w-4">{index + 1}</span>
                      <div className="font-bold text-slate-100">{asset.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-100">{asset.price} TON</div>
                      <div className={`text-[10px] font-bold ${asset.change_24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {asset.change_24h > 0 ? '+' : ''}{asset.change_24h}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'watchlist':
        return (
          <div className="space-y-6">
            <WatchlistManager 
              watchlist={watchlist} 
              assets={assets} 
              onToggleWatchlist={toggleWatchlist}
              alerts={alerts}
              onToggleAlert={toggleAlert}
            />
          </div>
        );
      
      case 'insights':
        return (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border-sprout-green/30 bg-sprout-green/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-sprout-green rounded-2xl text-slate-900">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Sprout AI Insights</h2>
                  <p className="text-sm text-slate-400">Market analysis powered by Gemini</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed italic">
                "The TON ecosystem is blooming! I'm seeing significant growth in premium usernames as more users join Telegram. Keep an eye on the 'sprout.ton' auction!"
              </p>
            </div>
            <AIPredictions predictions={MOCK_PREDICTIONS} />
          </div>
        );

      case 'news':
        return <NewsSection />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col pb-24 bg-app-bg">
      <AnimatePresence>
        {showWelcome && (
          <WelcomePage onStart={() => {
            setShowWelcome(false);
            setShowOnboarding(true);
          }} />
        )}
        {showOnboarding && (
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-app-bg/80 backdrop-blur-md z-10 border-b border-slate-800 h-20">
        <AnimatePresence mode="wait">
          {!isSearchOpen ? (
            <motion.div 
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-sprout-green rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-slate-900 rounded-full" />
              </div>
              <h1 className="text-lg font-black text-slate-100 tracking-tight">sprout</h1>
            </motion.div>
          ) : (
            <motion.div 
              key="search"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex items-center bg-slate-800 rounded-2xl px-4 py-2 mr-4 border border-slate-700"
            >
              <Search size={18} className="text-slate-500 mr-3" />
              <input 
                autoFocus
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-100 w-full placeholder:text-slate-600 font-bold"
              />
              <button 
                onClick={() => { 
                  setIsSearchOpen(false); 
                  setSearchQuery(''); 
                }} 
                className="text-slate-500 hover:text-slate-100 ml-2 text-xl leading-none"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1">
          {!isSearchOpen && (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <Search size={20} />
            </button>
          )}
          <button className="p-2 text-slate-400 hover:text-sprout-green transition-colors">
            <div className="w-6 h-6 flex items-center justify-center">🍭</div>
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-100 transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-4">
        {renderContent()}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-6 py-4 flex items-center justify-between z-20">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all
            ${activeTab === 'dashboard' ? 'text-sprout-green' : 'text-slate-500'}`}
        >
          <LayoutDashboard size={24} />
          <div className={`w-1 h-1 rounded-full mt-1 ${activeTab === 'dashboard' ? 'bg-sprout-green' : 'bg-transparent'}`} />
        </button>
        <button 
          onClick={() => setActiveTab('trending')}
          className={`flex flex-col items-center gap-1 transition-all
            ${activeTab === 'trending' ? 'text-sprout-green' : 'text-slate-500'}`}
        >
          <TrendingUp size={24} />
          <div className={`w-1 h-1 rounded-full mt-1 ${activeTab === 'trending' ? 'bg-sprout-green' : 'bg-transparent'}`} />
        </button>
        <button 
          onClick={() => setActiveTab('news')}
          className={`flex flex-col items-center gap-1 transition-all
            ${activeTab === 'news' ? 'text-sprout-green' : 'text-slate-500'}`}
        >
          <Newspaper size={24} />
          <div className={`w-1 h-1 rounded-full mt-1 ${activeTab === 'news' ? 'bg-sprout-green' : 'bg-transparent'}`} />
        </button>
        <button 
          onClick={() => setActiveTab('watchlist')}
          className={`flex flex-col items-center gap-1 transition-all
            ${activeTab === 'watchlist' ? 'text-sprout-green' : 'text-slate-500'}`}
        >
          <Star size={24} />
          <div className={`w-1 h-1 rounded-full mt-1 ${activeTab === 'watchlist' ? 'bg-sprout-green' : 'bg-transparent'}`} />
        </button>
        <button 
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center gap-1 transition-all
            ${activeTab === 'insights' ? 'text-sprout-green' : 'text-slate-500'}`}
        >
          <BrainCircuit size={24} />
          <div className={`w-1 h-1 rounded-full mt-1 ${activeTab === 'insights' ? 'bg-sprout-green' : 'bg-transparent'}`} />
        </button>
      </nav>

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedAsset(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-slate-900 w-full max-w-md rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl border-t border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold
                      ${selectedAsset.type === 'username' ? 'bg-blue-500/10 text-blue-400' : 
                        selectedAsset.type === 'nft' ? 'bg-purple-500/10 text-purple-400' :
                        selectedAsset.type === 'gift' ? 'bg-pink-500/10 text-pink-400' : 'bg-green-500/10 text-green-400'}`}>
                      {selectedAsset.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-100">{selectedAsset.name}</h2>
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedAsset.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAsset(null)}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50">
                    <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Price</div>
                    <div className="text-xl font-bold text-slate-100">{selectedAsset.price.toLocaleString()} TON</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50">
                    <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">24h Change</div>
                    <div className={`text-xl font-bold ${selectedAsset.change_24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {selectedAsset.change_24h > 0 ? '+' : ''}{selectedAsset.change_24h}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(['1D', '7D', '1M', '1Y'] as Timeframe[]).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all
                          ${timeframe === tf ? 'bg-sprout-green text-slate-900' : 'text-slate-500 hover:text-slate-300 bg-slate-800/50'}`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price History</div>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateChartData(timeframe, selectedAsset.price)}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8CC63F" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8CC63F" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="price" stroke="#8CC63F" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderRadius: '16px', border: '1px solid #374151', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                        itemStyle={{ color: '#f3f4f6' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sprout-green/10 rounded-full flex items-center justify-center text-sprout-green">
                      <BrainCircuit size={16} />
                    </div>
                    <h3 className="font-bold text-slate-100">Sprout's Insight</h3>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl text-sm text-slate-300 leading-relaxed border border-slate-700/50">
                    {generatingInsight ? (
                      <div className="flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-sprout-green rounded-full" />
                        Thinking...
                      </div>
                    ) : (
                      aiInsight || "Sprout is analyzing the data..."
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleWatchlist(selectedAsset)}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2
                      ${watchlist.some(w => w.id === selectedAsset.id) 
                        ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    <Star size={20} fill={watchlist.some(w => w.id === selectedAsset.id) ? 'currentColor' : 'none'} />
                    {watchlist.some(w => w.id === selectedAsset.id) ? 'Watchlisted' : 'Add to Watchlist'}
                  </button>
                  <button className="flex-1 py-4 bg-sprout-green text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sprout-green/90 transition-colors">
                    View on Fragment <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
