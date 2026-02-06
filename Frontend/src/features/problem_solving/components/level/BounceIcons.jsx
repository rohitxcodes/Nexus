import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BounceIcons() {
  const sectionsRef = useRef([]);
  const navigate = useNavigate();

  // PUBLIC assets
  const iconSets = [
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
    ["/icon.png", "/icon.png", "/icon.png", "/icon.png", "/icon.png"],
  ];

  const transforms = [
    "translateX(0px)",
    "translateX(-125px)",
    "translateX(-250px)",
    "translateX(-125px)",
    "translateX(0px)",
  ];

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      if (!section) return;

      const items = section.querySelectorAll(".animate-item");

      gsap.fromTo(
        items,
        { opacity: 0, y: 100, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {iconSets.map((icons, sectionIndex) => (
        <section
          key={sectionIndex}
          ref={(el) => (sectionsRef.current[sectionIndex] = el)}
          className="flex flex-row items-start justify-between min-h-screen px-10 py-10 relative"
        >
          <div className="hidden lg:block w-80" />

          <div className="flex flex-col items-center flex-1 gap-6 z-10">
            {/* section header */}
            <div className="animate-item w-full max-w-[600px] bg-[#2937fa] rounded-xl px-6 py-3 shadow-[0_8px_0_#063e99] mb-5 flex items-center">
              <span className="text-xl text-white/40 font-bold mr-4">--</span>
              <div className="text-lg font-bold text-blue-200">
                SECTION {sectionIndex + 1}
              </div>
            </div>

            {/* icons */}
            {icons.map((icon, iconIndex) => {
              const levelNumber = sectionIndex * 5 + iconIndex + 1;

              return (
                <div key={iconIndex} className="relative">
                  <div
                    className="animate-item cursor-pointer"
                    style={{
                      transform: transforms[iconIndex],
                      filter: "drop-shadow(0px 15px 10px rgba(0,0,0,0.5))",
                    }}
                    onClick={() => navigate(`/levels/${levelNumber}`)}
                    onMouseEnter={(e) =>
                      gsap.to(e.currentTarget, { scale: 1.2, duration: 0.5 })
                    }
                    onMouseLeave={(e) =>
                      gsap.to(e.currentTarget, { scale: 1, duration: 0.5 })
                    }
                  >
                    <img
                      src={icon}
                      className="w-[100px]"
                      alt={`Level ${levelNumber}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
