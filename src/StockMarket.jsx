import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { ChevronLeft, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';


const StockMarket = ({ coins, setCoins, onClose }) => {
  const [stocks, setStocks] = useState([
    { id: 1, code: 'CHRY', name: 'Chrysalis Tech', price: 120, history: [], owned: 0 },
    { id: 2, code: 'VINE', name: 'Vineyard Grow', price: 85, history: [], owned: 0 },
    { id: 3, code: 'SEED', name: 'Seedling AI', price: 210, history: [], owned: 0 },
    { id: 4, code: 'FLWR', name: 'Flora Finance', price: 45, history: [], owned: 0 },
    { id: 5, code: 'ROOT', name: 'Root Security', price: 155, history: [], owned: 0 },
  ]);


  const [selectedStockId, setSelectedStockId] = useState(null);


  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => prevStocks.map(stock => {
        const change = (Math.random() - 0.5) * 8;
        const newPrice = Math.max(5, Math.round(stock.price + change));
        const newTime = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });


        const newHistory = [...(stock.history || []), { time: newTime, price: newPrice }].slice(-10);

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
    <div className="w-full h-full bg-slate-50 flex flex-col font-sans">


      <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center shadow-sm">
        <div>
          <button
            onClick={onClose}
            className="group flex items-center text-blue-500 font-bold mb-1 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Learning Vine
          </button>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Market Exchange</h2>
        </div>


        <div className="flex gap-4">
          <div className="bg-green-50 px-6 py-2 rounded-2xl border border-green-100">
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Available Balance</p>
            <p className="text-2xl font-black text-slate-800">💰{coins}</p>
          </div>
        </div>
      </div>



      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-4">Stock Ticker</th>
                <th className="px-8 py-4">Live Price</th>
                <th className="px-8 py-4">Your Portfolio</th>
                <th className="px-8 py-4 text-center">Market Trend</th>
                <th className="px-8 py-4 text-right">Execution</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {stocks.map((stock) => (
                <React.Fragment key={stock.id}>
                  <tr className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-800 text-lg">{stock.code}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{stock.name}</div>
                    </td>

                    <td className="px-8 py-6 font-mono font-bold text-slate-700 text-lg">
                      ${stock.price}
                    </td>


                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-slate-700">{stock.owned} Units</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Equity: ${stock.owned * stock.price}</div>
                    </td>


                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => setSelectedStockId(selectedStockId === stock.id ? null : stock.id)}
                        className={`p-3 rounded-2xl transition-all ${selectedStockId === stock.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <TrendingUp size={20} />
                      </button>
                    </td>


                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleTrade(stock.id, 'buy')}
                          className="px-6 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-slate-200"
                        >
                          BUY
                        </button>
                        <button
                          onClick={() => handleTrade(stock.id, 'sell')}
                          className="px-6 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-black rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          SELL
                        </button>
                      </div>
                    </td>
                  </tr>



                  {selectedStockId === stock.id && (
                    <tr>
                      <td colSpan="5" className="bg-slate-900 p-8">
                        <div className="h-80 w-full relative">
                          <div className="flex justify-between items-center mb-6">
                            <h4 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">{stock.name} Performance Analysis</h4>
                          </div>

                          <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={stock.history} margin={{ left: 20, right: 20, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                              <XAxis
                                dataKey="time"
                                stroke="#4a5568"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                              >
                                <Label value="Time (Last 10 updates)" position="insideBottom" offset={-15} fill="#718096" fontSize={12} fontWeight="bold" />
                              </XAxis>
                              <YAxis
                                stroke="#4a5568"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `$${val}`}
                              >
                                <Label value="Price (Coins)" angle={-90} position="insideLeft" fill="#718096" fontSize={12} fontWeight="bold" />
                              </YAxis>
                              <Tooltip
                                contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#60a5fa' }}
                              />
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#3b82f6"
                                strokeWidth={4}
                                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }}
                                isAnimationActive={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
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
