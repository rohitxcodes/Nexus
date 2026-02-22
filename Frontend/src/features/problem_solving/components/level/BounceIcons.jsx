
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
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
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
          <div className="flex flex-col items-start flex-1 gap-6 z-10 py-5 pl-8 lg:pl-30">
            
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
                    onClick={() => navigate(`/levels/${levelNumber}`)}
                    onMouseEnter={(e) =>
                      gsap.to(e.currentTarget, { scale: 1.2, duration: 0.3 })
                    }
                    onMouseLeave={(e) =>
                      gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })
                    }
                  >
                    <img
                      src={icon}
                      className="w-[100px]"
                      alt={`Level ${levelNumber}`}
                    />
                  </div>

                  {/* KNIGHT CONTAINER */}
                  {isThirdIcon && (
                    <div 
                      className="animate-item absolute left-[300px] top-[0%] cursor-pointer"
                      style={{
                        filter: "drop-shadow(0px 15px 10px rgba(0,0,0,0.5))",
                      }}
                      onMouseEnter={(e) =>
                        gsap.to(e.currentTarget, { scale: 1.2, duration: 0.3 })
                      }
                      onMouseLeave={(e) =>
                        gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })
                      } 
                    >
                      <img
                        src="/knight.png"
                        className="w-[150px] max-w-none translate-y-0 translate-x-5"
                        alt="Knight"
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
  );
}