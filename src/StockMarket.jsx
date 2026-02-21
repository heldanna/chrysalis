import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { X, TrendingUp } from 'lucide-react';

const StockMarket = ({ coins, setCoins, onClose }) => {
  const [stocks, setStocks] = useState([
    { id: 1, code: 'CHRY', name: 'Chrysalis Tech', price: 120, history: [{time: '12:00', price: 110}, {time: '12:01', price: 115}, {time: '12:02', price: 120}], owned: 0 },
    { id: 2, code: 'VINE', name: 'Vineyard Grow', price: 85, history: [{time: '12:00', price: 90}, {time: '12:01', price: 88}, {time: '12:02', price: 85}], owned: 0 },
    { id: 3, code: 'SEED', name: 'Seedling AI', price: 210, history: [{time: '12:00', price: 200}, {time: '12:01', price: 205}, {time: '12:02', price: 210}], owned: 0 },
  ]);

  const [selectedStockId, setSelectedStockId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => prevStocks.map(stock => {
        const change = (Math.random() - 0.5) * 8;
        const newPrice = Math.max(5, Math.round(stock.price + change));
        const newTime = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
        const newHistory = [...stock.history, { time: newTime, price: newPrice }].slice(-10);
        return { ...stock, price: newPrice, history: newHistory };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (id, type) => {
    const stock = stocks.find(s => s.id === id);
    if (type === 'buy' && coins >= stock.price) {
      setCoins(coins - stock.price);
      setStocks(stocks.map(s => s.id === id ? { ...s, owned: s.owned + 1 } : s));
    } else if (type === 'sell' && stock.owned > 0) {
      setCoins(coins + stock.price);
      setStocks(stocks.map(s => s.id === id ? { ...s, owned: s.owned - 1 } : s));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 font-sans">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl relative border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Financial Exchange</h2>
            <p className="text-slate-500 text-sm font-medium">Available Capital: <span className="text-green-600 font-bold">💰{coins} Coins</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all">
            <X className="text-slate-500" />
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-6 text-left">Asset</th>
                <th className="px-6 text-center">Analysis</th>
                <th className="px-6 text-left">Current Value</th>
                <th className="px-6 text-left">Your Holdings</th>
                <th className="px-6 text-right">Execution</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <React.Fragment key={stock.id}>
                  <tr className="bg-slate-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-blue-100 transition-all rounded-2xl">
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="font-black text-slate-700 text-lg">{stock.code}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{stock.name}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedStockId(selectedStockId === stock.id ? null : stock.id)}
                        className={`p-2 rounded-xl transition-all ${selectedStockId === stock.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-blue-500 shadow-sm'}`}
                      >
                        <TrendingUp size={20} />
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-600">${stock.price}</td>
                    <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{stock.owned} Shares</span>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-2xl">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleTrade(stock.id, 'buy')} className="px-4 py-2 bg-green-500 text-white text-xs font-black rounded-xl hover:bg-green-600 active:scale-95 transition-all">BUY</button>
                        <button onClick={() => handleTrade(stock.id, 'sell')} className="px-4 py-2 bg-slate-200 text-slate-600 text-xs font-black rounded-xl hover:bg-slate-300 active:scale-95 transition-all">SELL</button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* EXPANDED CHART SECTION */}
                  {selectedStockId === stock.id && (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-inner relative overflow-hidden">
                          <h3 className="text-blue-400 text-xs font-black mb-4 uppercase tracking-widest">{stock.name} Price Performance (Real-time)</h3>
                          
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={stock.history} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                                <XAxis 
                                  dataKey="time" 
                                  stroke="#718096" 
                                  fontSize={10} 
                                  tickLine={false} 
                                  axisLine={false}
                                >
                                  <Label value="Time (Last 10 Ticks)" offset={-10} position="insideBottom" fill="#4a5568" fontSize={11} fontWeight="bold" />
                                </XAxis>
                                <YAxis 
                                  stroke="#718096" 
                                  fontSize={10} 
                                  tickLine={false} 
                                  axisLine={false} 
                                  tickFormatter={(value) => `$${value}`}
                                >
                                  <Label value="Price (Coins)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#4a5568" fontSize={11} fontWeight="bold" />
                                </YAxis>
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '12px', color: '#fff' }}
                                  itemStyle={{ color: '#63b3ed', fontWeight: 'bold' }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="price" 
                                  stroke="#63b3ed" 
                                  strokeWidth={4} 
                                  dot={{ r: 4, fill: '#63b3ed', strokeWidth: 2, stroke: '#1a202c' }} 
                                  activeDot={{ r: 6, strokeWidth: 0 }}
                                  isAnimationActive={false} 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockMarket;