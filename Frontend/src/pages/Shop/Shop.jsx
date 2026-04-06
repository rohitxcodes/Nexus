import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Nav";
import Bg from "../../../public/shop_bg.png";
import Border from "../../../public/Shop_card_border.png";
import Aihint from "../../../public/Ai-hint.png";
import SkipALevel from "../../../public/skip-level.png";
import DoubleXP from "../../../public/double-xp.png";
import AiDebug from "../../../public/Ai-debugging.png";
import { API_BASE } from "../../utils/api";

const fetchJSON = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

function ShopPage() {
  const [currency, setCurrency] = useState({ xp: 0, cash: 0 });
  const [activeItem, setActiveItem] = useState("");
  const [resultText, setResultText] = useState("");
  const [xpError, setXpError] = useState(null);

  const loadCurrency = async () => {
    const [meData, cashData] = await Promise.all([
      fetchJSON(`${API_BASE}/api/auth/me`, { method: "GET" }),
      fetchJSON(`${API_BASE}/api/shop/cash`, { method: "GET" }),
    ]);

    setCurrency({
      xp: Number(meData?.user?.totalXP || 0),
      cash: Number(cashData?.cash || 0),
    });
  };

  const handleBuy = async (item) => {
    if (item.type === "xp" && currency.xp < item.price) {
      setXpError({
        itemTitle: item.title,
        requiredXP: item.price,
        currentXP: currency.xp,
      });
      setResultText("");
      return;
    }

    setActiveItem(item.title);
    setResultText("");

    try {
      if (item.key === "hint") {
        const data = await fetchJSON(`${API_BASE}/api/shop/hint`, {
          method: "POST",
        });

        setResultText(data.message || "Hint purchased successfully");
      }

      if (item.key === "debug") {
        const data = await fetchJSON(`${API_BASE}/api/shop/debug`, {
          method: "POST",
        });

        setResultText(data.message || "AI Debugging purchased");
      }

      if (item.key === "doubleXp") {
        const data = await fetchJSON(`${API_BASE}/api/shop/double-xp`, {
          method: "POST",
        });
        setResultText(data.message || "Double XP purchased");
      }

      if (item.key === "skip") {
        const data = await fetchJSON(`${API_BASE}/api/shop/skip-level`, {
          method: "POST",
        });
        setResultText(data.message || "Level skipped");
      }

      await loadCurrency();
    } catch (err) {
      setResultText(err.message || "Purchase failed");
    } finally {
      setActiveItem("");
    }
  };

  useEffect(() => {
    loadCurrency();
  }, []);

  const items = [
    {
      key: "hint",
      title: "AI HINT",
      desc: "Get an AI-powered hint to help solve the level.",
      price: 50,
      type: "xp",
      icon: Aihint,
    },
    {
      key: "debug",
      title: "AI DEBUGGING",
      desc: "Let AI debug your code for you.",
      price: 75,
      type: "xp",
      icon: AiDebug,
    },
    {
      key: "doubleXp",
      title: "DOUBLE XP",
      desc: "Earn double XP rewards for the next 2 rounds.",
      price: 75,
      type: "xp",
      icon: DoubleXP,
    },
    {
      key: "skip",
      title: "SKIP A LEVEL",
      desc: "Instantly skip the current level.",
      price: 100,
      type: "xp",
      icon: SkipALevel,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen text-white pt-20">
        <div
          className="absolute inset-0 bg-cover bg-position-[center_top_-40px] -z-10"
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
            <span className="text-yellow-200">⭐ {currency.xp} XP</span>
            <span className="text-emerald-200">💵 {currency.cash}</span>
          </div>
          {resultText ? (
            <p className="mt-3 max-w-65 text-xs text-white/90">{resultText}</p>
          ) : null}
        </div>

        {/* Items */}
        <div className="mt-32 ml-auto mr-4 w-fit px-2 grid grid-cols-2 grid-rows-2 gap-2 max-w-4xl md:mt-10 md:mr-10 md:px-0 lg:mr-16">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative w-full aspect-4/5 max-w-85 mx-auto"
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

                  <p className="text-xs text-white/80 mt-1 leading-snug px-3 wrap-break-word text-center max-w-45 mx-auto">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom - Price + Button */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold bg-yellow-500/90 text-black px-3 py-1 rounded-md shadow-md">
                    {item.type === "xp" ? "⭐" : "💵"}
                    {item.price}
                  </div>

                  <button
                    className="px-5 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded-md font-semibold text-sm -mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => handleBuy(item)}
                    disabled={activeItem === item.title}
                  >
                    {activeItem === item.title ? "BUYING..." : "BUY"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {xpError ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4">
            <div className="w-full max-w-md rounded-xl border border-red-400/40 bg-[#1a0f0f] p-5 text-white shadow-2xl">
              <h2 className="text-xl font-bold text-red-300">Not enough XP</h2>
              <p className="mt-3 text-sm text-red-100/95">
                You need {xpError.requiredXP} XP to buy {xpError.itemTitle}, but
                you currently have {xpError.currentXP} XP.
              </p>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setXpError(null)}
                  className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default ShopPage;
