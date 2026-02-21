import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, User, Lock, ShoppingBag, TrendingUp, BookOpen, Settings, Check } from 'lucide-react';
import StockMarket from './StockMarket';

// 3 & 4. Expanded Lessons - Coordinates now match the SVG "Control Points"
const LESSONS = [
  { id: 1, title: 'The Egg', status: 'completed', x: 15, y: 92 },
  { id: 2, title: 'Basic Trading', status: 'active', x: 45, y: 88 },
  { id: 3, title: 'Market Trends', status: 'locked', x: 80, y: 82 },
  { id: 4, title: 'Risk Management', status: 'locked', x: 50, y: 75 },
  { id: 5, title: 'Financial Freedom', status: 'locked', x: 10, y: 68 },
  { id: 6, title: 'Asset Allocation', status: 'locked', x: 40, y: 62 },
  { id: 7, title: 'Dividend Growth', status: 'locked', x: 85, y: 55 },
  { id: 8, title: 'Compound Interest', status: 'locked', x: 55, y: 48 },
  { id: 9, title: 'Index Funds', status: 'locked', x: 20, y: 40 },
  { id: 10, title: 'Tax Efficiency', status: 'locked', x: 50, y: 32 },
  { id: 11, title: 'Estate Planning', status: 'locked', x: 80, y: 25 },
  { id: 12, title: 'Crypto Basics', status: 'locked', x: 45, y: 18 },
  { id: 13, title: 'Real Estate', status: 'locked', x: 15, y: 12 },
  { id: 14, title: 'Inflation', status: 'locked', x: 55, y: 6 },
  { id: 15, title: 'Legacy', status: 'locked', x: 90, y: 2 },
];

export default function App() {
  const [coins, setCoins] = useState(1250);
  const [showMarket, setShowMarket] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#D8EEF7] text-slate-900 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col bg-white/90 backdrop-blur-md border-r border-blue-100 p-6 fixed h-full z-50 shadow-lg">
        <h2 className="text-2xl font-black text-blue-500 mb-10 tracking-tighter italic">Chrysalis</h2>
        <nav className="space-y-6">
          <NavItem icon={<BookOpen />} label="Learning" active />
          <NavItem icon={<TrendingUp />} label="Market" onClick={() => setShowMarket(true)} />
          <NavItem icon={<ShoppingBag />} label="Shop" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 relative h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
        <header className="sticky top-0 z-40 flex items-center justify-between md:justify-end px-6 py-4">
          <h1 className="md:hidden text-xl font-black text-blue-500 italic">Chrysalis</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-blue-100">
              <Coins className="text-yellow-500 mr-2 size-5" />
              <span className="font-bold">{coins}</span>
            </div>
            <button className="p-2 bg-pink-400 rounded-xl text-white shadow-lg"><User size={20} /></button>
          </div>
        </header>

        {/* THE VINE AND LILY PADS */}
        <div className="relative w-full h-[3000px] py-20">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            {/* The path 'd' now curves specifically through the x/y coordinates of the lessons */}
            <motion.path
              d="M 15% 92% C 45% 88%, 80% 82%, 80% 82% S 50% 75%, 10% 68% S 40% 62%, 85% 55% S 55% 48%, 20% 40% S 50% 32%, 80% 25% S 45% 18%, 15% 12% S 55% 6%, 90% 2%"
              fill="transparent"
              stroke="#3D6341"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="25 20"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </svg>

          {LESSONS.map((lesson) => (
            <LessonNode key={lesson.id} lesson={lesson} onEarn={() => setCoins(c => c + 50)} />
          ))}
        </div>
      </main>

      {/* OVERLAY */}
      <AnimatePresence>
        {showMarket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-5xl h-[85vh] bg-white rounded-[32px] overflow-hidden relative shadow-2xl">
              <StockMarket coins={coins} setCoins={setCoins} onClose={() => setShowMarket(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// LILY PAD COMPONENT
function LessonNode({ lesson, onEarn }) {
  const isActive = lesson.status === 'active';
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';

  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${lesson.x}%`, top: `${lesson.y}%` }}>
      <div className="relative flex flex-col items-center">
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute inset-0 bg-white rounded-full -m-8"
          />
        )}
        
        <motion.div
          whileHover={!isLocked ? { scale: 1.15, rotate: 8 } : {}}
          onClick={() => isActive && onEarn()}
          className="relative w-24 h-24 cursor-pointer flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full drop-shadow-lg ${isLocked ? 'grayscale opacity-30' : ''}`}>
            {/* Organic Lily Pad Shape */}
            <path 
              d="M 50 50 m -45 0 a 45 45 0 1 0 90 0 a 45 45 0 1 0 -90 0" 
              fill={isCompleted ? "#4A7A4E" : isActive ? "#8BC34A" : "#7AB37E"} 
              stroke="#2D4A31" 
              strokeWidth="2"
            />
            {/* Veins */}
            <path d="M 50 50 L 20 20 M 50 50 L 80 20 M 50 50 L 20 80 M 50 50 L 80 80" fill="none" stroke="#2D4A31" strokeWidth="0.5" opacity="0.4"/>
            {/* The Signature Lily Pad Cutout (points toward the vine) */}
            <path d="M 50 50 L 70 5 L 95 30 Z" fill="#D8EEF7" stroke="#2D4A31" strokeWidth="1" /> 
          </svg>

          <span className={`relative z-10 font-black text-2xl drop-shadow-sm ${isCompleted ? 'text-white' : 'text-green-950'}`}>
            {isLocked ? <Lock size={22} className="opacity-50" /> : isCompleted ? <Check size={28} strokeWidth={4}/> : lesson.id}
          </span>
        </motion.div>

        <div className="mt-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-green-200 shadow-md z-10">
          <span className={`text-[12px] font-black uppercase tracking-wider ${isLocked ? 'text-slate-400' : 'text-green-900'}`}>
            {lesson.title}
          </span>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 cursor-pointer group transition-all ${active ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}>
      <div className={`p-2.5 rounded-2xl border transition-all ${active ? 'bg-blue-500 text-white shadow-md' : 'bg-white border-blue-50'}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <span className="font-bold text-lg tracking-tight">{label}</span>
    </div>
  );
}