import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, User, Lock, ShoppingBag,
  TrendingUp, BookOpen, Settings, Check,
  X, Loader2, AlertCircle
} from 'lucide-react';
import StockMarket from './StockMarket';
import backgroundImage from './images/bg.jpg';

// Load user progress from localStorage
const loadProgress = () => {
  const saved = localStorage.getItem('chrysalis-progress');
  return saved ? parseInt(saved) : 1;
};

// Lessons with topics for AI agents
const LESSONS = [
  { id: 1, title: 'The Egg', x: 500, y: 1726, topic: 'budgeting' },
  { id: 2, title: 'Basic Trading', x: 850, y: 1500, topic: 'trading' },
  { id: 3, title: 'Market Trends', x: 400, y: 1090, topic: 'market_trends' },
  { id: 4, title: 'Risk Management', x: 400, y: 550, topic: 'risk_management' },
  { id: 5, title: 'Financial Freedom', x: 950, y: 150, topic: 'financial_freedom' },
];

// SquiggleVine Component with your adjusted path
const SquiggleVine = ({ className, progress = 1, strokeColor = "#578E5B" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 870 1280" 
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
      <path 
        opacity="0.47"
        stroke={strokeColor}
        strokeWidth="6" 
        strokeLinecap="round"
        strokeDasharray={progress < 1 ? "8 8" : "none"}
        d="M508.845 3 C508.845 3.48239 540.769 34.8189 593.249 85.0316 C620.957 111.542 637.14 119.561 659.049 125.993 C732.169 147.457 782.167 150.417 815.813 164.201 C839.291 173.819 853.223 196.838 863.656 216.238 C867.483 223.354 866.992 234.906 866.562 248.142 C866.001 265.456 835.904 284.446 811.651 296.214 C788.097 307.643 765.602 289.548 738.716 281.811 C699.519 270.531 645.676 281.193 624.909 293.564 C610.507 302.142 605.8 319.345 602.488 338.45 C598.767 359.911 616.829 375.361 629.05 391.487 C644.383 411.717 629.745 456.216 619.998 471.606 C614.92 479.625 602.284 484.479 584.642 489.469 C559.873 496.474 540.347 491.078 527.417 482.826 C500.287 465.512 484.439 446.136 480.418 439.897 C475.885 432.861 475.251 420.417 476.226 407.521 C476.871 398.989 485.809 393.263 494.243 387.219 C501.313 382.154 513.499 381.298 527.22 381.549 C545.042 381.877 555.671 398.128 562.302 410.28 C565.586 416.3 564.01 426.067 562.565 435.931 C561.337 444.307 551.288 448.174 543.168 451.292 C513.953 462.51 448.195 449.4 397.857 430.499 C349.789 412.45 328.688 377.16 308.464 358.517 C294.537 345.68 270.182 344.281 211.558 344.616 C192.536 344.725 179.127 353.479 165.981 361.131 C156.723 366.519 152.333 373.486 149.832 384.705 C145.449 404.365 150.975 424.782 155.467 437.705 C158.824 447.362 165.654 453.14 173.4 457.409 C181.655 461.959 191.218 461.344 198.602 460.541 C202.148 460.155 204.99 458.08 206.748 455.533 C210.364 450.296 209.547 442.465 207.924 436.091 C206.283 429.651 191.726 429.432 177.671 429.593 C158.18 429.816 134.665 456.827 112.112 483.253 C74.1345 527.752 31.9064 580.189 15.7641 614.407 C-6.5632 661.735 5.9465 715.392 11.9633 721.429 C28.6532 738.175 58.6571 748.8 70.3579 761.289 C82.9827 774.763 85.7247 796.255 90.2313 819.423 C92.0755 828.904 94.6743 836.485 100.356 842.033 C121.769 862.939 173.306 844.401 186.791 839.396 C212.781 829.749 265.066 782.026 316.523 766.929 C375.79 749.54 394.314 767.565 478.807 777.26 C513.924 781.289 536.133 776.433 564.403 770.631 C616.399 759.961 657.007 758.554 669.209 759.15 C678.414 759.6 685.373 764.883 695.08 777.703 C714.203 802.959 720.505 831.846 719.269 846.559 C716.928 874.43 653.601 885.14 625.705 893.268 C598.662 901.147 576.646 895.304 569.997 892.514 C562.211 889.248 557.55 881.645 555.18 875.095 C554.03 871.916 555.239 868.428 556.892 865.262 C565.734 848.323 591.759 841.402 606.212 840.474 C627.568 839.103 642.743 868.837 644.855 876.841 C649.65 895.008 650.144 931.872 655.448 984.331 C657.928 1008.86 670.086 1026.49 682.376 1042.15 C693.603 1056.45 731.681 1054.58 758.832 1048.26 C788.672 1041.32 800.382 993.8 800.264 974.568 C800.237 970.126 795.929 967.301 792.713 965.181 C789.497 963.061 786.043 961.98 783.029 962.711 C761.401 967.956 754.357 1009.39 750.929 1040.11 C744.77 1095.31 749.269 1143.76 748.6 1163.26 C748.146 1176.49 709.628 1204.65 652.591 1243.88 C617.347 1268.11 595.395 1273.61 581.563 1275.49 C568.345 1277.28 558.597 1274.6 552.488 1270.69 C531.608 1257.35 518.6 1224.43 501.123 1213.41 C467.296 1192.07 427.123 1202.27 409.349 1208"
      />
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

// LessonNode Component with AI integration
const LessonNode = ({ lesson, status, onOpenAI, sizeMultiplier = 1.4 }) => {
  const isActive = status === 'active';
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  // Base sizes (original reference sizes)
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
    onOpenAI(lesson); // Open AI overlay for this lesson
  };

  return (
    <motion.div 
      className="absolute cursor-pointer"
      style={{ 
        left: `${lesson.x}px`, 
        top: `${lesson.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: lesson.id * 0.1 }}
      onClick={handleClick}
    >
      <div className="relative flex flex-col items-center">
        {/* Glow effect for active lesson */}
        {isActive && (
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
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

        {/* Lilypad */}
        <motion.div
          whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
          whileTap={!isLocked ? { scale: 0.95 } : {}}
          className={`relative transition-all duration-300 z-10 ${
            isLocked ? 'cursor-not-allowed opacity-60 grayscale' : ''
          }`}
          style={{
            width: nodeSize.width,
            height: nodeSize.height,
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><path d="M50 5 Q70 0 85 20 Q95 35 85 55 Q70 75 50 75 Q30 75 15 55 Q5 35 15 20 Q30 0 50 5" fill="${getLilypadColor()}" stroke="${getLilypadStroke()}" stroke-width="4"/><circle cx="50" cy="40" r="30" fill="%23FBBF24" opacity="0.0"/></svg>')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {isLocked && <Lock size={100} className="text-white drop-shadow-2xl" />}
            {isCompleted && <Check size={110} className="text-white drop-shadow-2xl" strokeWidth={4} />}
            {isActive && !isLocked && !isCompleted && (
              <span className="text-7xl font-black text-white drop-shadow-2xl">{lesson.id}</span>
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div 
          className="mt-8 bg-white/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-2xl border border-white/50 whitespace-nowrap z-10"
          whileHover={{ scale: 1.05 }}
        >
          <span className={`text-2xl font-bold ${
            isLocked ? 'text-slate-400' : 'text-slate-700'
          }`}>
            {lesson.title}
          </span>
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

  const [sessionId] = useState(() => `session_${Date.now()}`);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setApiError(null);
        const response = await fetch('http://127.0.0.1:8000/api/question/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: lesson.topic,
            difficulty: 'beginner',
            session_id: sessionId
          })
        });
        
        const data = await response.json();
        
        if (data.error) {
          setApiError(`AI Agent Error: ${data.error}`);
        } else if (!data.options || !data.question) {
          setApiError("The AI Agent returned an invalid response format.");
        } else {
          setQuizData(data);
        }

      } catch (error) {
        console.error("Fetch Error:", error);
        setApiError("Could not connect to Django server. Is it running on port 8000?");
      } finally {
        setLoadingQuestion(false);
      }
    };

    fetchQuestion();
  }, [lesson.topic, sessionId]);

  const submitAnswer = async () => {
    if (!userAnswer) return;
    setLoadingFeedback(true);
    setApiError(null);
    try {
      const selectedOptionText = quizData.options.find(opt => opt.startsWith(userAnswer));

      const response = await fetch('http://127.0.0.1:8000/api/explain/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: quizData.question,
          options: quizData.options,
          user_answer: userAnswer,
          correct_answer: quizData.correct_answer,
          user_explanation: `I chose ${selectedOptionText} because it seemed like the best answer.`,
          session_id: sessionId,
          topic: lesson.topic
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
      setApiError("Could not connect to Django server to get feedback.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.9, y: 20 }} 
        className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
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

          {/* AI AGENT SECTION */}
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
                      onComplete(lesson.id);
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

export default function App() {
  const [coins, setCoins] = useState(1250);
  const [showMarket, setShowMarket] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(loadProgress);
  const [vineProgress, setVineProgress] = useState(0);
  const [activeAILesson, setActiveAILesson] = useState(null);

  useEffect(() => {
    localStorage.setItem('chrysalis-progress', currentLevel.toString());
    setVineProgress(currentLevel / LESSONS.length);
  }, [currentLevel]);

  const handleLevelComplete = (lessonId) => {
    if (lessonId === currentLevel) {
      setCoins(c => c + 50);
      if (currentLevel < LESSONS.length) {
        setCurrentLevel(currentLevel + 1);
      }
    }
  };

  const getLessonStatus = (lessonId) => {
    if (lessonId < currentLevel) return 'completed';
    if (lessonId === currentLevel) return 'active';
    return 'locked';
  };

  const handleOpenAI = (lesson) => {
    setActiveAILesson(lesson);
  };

  const handleAIClose = () => {
    setActiveAILesson(null);
  };

  const handleAIReward = () => {
    setCoins(c => c + 100);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background image with opacity - completely separate from content */}
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          zIndex: 0
        }}
      />
      
      {/* Your actual app content - above the background */}
      <div className="flex min-h-screen text-slate-900 font-sans overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-white/90 backdrop-blur-sm border-r border-blue-100 p-6 fixed h-full shadow-lg">
          <h2 className="text-2xl font-black text-blue-600 mb-10 tracking-tighter">Chrysalis</h2>
          <nav className="space-y-6">
            <NavItem icon={<BookOpen />} label="Learning" active />
            <NavItem
              icon={<TrendingUp />}
              label="Market"
              onClick={() => setShowMarket(true)}
            />
            <NavItem icon={<ShoppingBag />} label="Shop" />
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 flex flex-col relative min-h-screen">
          <header className="sticky top-0 z-40 flex items-center justify-between md:justify-end px-6 py-4 bg-white/60 backdrop-blur-md">
            <h1 className="md:hidden text-xl font-black text-blue-600">Chrysalis</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white px-4 py-2 rounded-2xl shadow-sm border border-blue-100">
                <Coins className="text-yellow-500 mr-2 size-5" />
                <span className="font-bold">{coins}</span>
              </div>
              <button className="p-2 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl text-white shadow-lg">
                <User size={20} />
              </button>
            </div>
          </header>

          <div className="flex-1 px-4 pb-20 overflow-y-auto">
            {/* Increased container height for larger lilypads */}
            <div className="w-full relative min-h-[2000px] overflow-hidden pb-20">
              <div className="absolute inset-0 opacity-20" />
              
              <div className="absolute inset-0 pointer-events-none">
                <SquiggleVine 
                  className="w-full h-full"
                  progress={vineProgress}
                  strokeColor="#2D6A4F"
                />
              </div>

              {/* Lilypads with AI integration */}
              {LESSONS.map((lesson) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  status={getLessonStatus(lesson.id)}
                  onOpenAI={handleOpenAI}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Stock Market - Full Screen Slide */}
        <AnimatePresence>
          {showMarket && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-[100] bg-white overflow-hidden"
            >
              <StockMarket
                coins={coins}
                setCoins={setCoins}
                onClose={() => setShowMarket(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Lesson Overlay */}
        <AnimatePresence>
          {activeAILesson && (
            <AILessonOverlay
              lesson={activeAILesson}
              onClose={handleAIClose}
              onReward={handleAIReward}
              onComplete={handleLevelComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}