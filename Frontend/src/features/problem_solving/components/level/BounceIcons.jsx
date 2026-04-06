import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { API_BASE } from "../../../../utils/api";

gsap.registerPlugin(ScrollTrigger);

export default function BounceIcons() {
  const sectionsRef = useRef([]);
  const navigate = useNavigate();
  const [selectionModal, setSelectionModal] = useState({
    open: false,
    levelNumber: null,
    options: [],
    selected: [],
  });

  const shopItems = [
    { key: "hint", label: "AI Hint" },
    { key: "debug", label: "AI Debugging" },
    { key: "doubleXp", label: "Double XP" },
    { key: "skip", label: "Skip Level" },
  ];

  // PUBLIC assets
  const iconSets = [
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
  ];

  // CHANGED: Made values positive so the islands zig-zag to the RIGHT,
  // keeping them away from the left sidebar.
  const transforms = [
    "translateX(250px)",
    "translateX(125px)",
    "translateX(0px)",
    "translateX(125px)",
    "translateX(250px)",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validSections = sectionsRef.current.filter(Boolean);

      validSections.forEach((section) => {
        const items = section.querySelectorAll(".animate-item");

        gsap.fromTo(
          items,
          { opacity: 0, y: 100, scale: 0.5 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const handleLevelClick = (levelNumber) => {
    const loadPurchases = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load user data");
        }

        const allPurchases =
          data?.user?.purchases && typeof data.user.purchases === "object"
            ? data.user.purchases
            : {};

        const totalPurchases = Object.values(allPurchases).reduce(
          (acc, levelBucket) => {
            if (!levelBucket || typeof levelBucket !== "object") return acc;

            acc.hint += Number(levelBucket.hint || 0);
            acc.debug += Number(levelBucket.debug || 0);
            acc.doubleXp += Number(levelBucket.doubleXp || 0);
            acc.skip += Number(levelBucket.skip || 0);
            return acc;
          },
          { hint: 0, debug: 0, doubleXp: 0, skip: 0 },
        );

        const options = shopItems.map((item) => ({
          itemKey: item.key,
          count: Number(totalPurchases[item.key] || 0),
          label: item.label,
        }));

        setSelectionModal({
          open: true,
          levelNumber,
          options,
          selected: [],
        });
      } catch {
        navigate(`/levels/${levelNumber}`);
      }
    };

    loadPurchases();
  };

  const toggleSelectedItem = (itemKey) => {
    setSelectionModal((prev) => {
      const count = Number(
        prev.options.find((option) => option.itemKey === itemKey)?.count || 0,
      );
      if (count <= 0) return prev;

      const alreadySelected = prev.selected.includes(itemKey);
      return {
        ...prev,
        selected: alreadySelected
          ? prev.selected.filter((key) => key !== itemKey)
          : [...prev.selected, itemKey],
      };
    });
  };

  const handleStartLevel = () => {
    const { levelNumber, selected } = selectionModal;
    if (!levelNumber) return;

    const selectedItemLabels = selected.map(
      (itemKey) =>
        selectionModal.options.find((option) => option.itemKey === itemKey)
          ?.label || itemKey,
    );

    setSelectionModal({
      open: false,
      levelNumber: null,
      options: [],
      selected: [],
    });
    navigate(`/levels/${levelNumber}`, {
      state: { selectedShopItems: selectedItemLabels },
    });
  };
  return (
    <>
      <div className="min-h-screen overflow-x-hidden! overflow-y-hidden bg-blue-50/10">
        {iconSets.map((icons, sectionIndex) => (
          <section
            key={sectionIndex}
            ref={(el) => (sectionsRef.current[sectionIndex] = el)}
            className="flex flex-row items-start justify-between min-h-screen relative"
          >
            {/* Spacer for the left sidebar */}
            <div className="hidden lg:block w-80 shrink-0" />

            {/* CHANGED: 
                1. items-center -> items-start (moves content to the left)
                2. Added pl-8 lg:pl-16 to give it breathing room from the sidebar 
            */}
            <div className="flex flex-col items-start flex-1 gap-6 z-10 py-3 pl-8 lg:pl-30">
              {/* section header */}
              <div className="animate-item w-full max-w-150 bg-[#2937fa] rounded-xl px-9 py-3 shadow-[0_8px_0_#063e99] mb-5 flex items-center">
                <span className="text-xl text-white/40 font-bold mr-4">--</span>
                <div className="text-lg font-bold text-blue-200">
                  SECTION {sectionIndex + 1}
                </div>
              </div>

              {/* icons */}
              {icons.map((icon, iconIndex) => {
                const levelNumber = sectionIndex * 5 + iconIndex + 1;
                const isThirdIcon = iconIndex === 2;

                return (
                  <div
                    key={iconIndex}
                    className="relative flex items-center justify-center"
                    style={{ transform: transforms[iconIndex] }}
                  >
                    {/* ICON CONTAINER */}
                    <div
                      className="animate-item cursor-pointer relative group"
                      style={{
                        filter: "drop-shadow(0px 15px 10px rgba(0,0,0,0.5))",
                      }}
                      onClick={() => handleLevelClick(levelNumber)}
                      onMouseEnter={(e) =>
                        gsap.to(e.currentTarget, { scale: 1.2, duration: 0.3 })
                      }
                      onMouseLeave={(e) =>
                        gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })
                      }
                    >
                      <img
                        src={icon}
                        className="w-25"
                        alt={`Level ${levelNumber}`}
                      />
                    </div>

                    {/* KNIGHT CONTAINER */}
                    {isThirdIcon && (
                      <div
                        className="animate-item absolute left-75 top-[0%] cursor-pointer"
                        style={{
                          transform: `translate(${transforms[iconIndex] + 180}px, 0px)`,
                          filter: "drop-shadow(0px 15px 10px rgba(0,0,0,0.5))",
                        }}
                        onClick={() => navigate(`/profile`)}
                        onMouseEnter={(e) =>
                          gsap.to(e.currentTarget, {
                            scale: 1.2,
                            duration: 0.3,
                          })
                        }
                        onMouseLeave={(e) =>
                          gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })
                        }
                      >
                        <img
                          src="/samurai.png"
                          className="w-50 max-w-none translate-y-0 translate-x-5"
                          alt="Samurai"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {selectionModal.open ? (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-xl border border-blue-300/30 bg-[#0b1a3f] p-6 text-white shadow-2xl">
            <h3 className="text-2xl font-bold tracking-wide">
              Use Shop Items for Level {selectionModal.levelNumber}
            </h3>
            <p className="mt-2 text-sm text-blue-100/85">
              Select the purchased items you want to use for this level.
            </p>

            <div className="mt-4 space-y-3">
              {selectionModal.options.map((option) => {
                const checked = selectionModal.selected.includes(
                  option.itemKey,
                );
                const canUse = Number(option.count) > 0;
                return (
                  <label
                    key={option.itemKey}
                    className="flex items-center justify-between rounded-lg border border-white/20 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold">{option.label}</p>
                      <p className="text-xs text-blue-100/80">
                        Owned: {option.count}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelectedItem(option.itemKey)}
                      disabled={!canUse}
                      className="h-4 w-4"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-white/25 px-4 py-2 text-sm"
                onClick={() => {
                  setSelectionModal({
                    open: false,
                    levelNumber: null,
                    options: [],
                    selected: [],
                  });
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
                onClick={handleStartLevel}
              >
                Start Level
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
