import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, User, Lock, ShoppingBag, TrendingUp, ChevronRight } from 'lucide-react';
// --- THE KEY IMPORT ---
import StockMarket from './StockMarket'; 

const App = () => {
  const [showMarket, setShowMarket] = useState(false);
  const [coins, setCoins] = useState(150);
  const [currentStage, setCurrentStage] = useState(1); 
  const [showProfile, setShowProfile] = useState(false);

  const lessons = [
    { id: 0, title: 'The Egg', x: 100, y: 500, type: 'egg' },
    { id: 1, title: 'Basics', x: 250, y: 350, type: 'bubble' },
    { id: 2, title: 'Growth', x: 450, y: 250, type: 'lily' },
    { id: 3, title: 'Freedom', x: 650, y: 100, type: 'lily' },
  ];

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-tr from-blue-50 via-white to-pink-50">
      
      {/* --- ARTISTIC HEADER --- */}
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-pink-400 drop-shadow-sm" style={{ fontFamily: '"Arial Rounded MT Bold", sans-serif' }}>
          Chrysalis
        </h1>
        
        <div className="flex gap-3">
          <div className="flex items-center bg-white/40 backdrop-blur-md px-4 py-1 rounded-full border border-white/50 shadow-sm">
            <Coins className="text-yellow-500 mr-2 size-5" />
            <span className="font-bold text-slate-700">{coins}</span>
          </div>
          <button onClick={() => setShowProfile(true)} className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-sm">
            <User className="text-pink-400 size-5" />
          </button>
        </div>
      </header>

      {/* --- REFINED SIDE NAV --- */}
      <nav className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
        {[
          { icon: <ShoppingBag />, label: 'Shop' },
          { icon: <TrendingUp />, label: 'Stocks' }
        ].map((item) => (
          <div 
            key={item.label}
            onClick={() => {
              if (item.label === 'Stocks') setShowMarket(true);
            }}
            className="w-12 h-12 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center cursor-pointer group hover:bg-white/60 transition-all border border-white/50 shadow-sm"
          >
            <div className="text-blue-400">{item.icon}</div>
          </div>
        ))}
      </nav>

      {/* --- THE FULL-SCREEN VINE PATH --- */}
      <div className="absolute inset-0 z-0">
        <svg viewBox="0 0 800 600" className="w-full h-full" style={{ overflow: 'visible' }}>
          <motion.path
            d="M 50 550 C 150 500, 200 400, 300 350 S 500 200, 750 50"
            fill="transparent"
            stroke="#4ADE80"
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          <circle cx="150" cy="505" r="8" fill="#22C55E" />
          <circle cx="350" cy="310" r="10" fill="#22C55E" />
          <circle cx="550" cy="180" r="8" fill="#22C55E" />
        </svg>

        {lessons.map((lesson, idx) => {
          const isCompleted = idx < currentStage;
          const isActive = idx === currentStage;
          const isLocked = idx > currentStage;

          return (
            <div 
              key={lesson.id} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(lesson.x / 800) * 100}%`, top: `${(lesson.y / 600) * 100}%` }}
            >
              {idx === 0 ? (
                <div className="w-12 h-16 bg-white rounded-full border-2 border-green-100 shadow-inner rotate-[-15deg]" />
              ) : isActive ? (
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  onClick={() => setCoins(coins + 50)} // Click active node to "earn" money
                  className="w-24 h-24 rounded-full bg-blue-300/50 backdrop-blur-sm border border-white/50 flex items-center justify-center cursor-pointer font-bold text-white shadow-xl"
                >
                  {idx}
                </motion.div>
              ) : (
                <div className={`w-28 h-10 rounded-[100%] border-b-4 flex items-center justify-center
                  ${isCompleted ? 'bg-green-400 border-green-600' : 'bg-slate-300 border-slate-400 opacity-60'}`}>
                  {isLocked && <Lock className="size-4 text-slate-500" />}
                  {isCompleted && <div className="w-4 h-4 bg-green-200 rounded-full animate-pulse" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- STOCK MARKET OVERLAY --- */}
      <AnimatePresence>
        {showMarket && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100]"
          >
            <StockMarket 
              coins={coins} 
              setCoins={setCoins} 
              onClose={() => setShowMarket(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;