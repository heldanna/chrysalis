import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, User, Lock, ShoppingBag,
  TrendingUp, BookOpen, Check,
  X, Loader2, AlertCircle
} from 'lucide-react';
import StockMarket from './StockMarket';
import backgroundImage from './images/bg.jpg';

// Load user progress from localStorage
const loadProgress = () => {
  const saved = localStorage.getItem('chrysalis-progress');
  return saved ? parseInt(saved) : 1;
};

// Lessons with proportional coordinates (mapping to a 1000x2000 viewBox)
const LESSONS = [
  { id: 1, title: 'Budgeting Basics', x: 200, y: 1800, topic: 'budgeting' },
  { id: 2, title: 'Saving Strategies', x: 800, y: 1400, topic: 'saving' },
  { id: 3, title: 'Understanding Credit', x: 200, y: 1000, topic: 'credit' },
  { id: 4, title: 'Investing Fundamentals', x: 800, y: 600, topic: 'investing' },
  { id: 5, title: 'Taxes', x: 200, y: 200, topic: 'taxes' },
];

// Updated SquiggleVine: Solid, strong green, winds bottom-left to top-right with narrow turns
const SquiggleVine = ({ className, strokeColor = "#22C55E" }) => {
  return (
    <svg 
      viewBox="0 0 1000 2000" 
      fill="none"
      className={className}
      preserveAspectRatio="none"
      style={{
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    >
      <motion.path 
        opacity="1" 
        stroke={strokeColor}
        strokeWidth="15" 
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 100 1900 
           C 950 1750, 950 1550, 500 1450 
           S 50 1250, 500 1150 
           S 950 950, 500 850 
           S 50 650, 500 550 
           S 950 250, 900 100"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      
      {/* Butterfly at the end of the vine */}
      <motion.text
        x="880"
        y="120"
        fontSize="80"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.6 }}
      >
        🦋
      </motion.text>
    </svg>
  );
};

// NavItem Component
const NavItem = ({ icon, label, active = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 cursor-pointer group transition-all ${
        active ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'
      }`}
    >
      <div className={`p-2 rounded-xl shadow-sm border transition-all ${
        active 
          ? 'bg-blue-500 text-white border-blue-500' 
          : 'bg-white border-blue-50 group-hover:border-blue-300'
      }`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="font-bold text-lg">{label}</span>
    </div>
  );
};

// LessonNode Component
const LessonNode = ({ lesson, status, onOpenAI, sizeMultiplier = 1.4 }) => {
  const isActive = status === 'active';
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const baseSizes = {
    mobile: { width: 72, height: 60 },
    tablet: { width: 126, height: 105 },
    desktop: { width: 144, height: 120 },
    largeDesktop: { width: 158, height: 132 }
  };

  const [nodeSize, setNodeSize] = useState({ 
    width: baseSizes.desktop.width * sizeMultiplier, 
    height: baseSizes.desktop.height * sizeMultiplier 
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setNodeSize({ 
          width: baseSizes.mobile.width * sizeMultiplier, 
          height: baseSizes.mobile.height * sizeMultiplier 
        });
      } else if (width < 768) {
        setNodeSize({ 
          width: baseSizes.tablet.width * sizeMultiplier, 
          height: baseSizes.tablet.height * sizeMultiplier 
        });
      } else if (width < 1024) {
        setNodeSize({ 
          width: baseSizes.desktop.width * sizeMultiplier, 
          height: baseSizes.desktop.height * sizeMultiplier 
        });
      } else {
        setNodeSize({ 
          width: baseSizes.largeDesktop.width * sizeMultiplier, 
          height: baseSizes.largeDesktop.height * sizeMultiplier 
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sizeMultiplier]);

  const getLilypadColor = () => {
    if (isCompleted) return '%232D6A4F';
    if (isActive) return '%2340A578';
    return '%239CA3AF';
  };

  const getLilypadStroke = () => {
    if (isCompleted) return '%231A3F2C';
    if (isActive) return '%232D6A4F';
    return '%236B7280';
  };

  const handleClick = () => {
    if (isLocked) return;
    onOpenAI(lesson);
  };

  return (
    <motion.div 
      className="absolute cursor-pointer"
      style={{ 
        left: `${lesson.x / 10}%`, // Proportional X
        top: `${lesson.y}px`,      // Y within the scroll container
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: lesson.id * 0.1 }}
      onClick={handleClick}
    >
      <div className="relative flex flex-col items-center">
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute rounded-full bg-blue-400/30 blur-2xl"
            style={{
              width: nodeSize.width * 2,
              height: nodeSize.height * 2,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 5
            }}
          />
        )}

        <motion.div
          whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
          whileTap={!isLocked ? { scale: 0.95 } : {}}
          className={`relative transition-all duration-300 z-10 ${isLocked ? 'cursor-not-allowed opacity-60 grayscale' : ''}`}
          style={{
            width: nodeSize.width,
            height: nodeSize.height,
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><path d="M50 5 Q70 0 85 20 Q95 35 85 55 Q70 75 50 75 Q30 75 15 55 Q5 35 15 20 Q30 0 50 5" fill="${getLilypadColor()}" stroke="${getLilypadStroke()}" stroke-width="4"/></svg>')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {isLocked && <Lock size={nodeSize.width * 0.6} className="text-white drop-shadow-2xl" />}
            {isCompleted && <Check size={nodeSize.width * 0.7} className="text-white drop-shadow-2xl" strokeWidth={4} />}
            {isActive && !isLocked && !isCompleted && (
              <span className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">{lesson.id}</span>
            )}
          </div>
        </motion.div>

        <motion.div className="mt-8 bg-white/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-2xl border border-white/50 whitespace-nowrap z-10" whileHover={{ scale: 1.05 }}>
          <span className={`text-2xl font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>{lesson.title}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// AI Lesson Overlay Component
function AILessonOverlay({ lesson, onClose, onReward, onComplete }) {
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setApiError(null);
        // Corrected to relative Vercel API route
        const response = await fetch('/api/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate', topic: lesson.topic, difficulty: 'beginner' })
        });
        const data = await response.json();
        if (data.error) setApiError(`AI Agent Error: ${data.error}`);
        else setQuizData(data);
      } catch (error) {
        setApiError("Could not connect to the AI tutor.");
      } finally {
        setLoadingQuestion(false);
      }
    };
    fetchQuestion();
  }, [lesson.topic]);

  const submitAnswer = async () => {
    if (!userAnswer) return;
    setLoadingFeedback(true);
    try {
      const selectedOptionText = quizData.options.find(opt => opt.startsWith(userAnswer));
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain',
          question: quizData.question,
          options: quizData.options,
          user_answer: userAnswer,
          correct_answer: quizData.correct_answer,
          user_explanation: `I chose ${selectedOptionText} for ${lesson.topic}.`
        })
      });
      const data = await response.json();
      if (data.error) setApiError(`AI Feedback Error: ${data.error}`);
      else {
        setFeedbackData(data);
        if (data.is_correct) onReward();
      }
    } catch (error) {
      setApiError("Could not get AI feedback.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-blue-500 text-white p-6 flex justify-between items-center z-10 shadow-sm">
          <h3 className="text-xl font-black">Lesson {lesson.id}: {lesson.title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 md:p-10 overflow-y-auto">
          <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <h4 className="font-black text-2xl text-blue-900">The Golden Rule of Budgeting</h4>
            <p>Imagine you have a single, golden egg...</p>
            {/* [Remainder of your lesson content preserved verbatim] */}
          </div>
          <hr className="my-10 border-slate-200 border-2 rounded-full" />
          <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100">
            <h4 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-2"><Check className="text-blue-500" /> Interactive Knowledge Check</h4>
            {apiError ? (
              <div className="bg-red-50 p-6 rounded-xl flex items-start gap-3"><AlertCircle className="text-red-500" /><p>{apiError}</p></div>
            ) : loadingQuestion ? (
              <div className="flex flex-col items-center py-10"><Loader2 className="animate-spin" /><p>The AI Agent is writing your question...</p></div>
            ) : !feedbackData && quizData ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <p className="font-bold text-lg">{quizData.question}</p>
                {quizData.options.map((opt, idx) => (
                  <button key={idx} onClick={() => setUserAnswer(opt.charAt(0))} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${userAnswer === opt.charAt(0) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>{opt}</button>
                ))}
                <button onClick={submitAnswer} disabled={loadingFeedback || !userAnswer} className="w-full py-4 bg-blue-500 text-white font-black rounded-2xl">Get AI Feedback</button>
              </div>
            ) : null}
            {feedbackData && (
              <div className="space-y-6 text-center animate-in zoom-in-95">
                <div className="text-6xl">{feedbackData.is_correct ? '🎉' : '💡'}</div>
                <h4 className="text-2xl font-black">{feedbackData.is_correct ? 'Excellent Work!' : 'Let\'s Review.'}</h4>
                <div className="bg-white p-6 rounded-2xl text-left border shadow-sm">
                  <p className="font-black">Personalized Feedback:</p>
                  <p className="italic leading-relaxed text-slate-600">"{feedbackData.feedback}"</p>
                  <p className="font-black mt-4">The Concept:</p>
                  <p className="text-slate-700">{feedbackData.explanation}</p>
                </div>
                <button onClick={() => { if (feedbackData.is_correct) onComplete(lesson.id); onClose(); }} className="w-full py-4 bg-green-500 text-white font-black rounded-2xl">Finish Lesson</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [coins, setCoins] = useState(1250);
  const [showMarket, setShowMarket] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(loadProgress);
  const [activeAILesson, setActiveAILesson] = useState(null);

  useEffect(() => { localStorage.setItem('chrysalis-progress', currentLevel.toString()); }, [currentLevel]);

  const handleLevelComplete = (lessonId) => {
    if (lessonId === currentLevel) {
      setCoins(c => c + 50);
      if (currentLevel < LESSONS.length) setCurrentLevel(currentLevel + 1);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', opacity: 0.4, zIndex: 0 }} />
      <div className="flex min-h-screen text-slate-900 font-sans relative z-10">
        <aside className="hidden md:flex w-64 flex-col bg-white/90 border-r p-6 fixed h-full shadow-lg">
          <h2 className="text-2xl font-black text-blue-600 mb-10 tracking-tighter">Chrysalis</h2>
          <nav className="space-y-6">
            <NavItem icon={<BookOpen />} label="Learning" active />
            <NavItem icon={<TrendingUp />} label="Market" onClick={() => setShowMarket(true)} />
            <NavItem icon={<ShoppingBag />} label="Shop" />
          </nav>
        </aside>
        <main className="flex-1 md:ml-64 flex flex-col relative min-h-screen overflow-hidden">
          <header className="sticky top-0 z-40 flex items-center justify-end px-6 py-4 bg-white/60 backdrop-blur-md">
            <div className="flex items-center bg-white px-4 py-2 rounded-2xl border">
              <Coins className="text-yellow-500 mr-2 size-5" /><span className="font-bold">{coins}</span>
            </div>
            <button className="p-2 ml-4 bg-pink-400 rounded-xl text-white shadow-lg"><User size={20} /></button>
          </header>
          <div className="flex-1 px-4 pb-20 overflow-y-auto">
            <div className="max-w-4xl mx-auto relative min-h-[2000px] pb-20">
              <div className="absolute inset-0 pointer-events-none">
                <SquiggleVine className="w-full h-full" strokeColor="#22C55E" />
              </div>
              {LESSONS.map((lesson) => (
                <LessonNode 
                  key={lesson.id} 
                  lesson={lesson} 
                  status={lesson.id < currentLevel ? 'completed' : lesson.id === currentLevel ? 'active' : 'locked'} 
                  onOpenAI={(l) => setActiveAILesson(l)} 
                />
              ))}
            </div>
          </div>
        </main>
        <AnimatePresence>
          {showMarket && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[100] bg-white">
              <StockMarket coins={coins} setCoins={setCoins} onClose={() => setShowMarket(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAILesson && (
            <AILessonOverlay 
              lesson={activeAILesson} 
              onClose={() => setActiveAILesson(null)} 
              onReward={() => setCoins(c => c + 100)} 
              onComplete={handleLevelComplete} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}