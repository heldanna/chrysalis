import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, User, Lock, ShoppingBag, TrendingUp } from 'lucide-react';
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
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-tr from-blue-50 via-white to-pink-50 font-sans">
      
      
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-pink-400 drop-shadow-sm" style={{ fontFamily: '"Arial Rounded MT Bold", sans-serif' }}>
          Chrysalis
        </h1>
        
        <div className="flex gap-3">
          <div className="flex items-center bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm">
            <Coins className="text-yellow-500 mr-2 size-5" />
            <span className="font-bold text-slate-700 text-lg">{coins}</span>
          </div>
          <button onClick={() => setShowProfile(true)} className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-sm">
            <User className="text-pink-400 size-6" />
          </button>
        </div>
      </header>

      
      <main className="h-full w-full">
        <AnimatePresence mode="wait">
          {!showMarket ? (
            
            <motion.div 
              key="vine"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full w-full relative flex items-center justify-center pt-20"
            >
              
              <nav className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
                {[{ icon: <ShoppingBag />, label: 'Shop' }, { icon: <TrendingUp />, label: 'Stocks' }].map((item) => (
                  <div 
                    key={item.label}
                    onClick={() => item.label === 'Stocks' && setShowMarket(true)}
                    className="w-14 h-14 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center cursor-pointer group hover:bg-white/80 transition-all border border-white/50 shadow-sm"
                  >
                    <div className="text-blue-400 group-hover:scale-110 transition-transform">{item.icon}</div>
                  </div>
                ))}
              </nav>

              
              <div className="absolute inset-0 z-0">
                <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <motion.path
                    d="M 50 550 C 150 500, 200 400, 300 350 S 500 200, 750 50"
                    fill="transparent" stroke="#4ADE80" strokeWidth="10" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }}
                  />
                </svg>
                {lessons.map((lesson, idx) => {
                  const isActive = idx === currentStage;
                  return (
                    <div 
                      key={lesson.id} 
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${(lesson.x / 800) * 100}%`, top: `${(lesson.y / 600) * 100}%` }}
                    >
                      {isActive ? (
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                          onClick={() => setCoins(prev => prev + 10)}
                          className="w-20 h-20 rounded-full bg-blue-400/50 backdrop-blur-md border-2 border-white flex items-center justify-center cursor-pointer font-bold text-white shadow-lg"
                        >
                          {idx}
                        </motion.div>
                      ) : (
                        <div className="w-16 h-6 bg-green-300 rounded-full opacity-50" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            
            <motion.div 
              key="market"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-white"
            >
              <StockMarket coins={coins} setCoins={setCoins} onClose={() => setShowMarket(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;