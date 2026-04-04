import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Nav";
import Bg from "../../../public/shop_bg.png";
import Border from "../../../public/Shop_card_border.png";
import Aihint from "../../../public/Ai-hint.png";
import SkipALevel from "../../../public/skip-level.png";
import DoubleXP from "../../../public/double-xp.png";
import AiDebug from "../../../public/Ai-debugging.png";
import { API_BASE } from "../../utils/api";
import { getToken } from "../../utils/storage";
function ShopPage() {
  const [currency, setCurrency] = useState({ gold: 0, cash: 0 });

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const user = data?.user || {};

        const pick = (...values) => {
          for (const value of values) {
            if (Number.isFinite(Number(value))) return Number(value);
          }
          return 0;
        };

        setCurrency({
          gold: pick(user.gold, user.coins, user.coinBalance, user.walletGold),
          cash: pick(user.cash, user.credits, user.balance, user.walletCash),
        });
      } catch {
        // Keep defaults if profile fetch fails.
      }
    };

    loadCurrency();
  }, []);

  const items = [
    {
      title: "AI HINT",
      desc: "Get an AI-powered hint to help solve the level.",
      price: 50,
      type: "gold",
      icon: Aihint,
    },
    {
      title: "AI DEBUGGING",
      desc: "Let AI debug your code for you.",
      price: 75,
      type: "cash",
      icon: AiDebug,
    },
    {
      title: "DOUBLE XP",
      desc: "Earn double XP for one hour.",
      price: 75,
      type: "cash",
      icon: DoubleXP,
    },
    {
      title: "SKIP A LEVEL",
      desc: "Instantly skip the current level.",
      price: 100,
      type: "gold",
      icon: SkipALevel,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen text-white pt-20">
        <div
          className="absolute inset-0 bg-cover bg-[center_top_-40px] -z-10"
          style={{ backgroundImage: `url(${Bg})` }}
        ></div>
        <h1 className="absolute top-24 left-1/2 -translate-x-1/2 text-4xl md:text-6xl font-bold tracking-widest -mt-9">
          SHOP
        </h1>

        <div className="absolute left-[39%] top-[77%] z-30 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black-4 bg-black/10 px-5 py-4 text-base shadow-lg backdrop-blur-sm md:left-[37%] md:top-[77%] md:px-6 md:py-4 md:text-lg lg:left-[36%] lg:top-[76%]">
          <p className="font-bold tracking-wide text-yellow-300">
            YOUR CURRENCY
          </p>
          <div className="mt-2 flex items-center gap-5 font-semibold">
            <span className="text-yellow-200">💰 {currency.gold}</span>
            <span className="text-emerald-200">💵 {currency.cash}</span>
          </div>
        </div>

        {/* Items */}
        <div className="mt-32 ml-auto mr-4 w-fit px-2 grid grid-cols-2 grid-rows-2 gap-2 max-w-4xl md:mt-10 md:mr-10 md:px-0 lg:mr-16">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative w-full aspect-[4/5] max-w-[340px] mx-auto"
            >
              {/* Border Image (FULL FILL) */}
              <img
                src={Border}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 z-0 h-full w-full object-fill"
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full px-5 py-6 text-center">
                {/* Top - Icon */}
                <div className="flex justify-center">
                  <img
                    src={item.icon}
                    alt=""
                    className="h-35 w-35 p-0 mt-3 object-contain"
                  />
                </div>

                {/* Middle - Text */}
                <div className="mt-2">
                  <h2 className="text-xl font-bold -mt-10 tracking-wide">
                    {item.title}
                  </h2>

                  <p className="text-xs text-white/80 mt-1 leading-snug px-3 break-words text-center max-w-[180px] mx-auto">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom - Price + Button */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold bg-yellow-500/90 text-black px-3 py-1 rounded-md shadow-md">
                    {item.type === "gold" ? "💰" : "💵"}
                    {item.price}
                  </div>

                  <button className="px-5 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded-md font-semibold text-sm  -mt-1">
                    BUY
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ShopPage;
