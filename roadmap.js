import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Lock, Coins, User, Palette, ChevronRight } from 'lucide-react';

const ChrysalisApp = () => {
  const [coins, setCoins] = useState(120);
  const [currentStage, setCurrentStage] = useState(1); // 0: Egg, 1: Bubble, 2+: Lilypads
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarColor, setAvatarColor] = useState('bg-coral-red'); // Custom color state

  // Lesson Data
  const lessons = [
    { id: 0, type: 'egg', title: 'The Beginning' },
    { id: 1, type: 'bubble', title: 'Current Flow' },
    { id: 2, type: 'lilypad', title: 'Deep Dive' },
    { id: 3, type: 'lilypad', title: 'Rising Up' },
    { id: 4, type: 'butterfly', title: 'Financial Flight' },
  ];

  const theme = {
    blue: '#60A5FA',
    coral: '#F87171',
    pink: '#F472B6',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-blue-100 text-slate-800 font-sans overflow-hidden relative">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-md bg-white/30 border-b border-white/20">
        <h1 className="text-3xl font-black tracking-tighter italic bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
          CHRYSALIS
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/60 px-4 py-2 rounded-full shadow-inner border border-white/40">
            <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 3 }}>
              <Coins className="text-yellow-500 mr-2" />
            </motion.div>
            <span className="font-bold text-slate-700">{coins}</span>
          </div>
          <button 
            onClick={() => setShowAvatarModal(true)}
            className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white/50 flex items-center justify-center transition-transform hover:scale-110"
          >
             <User className="text-pink-500" />
          </button>
        </div>
      </header>

      {/* --- SIDE NAVIGATION --- */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40">
        {['Shop', 'Stocks', 'Goals', 'Stats'].map((item) => (
          <motion.div 
            key={item}
            whileHover={{ x: 10 }}
            className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg flex items-center justify-center cursor-pointer group hover:bg-coral-red/20"
          >
            <div className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute -right-12 bg-slate-800 text-white px-2 py-1 rounded">
              {item}
            </div>
            <div className="w-6 h-6 bg-blue-400 rounded-md opacity-70" />
          </motion.div>
        ))}
      </nav>

      {/* --- THE WINDING VINE PATH --- */}
      <main className="relative flex justify-center items-start pt-32 pb-20">
        <svg width="600" height="1200" viewBox="0 0 600 1200" className="absolute top-32 pointer-events-none">
          {/* The Vine */}
          <motion.path
            d="M 300 50 C 500 150, 500 350, 300 450 S 100 750, 300 850 S 500 1050, 300 1150"
            fill="transparent"
            stroke="url(#vineGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          <defs>
            <linearGradient id="vineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-64 w-full">
          {lessons.map((lesson, idx) => (
            <div key={lesson.id} className="relative">
              {/* Node Rendering Logic */}
              {lesson.type === 'egg' && (
                <div className="w-24 h-32 bg-white rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-xl border-4 border-blue-200 flex items-center justify-center rotate-[-10deg]">
                   <span className="text-xs font-bold text-blue-400">STAGE 1</span>
                </div>
              )}

              {lesson.type === 'bubble' && (
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-white/40 to-blue-200/50 backdrop-blur-md border border-white/80 shadow-[0_0_40px_rgba(255,255,255,0.8)] flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-2 border-2 border-white/30 rounded-full animate-pulse" />
                  <span className="font-black text-blue-600">LESSON</span>
                </motion.div>
              )}

              {lesson.type === 'lilypad' && (
                <div className={`w-32 h-12 bg-slate-300/40 rounded-[100%] border-b-4 border-slate-400/50 relative ${idx > currentStage ? 'grayscale' : ''}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="text-slate-500 w-4" />
                  </div>
                </div>
              )}

              {lesson.type === 'butterfly' && (
                <div className="w-40 h-40 flex items-center justify-center opacity-50 grayscale">
                   <div className="w-10 h-20 bg-pink-400 rounded-full relative">
                      <div className="absolute -left-10 w-12 h-20 bg-pink-300 rounded-l-full rotate-[-20deg]" />
                      <div className="absolute -right-10 w-12 h-20 bg-pink-300 rounded-r-full rotate-[20deg]" />
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* --- AVATAR MODAL (Pop-up) --- */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white/90 p-8 rounded-[40px] shadow-2xl border border-white max-w-sm w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-pink-400 to-coral-red" />
              <button onClick={() => setShowAvatarModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
              
              <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">Your Evolution</h2>
              
              {/* Dynamic Avatar Container */}
              <div className="flex justify-center mb-8">
                <div className={`w-32 h-32 rounded-full ${avatarColor} transition-colors duration-500 flex items-center justify-center shadow-inner`}>
                  {/* Logic: Change icon based on currentStage */}
                  {currentStage === 0 && <div className="w-16 h-20 bg-white/40 rounded-full" />}
                  {currentStage === 1 && <div className="w-12 h-12 bg-white/60 rounded-full animate-bounce" />}
                  {currentStage >= 4 && <span className="text-4xl">🦋</span>}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Customize Colors</p>
                <div className="flex gap-4">
                  <button onClick={() => setAvatarColor('bg-blue-400')} className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white shadow" />
                  <button onClick={() => setAvatarColor('bg-coral-red')} className="w-10 h-10 rounded-full bg-red-400 border-2 border-white shadow" />
                  <button onClick={() => setAvatarColor('bg-pink-400')} className="w-10 h-10 rounded-full bg-pink-400 border-2 border-white shadow" />
                </div>
              </div>

              <button className="w-full mt-8 py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700">
                Save Changes <ChevronRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .bg-coral-red { background-color: #F87171; }
      `}</style>
    </div>
  );
};

export default ChrysalisApp;