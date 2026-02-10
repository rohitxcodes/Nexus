import React, { useState, useRef } from "react";

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState(null);
  const gridRef = useRef(null);

  const goldItems = [
    { id: 1, name: "Strength", price: 400, icon: "/muscle.png", type: 'gold' },
    { id: 2, name: "Strength", price: 400, icon: "/muscle.png", type: 'gold' },
    { id: 3, name: "Strength", price: 400, icon: "/muscle.png", type: 'gold' },
    { id: 4, name: "Strength", price: 400, icon: "/muscle.png", type: 'gold' },
    { id: 5, name: "Strength", price: 400, icon: "/muscle.png", type: 'gold' },
  ];

  const cashItems = [
    { id: 6, name: "Speed", price: 10, icon: "/speed_boost.png", type: 'cash' },
    { id: 7, name: "Speed", price: 10, icon: "/speed_boost.png", type: 'cash' },
    { id: 8, name: "Speed", price: 10, icon: "/speed_boost.png", type: 'cash' },
    { id: 9, name: "Speed", price: 10, icon: "/speed_boost.png", type: 'cash' },
    { id: 10, name: "Speed", price: 10, icon: "/speed_boost.png", type: 'cash' },
  ];

  const handleCurrencyClick = (type) => {
    setActiveTab(type);

    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const currentItems = activeTab === 'gold' ? goldItems : cashItems;

  return (
    <div className="min-h-screen bg-[#333] flex flex-col">
      
      <div className="relative h-screen flex-shrink-0 flex items-center justify-center bg-[url('/shop_bg.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center font-arcade px-6 py-4 bg-transparent">
          <h1 className="text-white text-[80px] md:text-[50px] tracking-[0.35em] leading-tight mb-20 pixel-outline">
            WELCOME&nbsp;TO<br />THE&nbsp;SHOP
          </h1>
          <p className="text-white text-[52px] md:text-[40px] tracking-[0.3em] pixel-outline">
            ITS&nbsp;NOT&nbsp;CHEATING&nbsp;IF&nbsp;YOU&nbsp;PAY
          </p>
        </div>
      </div>

      <div className="w-full bg-[#d9ab7b] border-y-4 border-[#5d4037] p-4 flex justify-between items-center font-arcade sticky top-0 z-20">
        <div className="flex items-center gap-4 text-white text-3xl pixel-outline">
          <img src="/logo.png" alt="logo" className="w-50 h-16" />
        </div>
        <div className="flex gap-10">
          <button 
            onClick={() => handleCurrencyClick('gold')}
            className={`transition-all cursor-pointer active:translate-y-1 bg-[#d9ab7b]`}
          >
            <img src="/gold.png" alt="gold" className="w-15 h-15" />
          </button>
          <button 
            onClick={() => handleCurrencyClick('cash')}
            className={`transition-all cursor-pointer active:translate-y-1 bg-[#d9ab7b]`}
          >
            <img src="/cash.png" alt="cash" className="w-19 h-19" />
          </button>
        </div>
      </div>
      <div ref={gridRef} className="bg-[#8c5a45] min-h-[60vh] flex flex-col items-center">
        {activeTab ? (
          <div className="w-full max-w-6xl p-10 animate-in fade-in zoom-in duration-300">
            <h2 className="text-white font-arcade text-3xl mb-8 pixel-outline uppercase">
              {activeTab} Store
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#d3d3d3] border-4 border-white/30 flex flex-col items-center justify-between p-4 aspect-[3/4] shadow-lg hover:scale-105 transition-transform"
                >
                  <div className="flex-1 flex items-center">
                    <img src={item.icon} alt={item.name} className="w-24 h-24" />
                  </div>
                  <button className="bg-[#e4b652] hover:bg-[#d4a642] transition-colors w-full py-2 border-2 border-[#b38b32] flex justify-center items-center gap-2 font-arcade text-xl">
                    {item.price} 
                    <img 
                      src={item.type === 'gold' ? '/gold.png' : '/cash.png'} 
                      className="w-5 h-5" 
                      alt="currency"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-40 text-[#5d4037] font-arcade text-5xl opacity-60">
            SELECT A CURRENCY TO BROWSE ITEMS
          </div>
        )}
      </div>
      
    </div>
  );
}