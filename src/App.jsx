import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, User, Lock, ShoppingBag,
  TrendingUp, BookOpen, Settings, Check, X, Loader2, AlertCircle
} from 'lucide-react';

import StockMarket from './StockMarket';

// 1. We start with only Lesson 1 active, and the rest locked!
const INITIAL_LESSONS = [
  { id: 1, title: 'The Egg', status: 'active', x: 200, y: 1450, topic: 'budgeting' },
  { id: 2, title: 'Basic Trading', status: 'locked', x: 500, y: 1200 },
  { id: 3, title: 'Market Trends', status: 'locked', x: 200, y: 900 },
  { id: 4, title: 'Risk Management', status: 'locked', x: 450, y: 600 },
  { id: 5, title: 'Financial Freedom', status: 'locked', x: 300, y: 300 },
];

export default function App() {
  const [coins, setCoins] = useState(1250);
  const [showMarket, setShowMarket] = useState(false);
  const [activeAILesson, setActiveAILesson] = useState(null);
  // 2. We put the lessons into React State so it can update live
  const [lessons, setLessons] = useState(INITIAL_LESSONS);

  // 3. The function that unlocks the next lesson
  const handleLessonComplete = (completedLessonId) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) => {
        if (lesson.id === completedLessonId) {
          return { ...lesson, status: 'completed' }; // Mark current as done
        }
        if (lesson.id === completedLessonId + 1) {
          return { ...lesson, status: 'active' }; // Unlock the next one
        }
        return lesson;
      })
    );
  };

  return (
    <div className="flex min-h-screen bg-[#D8EEF7] text-slate-900 font-sans">
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-blue-100 p-6 fixed h-full z-50 shadow-lg">
        <h2 className="text-2xl font-black text-blue-500 mb-10 tracking-tighter">Chrysalis</h2>
        <nav className="space-y-6">
          <NavItem icon={<BookOpen />} label="Learning" active />
          <NavItem icon={<TrendingUp />} label="Market" onClick={() => setShowMarket(true)} />
          <NavItem icon={<ShoppingBag />} label="Shop" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
      </aside>

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

            {/* Render the dynamic state 'lessons', not the static array */}
            {lessons.map((lesson) => (
              <LessonNode
                key={lesson.id}
                lesson={lesson}
                onEarn={() => setCoins(c => c + 50)}
                onOpenAI={() => setActiveAILesson(lesson)}
              />
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showMarket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-5xl h-[85vh] bg-white rounded-[32px] shadow-2xl overflow-hidden relative">
              <StockMarket coins={coins} setCoins={setCoins} onClose={() => setShowMarket(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeAILesson && (
          <AILessonOverlay
            lesson={activeAILesson}
            onClose={() => setActiveAILesson(null)}
            onReward={() => setCoins(c => c + 100)}
            onComplete={(id) => handleLessonComplete(id)} // Pass the unlock function down
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- LESSON OVERLAY COMPONENT ---

function AILessonOverlay({ lesson, onClose, onReward, onComplete }) {
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);

  const [sessionId] = useState(() => `session_${Date.now()}`);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setApiError(null);
        // Call the new cloud-based Vercel API function
        const response = await fetch('/api/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate', // Tell the API to generate a question
            topic: lesson.topic,
            difficulty: 'beginner'
          })
        });

        const data = await response.json();

        if (data.error) {
          setApiError(`AI Agent Error: ${data.error}`);
        } else if (!data.options || !data.question) {
          setApiError("The AI Agent returned an invalid response format.");
        } else {
          setQuizData(data); // Restored state update to clear loading spinner
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setApiError("Could not connect to the AI tutor. Check your Vercel deployment logs.");
      } finally {
        setLoadingQuestion(false);
      }
    };

    fetchQuestion();
  }, [lesson.topic]);

  const submitAnswer = async () => {
    if (!userAnswer) return;
    setLoadingFeedback(true);
    setApiError(null);
    try {
      const selectedOptionText = quizData.options.find(opt => opt.startsWith(userAnswer));

      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain', // Tell the API to explain the answer
          question: quizData.question,
          options: quizData.options,
          user_answer: userAnswer,
          correct_answer: quizData.correct_answer,
          user_explanation: `The student chose ${selectedOptionText} because it seemed like the best answer for ${lesson.topic}.` // Preserved logic from agent.py
        })
      });

      const data = await response.json();

      if (data.error) {
        setApiError(`AI Feedback Error: ${data.error}`);
      } else {
        setFeedbackData(data);
        if (data.is_correct) onReward();
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setApiError("Could not connect to the AI tutor for feedback.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-blue-500 text-white p-6 flex justify-between items-center z-10 shadow-sm">
          <h3 className="text-xl font-black">Lesson {lesson.id}: {lesson.title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto">
          <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <h4 className="font-black text-2xl text-blue-900 mb-4">The Golden Rule of Budgeting</h4>
            <p>Imagine you have a single, golden egg. If you crack it open today, you have a nice meal. But if you protect it, incubate it, and let it hatch, you eventually get a goose that lays more eggs for you. In finance, we call this your <strong>Nest Egg</strong>.</p>
            <p>Before you can start trading in the market, building a business, or investing in your future, you need to understand exactly what money comes into your life and what money leaves it. This is the core of <strong>budgeting</strong>.</p>
           
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-6 shadow-inner">
              <h5 className="font-bold text-blue-800 mb-2">The 50/30/20 Framework</h5>
              <p className="text-base text-slate-600 mb-3">A common strategy to protect your "egg" is to split your income into three distinct baskets:</p>
              <ul className="list-disc list-inside space-y-2 text-base font-medium">
                <li><span className="text-blue-600">50% Needs:</span> Rent, groceries, utilities.</li>
                <li><span className="text-pink-500">30% Wants:</span> Hobbies, dining out, entertainment.</li>
                <li><span className="text-green-600">20% Savings:</span> Your future nest egg and investments.</li>
              </ul>
            </div>
            <p>A budget isn't meant to restrict you; it's meant to act as a map. Without a map, your cash simply gets lost. The ultimate goal is simple: <strong>always spend less than you earn</strong>, and redirect the difference toward your future.</p>
          </div>

          <hr className="my-10 border-slate-200 border-2 rounded-full" />

          {/* --- AI AGENT SECTION --- */}
          <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-2">
              <Check className="text-blue-500" /> Interactive Knowledge Check
            </h4>

            {apiError ? (
              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0" />
                <div>
                  <h5 className="font-bold text-red-800">Connection Failed</h5>
                  <p className="text-red-600 text-sm mt-1">{apiError}</p>
                </div>
              </div>
            ) : loadingQuestion ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-slate-400">
                <Loader2 className="animate-spin size-8" />
                <p className="font-medium">The AI Agent is writing your question...</p>
              </div>
            ) : !feedbackData && quizData ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="font-bold text-lg text-slate-800">{quizData.question}</p>
                <div className="space-y-3">
                  {quizData.options.map((opt, idx) => {
                    const letter = opt.charAt(0);
                    return (
                      <button
                        key={idx}
                        onClick={() => setUserAnswer(letter)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${
                          userAnswer === letter ? 'border-blue-500 bg-blue-100/50 text-blue-900' : 'border-slate-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
               
                <button
                  onClick={submitAnswer}
                  disabled={loadingFeedback || !userAnswer}
                  className="w-full py-4 mt-2 bg-blue-500 disabled:bg-slate-300 hover:bg-blue-600 text-white font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {loadingFeedback ? <Loader2 className="animate-spin" /> : 'Get AI Feedback'}
                </button>
              </div>
            ) : null}

            {feedbackData && (
              <div className="space-y-6 text-center animate-in zoom-in-95 duration-500">
                <div className="text-6xl mb-2">{feedbackData.is_correct ? '🎉' : '💡'}</div>
                <h4 className={`text-2xl font-black ${feedbackData.is_correct ? 'text-green-600' : 'text-blue-600'}`}>
                  {feedbackData.is_correct ? 'Excellent Work!' : 'Let\'s Review.'}
                </h4>
               
                <div className="bg-white p-6 rounded-2xl text-left border border-slate-200 shadow-sm mt-4">
                  <p className="font-black text-slate-800 mb-2">Personalized Feedback:</p>
                  <p className="text-slate-600 italic mb-5 leading-relaxed">"{feedbackData.feedback}"</p>
                  <hr className="my-4 border-slate-100" />
                  <p className="font-black text-slate-800 mb-2">The Concept:</p>
                  <p className="text-slate-700 leading-relaxed">{feedbackData.explanation}</p>
                </div>

                <p className="font-bold text-pink-500 text-lg mt-4">{feedbackData.encouragement}</p>

                <button
                  onClick={() => {
                    if (feedbackData.is_correct) {
                      onComplete(lesson.id); // Triggers the unlock in App.jsx!
                    }
                    onClose();
                  }}
                  className="w-full py-4 mt-6 bg-green-500 hover:bg-green-600 text-white font-black text-lg rounded-2xl transition-all shadow-lg"
                >
                  Finish Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 cursor-pointer group transition-all ${active ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}>
      <div className={`p-2 rounded-xl shadow-sm border transition-all ${active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-blue-50 group-hover:border-blue-300'}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="font-bold text-lg">{label}</span>
    </div>
  );
}

function LessonNode({ lesson, onEarn, onOpenAI }) {
  const isActive = lesson.status === 'active';
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';

  const handleClick = () => {
    if (isLocked) return; // Locked levels do nothing
   
    if (lesson.id === 1) {
      onOpenAI(); // Open the AI Tutor for level 1
    } else {
      onEarn(); // For Level 2+ placeholder, just give some coins!
    }
  };

  return (
    <div className="absolute transform -translate-x-1/2" style={{ left: `${lesson.x}px`, top: `${lesson.y}px` }}>
      <div className="relative flex flex-col items-center">
        {(isActive || lesson.id === 1) && (
          <motion.span animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-blue-400 rounded-full -m-4 pointer-events-none" />
        )}
        <motion.div whileHover={!isLocked ? { scale: 1.1 } : {}} onClick={handleClick} className={`w-24 h-20 md:w-32 md:h-24 rounded-[100%] border-b-8 flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer relative z-10 ${isCompleted && lesson.id !== 1 ? 'bg-[#568D5B] border-[#3d6341] text-white' : (isActive || lesson.id === 1) ? 'bg-white border-blue-400 text-blue-500' : 'bg-slate-200 border-slate-300 grayscale opacity-60'}`}>
          {isLocked ? <Lock size={28} /> : isCompleted && lesson.id !== 1 ? <Check size={32} strokeWidth={3} /> : <span className="text-2xl font-black">{lesson.id}</span>}
        </motion.div>
        <div className="mt-4 bg-white/90 px-4 py-1 rounded-full shadow-sm border border-blue-100 whitespace-nowrap z-10">
          <span className={`text-sm font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>{lesson.title}</span>
        </div>
      </div>
    </div>
  );
}