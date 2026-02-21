
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, User, Lock, ShoppingBag,
  TrendingUp, BookOpen, Settings, Check
} from 'lucide-react';


// --- THE KEY IMPORT ---
// Ensure you have a file named StockMarket.jsx in the same folder!
import StockMarket from './StockMarket';


const LESSONS = [
  { id: 1, title: 'The Egg', status: 'completed', x: 200, y: 1450 },
  { id: 2, title: 'Basic Trading', status: 'active', x: 500, y: 1200 },
  { id: 3, title: 'Market Trends', status: 'locked', x: 200, y: 900 },
  { id: 4, title: 'Risk Management', status: 'locked', x: 450, y: 600 },
  { id: 5, title: 'Financial Freedom', status: 'locked', x: 300, y: 300 },
];


export default function App() {
  const [coins, setCoins] = useState(1250);
  const [showMarket, setShowMarket] = useState(false); // Controls the overlay


  return (
    <div className="flex min-h-screen bg-[#D8EEF7] text-slate-900 font-sans">

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-blue-100 p-6 fixed h-full z-50 shadow-lg">
        <h2 className="text-2xl font-black text-blue-500 mb-10 tracking-tighter">Chrysalis</h2>
        <nav className="space-y-6">
          <NavItem icon={<BookOpen />} label="Learning" active />
          {/* Clicking 'Market' now opens the component */}
          <NavItem
            icon={<TrendingUp />}
            label="Market"
            onClick={() => setShowMarket(true)}
          />
          <NavItem icon={<ShoppingBag />} label="Shop" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
      </aside>


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 flex flex-col relative min-h-screen">

        <header className="sticky top-0 z-40 flex items-center justify-between md:justify-end px-6 py-4 bg-white/60 backdrop-blur-md">
          <h1 className="md:hidden text-xl font-black text-blue-500">Chrysalis</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-4 py-2 rounded-2xl shadow-sm border border-blue-100">
              <Coins className="text-yellow-500 mr-2 size-5" />
              <span className="font-bold">{coins}</span>
            </div>
            <button className="p-2 bg-pink-400 rounded-xl text-white shadow-lg">
              <User size={20} />
            </button>
          </div>
        </header>


        <div className="flex-1 px-4 pb-20 overflow-y-auto">
          <div className="max-w-3xl mx-auto relative bg-[#E6F4FF] rounded-[40px] shadow-inner border-8 border-white my-8 min-h-[1600px] overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <motion.path
                d="M 250 1500 C 450 1350, 150 1150, 350 950 S 550 650, 250 450 S 450 150, 350 50"
                fill="transparent"
                stroke="#568D5B"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="20 15"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5 }}
              />
            </svg>


            {LESSONS.map((lesson) => (
              <LessonNode
                key={lesson.id}
                lesson={lesson}
                onEarn={() => setCoins(c => c + 50)}
              />
            ))}
          </div>
        </div>
      </main>


      {/* --- STOCK MARKET OVERLAY --- */}
      <AnimatePresence>
        {showMarket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl h-[85vh] bg-white rounded-[32px] shadow-2xl overflow-hidden relative"
            >
              {/* This component must be exported from StockMarket.jsx */}
              <StockMarket
                coins={coins}
                setCoins={setCoins}
                onClose={() => setShowMarket(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// --- SUB-COMPONENTS ---


function NavItem({ icon, label, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 cursor-pointer group transition-all ${active ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}
    >
      <div className={`p-2 rounded-xl shadow-sm border transition-all ${active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-blue-50 group-hover:border-blue-300'}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="font-bold text-lg">{label}</span>
    </div>
  );
}


function LessonNode({ lesson, onEarn }) {
  const isActive = lesson.status === 'active';
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';


  return (
    <div className="absolute transform -translate-x-1/2" style={{ left: `${lesson.x}px`, top: `${lesson.y}px` }}>
      <div className="relative flex flex-col items-center">
        {isActive && (
          <motion.span
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-blue-400 rounded-full -m-4"
          />
        )}
        <motion.div
          whileHover={!isLocked ? { scale: 1.1 } : {}}
          onClick={() => isActive && onEarn()}
          className={`w-24 h-20 md:w-32 md:h-24 rounded-[100%] border-b-8 flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer relative z-10
           ${isCompleted ? 'bg-[#568D5B] border-[#3d6341] text-white' : isActive ? 'bg-white border-blue-400 text-blue-500' : 'bg-slate-200 border-slate-300 grayscale opacity-60'}`}
        >
          {isLocked ? <Lock size={28} /> : isCompleted ? <Check size={32} strokeWidth={3} /> : <span className="text-2xl font-black">{lesson.id}</span>}
        </motion.div>
        <div className="mt-4 bg-white/90 px-4 py-1 rounded-full shadow-sm border border-blue-100 whitespace-nowrap z-10">
          <span className={`text-sm font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>{lesson.title}</span>
        </div>
      </div>
    </div>
  );
}

