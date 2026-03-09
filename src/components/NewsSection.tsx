import React, { useState } from 'react';
import { Newspaper, BookOpen, Microscope, ArrowUpRight, Clock, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsItem {
  id: string;
  category: 'news' | 'learn' | 'research';
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    category: 'news',
    title: 'TON Blockchain Surpasses 100M Unique Wallets',
    excerpt: 'The Open Network continues its rapid expansion as Telegram integration drives massive user adoption...',
    author: 'Sprout Team',
    date: '2 hours ago',
    readTime: '3 min',
    image: 'https://picsum.photos/seed/ton-news/400/200'
  },
  {
    id: '2',
    category: 'learn',
    title: 'Understanding TON Usernames: A Guide',
    excerpt: 'Learn how the Fragment marketplace works and why some usernames are worth thousands of TON...',
    author: 'EduSprout',
    date: '1 day ago',
    readTime: '5 min',
    image: 'https://picsum.photos/seed/ton-learn/400/200'
  },
  {
    id: '3',
    category: 'research',
    title: 'Q1 2026 NFT Market Report: TON Ecosystem',
    excerpt: 'An in-depth analysis of NFT volume, floor prices, and emerging collections on the TON blockchain...',
    author: 'Sprout Research',
    date: '3 days ago',
    readTime: '12 min',
    image: 'https://picsum.photos/seed/ton-research/400/200'
  },
  {
    id: '4',
    category: 'news',
    title: 'New Telegram Gifts Feature Launches',
    excerpt: 'Telegram introduces limited edition digital gifts that can be converted to TON-based NFTs...',
    author: 'Tech News',
    date: '5 hours ago',
    readTime: '2 min',
    image: 'https://picsum.photos/seed/ton-gifts/400/200'
  }
];

export const NewsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'news' | 'learn' | 'research'>('all');

  const filteredNews = filter === 'all' ? MOCK_NEWS : MOCK_NEWS.filter(item => item.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Sprout Hub</h2>
        <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
          {(['all', 'news', 'learn', 'research'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${filter === f ? 'bg-slate-700 text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNews.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer border-slate-800 bg-slate-800/30"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg
                    ${item.category === 'news' ? 'bg-blue-500' : 
                      item.category === 'learn' ? 'bg-emerald-500' : 'bg-purple-500'}`}>
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Clock size={12} /> {item.date}</span>
                  <span className="flex items-center gap-1"><BookOpen size={12} /> {item.readTime} read</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-100 leading-tight group-hover:text-sprout-green transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-slate-400 line-clamp-2">
                  {item.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-500">By {item.author}</span>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-500 hover:text-sprout-green transition-colors">
                      <Bookmark size={18} />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-100 transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
