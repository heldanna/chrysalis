import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';

const StockMarket = ({ coins, setCoins, onClose }) => {
  const [sharesOwned, setSharesOwned] = useState(0);
  const [history, setHistory] = useState([
    { time: '10:00', price: 100 },
    { time: '10:01', price: 105 },
  ]);

  const currentPrice = history[history.length - 1].price;

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const lastPrice = prev[prev.length - 1].price;
        const change = (Math.random() - 0.5) * 10;
        const newPrice = Math.max(5, Math.round(lastPrice + change));
        return [...prev, { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), price: newPrice }].slice(-15);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl p-8 shadow-2xl relative border border-slate-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full">
          <X className="text-slate-500" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Market Simulator</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <p className="text-sm text-blue-600 font-medium">Balance</p>
            <p className="text-xl font-bold">💰{coins}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-2xl">
            <p className="text-sm text-purple-600 font-medium">Shares</p>
            <p className="text-xl font-bold">{sharesOwned}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-2xl">
            <p className="text-sm text-green-600 font-medium">Price</p>
            <p className="text-xl font-bold text-green-600">${currentPrice}</p>
          </div>
        </div>

        <div className="h-64 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="time" hide />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4">
          <button onClick={() => coins >= currentPrice ? (setCoins(coins - currentPrice), setSharesOwned(sharesOwned + 1)) : alert("Low funds!")} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">Buy</button>
          <button onClick={() => sharesOwned > 0 ? (setCoins(coins + currentPrice), setSharesOwned(sharesOwned - 1)) : null} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition-colors">Sell</button>
        </div>
      </div>
    </div>
  );
};

export default StockMarket;