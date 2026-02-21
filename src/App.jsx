import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, User, Lock, ShoppingBag, TrendingUp, Target, BarChart3 } from 'lucide-react';

const App = () => {
  const [coins, setCoins] = useState(150);
  const [currentStage, setCurrentStage] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [avatarColor, setAvatarColor] = useState('bg-soft-blue');

  const lessons = [
    { id: 0, type: 'egg', title: 'The Seed' },
    { id: 1, type: 'bubble', title: 'Financial Flow' },
    { id: 2, type: 'lilypad', title: 'Smart Growth' },
    { id: 3, type: 'lilypad', title: 'Future Flight' },
    { id: 4, type: 'butterfly', title: 'Independence' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-50 glass-bubble rounded-b-3xl">
        <h1 className="text-3xl font-black italic bg-gradient-to-r from-soft-blue to-petal-pink bg-clip-text text-transparent">
          CHRYSALIS
        </h1>
        
        <div className="flex gap-4">
          <div className="flex items-center bg-white/50 px-4 py-2 rounded-full border border-white/60">
            <Coins className="text-yellow-500 mr-2 animate-pulse" />
            <span className="font-bold">{coins}</span>
          </div>
          <button onClick={() => setShowProfile(true)} className="w-12 h-12 rounded-full glass-bubble flex items-center justify-center hover:scale-110 transition-transform">
            <User className="text-petal-pink" />
          </button>
        </div>
      </header>

      {/* --- STUDENT SIDEBAR (From Sketch) --- */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40">
        {[
          { icon: <ShoppingBag />, label: 'Shop' },
          { icon: <TrendingUp />, label: 'Stocks' },
          { icon: <Target />, label: 'Goals' },
          { icon: <BarChart3 />, label: 'Stats' }
        ].map((item) => (
          <div key={item.label} className="w-14 h-14 glass-bubble rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/40 group relative">
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.label}
            </span>
            <div className="text-soft-blue">{item.icon}</div>
          </div>
        ))}
      </nav>

      {/* --- MAIN PATH (The Vine) --- */}
      <main className="pt-32 flex justify-center pb-20">
        <svg width="600" height="1000" viewBox="0 0 600 1000" className="absolute top-32 pointer-events-none opacity-40">
          <path d="M 300 50 C 500 150, 500 350, 300 450 S 100 750, 300 850" fill="transparent" stroke="#60A5FA" strokeWidth="8" strokeDasharray="15 10" />
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-48">
          {lessons.map((lesson, idx) => (
            <div key={lesson.id}>
              {lesson.type === 'egg' && (
                <div className="w-20 h-24 bg-white rounded-full border-4 border-blue-100 shadow-inner flex items-center justify-center" />
              )}

              {lesson.type === 'bubble' && (
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="w-32 h-32 glass-bubble rounded-full flex items-center justify-center cursor-pointer">
                  <span className="font-bold text-soft-blue">Lesson {idx}</span>
                </motion.div>
              )}

              {lesson.type === 'lilypad' && (
                <div className="w-36 h-12 bg-slate-400/20 rounded-full flex items-center justify-center border-b-4 border-slate-500/30">
                  <Lock className="w-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* --- AVATAR MODAL --- */}
      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-900/20 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white/90 p-8 rounded-[40px] shadow-2xl max-w-sm w-full relative">
              <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 text-slate-400">✕</button>
              <h2 className="text-2xl font-black text-center mb-6">Evolution</h2>
              <div className="flex justify-center mb-8">
                <div className={`w-32 h-32 rounded-full ${avatarColor} flex items-center justify-center shadow-inner`}>
                  {currentStage < 4 ? <div className="w-12 h-12 bg-white/40 rounded-full animate-pulse" /> : '🦋'}
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => setAvatarColor('bg-soft-blue')} className="w-8 h-8 rounded-full bg-soft-blue border-2 border-white" />
                <button onClick={() => setAvatarColor('bg-coral-red')} className="w-8 h-8 rounded-full bg-coral-red border-2 border-white" />
                <button onClick={() => setAvatarColor('bg-petal-pink')} className="w-8 h-8 rounded-full bg-petal-pink border-2 border-white" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;