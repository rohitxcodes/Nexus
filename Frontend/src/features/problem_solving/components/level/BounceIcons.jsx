import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BounceCards() {
  const sectionsRef = useRef([]);

  // PUBLIC assets → use URL only
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
    const triggers = [];

    sectionsRef.current.forEach((section) => {
      if (!section) return;

      const items = section.querySelectorAll(".animate-item");

      const animation = gsap.fromTo(
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

      triggers.push(animation);
    });

    // cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      triggers.forEach((a) => a.kill?.());
    };
  }, []);

  return (
    // 🔥 IMPORTANT: min-h-screen + overflow-y-auto → SCROLL ENABLED
    <div className="min-h-screen overflow-x-hidden overflow-y-auto">
      {iconSets.map((icons, sectionIndex) => (
        <section
          key={sectionIndex}
          ref={(el) => (sectionsRef.current[sectionIndex] = el)}
          className="flex flex-row items-start justify-between min-h-screen px-10 py-10 relative"
        >
          {/* left spacer */}
          <div className="hidden lg:block w-80" />

          {/* center content */}
          <div className="flex flex-col items-center flex-1 gap-6 z-10">
            {/* header card */}
            <div className="animate-item w-full max-w-[600px] bg-[#2937fa] rounded-xl px-6 py-3 shadow-[0_8px_0_#063e99] mb-5 flex items-center">
              <span className="text-xl text-white/40 font-bold mr-4">--</span>

              <div>
                <div className="text-lg font-bold text-blue-200 tracking-wide">
                  SECTION {sectionIndex + 1}, UNIT 1
                </div>

                <div className="text-sm font-bold text-blue-200 tracking-wide">
                  Form basic sentences
                </div>
              </div>
            </div>

            {/* icons */}
            {icons.map((icon, iconIndex) => {
              const isThirdIcon = iconIndex === 2;

              return (
                <div key={iconIndex} className="relative">
                  {/* main icon */}
                  <div
                    className="animate-item cursor-pointer z-10"
                    style={{
                      transform: transforms[iconIndex],
                      filter: "drop-shadow(0px 15px 10px rgba(0,0,0,0.5))",
                    }}
                    onMouseEnter={(e) =>
                      gsap.to(e.currentTarget, {
                        scale: 1.2,
                        duration: 0.6,
                        ease: "back.out(1.7)",
                      })
                    }
                    onMouseLeave={(e) =>
                      gsap.to(e.currentTarget, {
                        scale: 1,
                        duration: 0.6,
                        ease: "back.out(1.7)",
                      })
                    }
                  >
                    <img
                      src={icon}
                      alt={`icon-${iconIndex}`}
                      className="w-[100px]"
                    />
                  </div>

                  {/* special samurai */}
                  {isThirdIcon && (
                    <div
                      className="animate-item absolute left-[100px] top-[20%] w-[300px]"
                      onMouseEnter={(e) =>
                        gsap.to(e.currentTarget, {
                          scale: 1.2,
                          duration: 0.6,
                          ease: "back.out(1.7)",
                        })
                      }
                      onMouseLeave={(e) =>
                        gsap.to(e.currentTarget, {
                          scale: 1,
                          duration: 0.6,
                          ease: "back.out(1.7)",
                        })
                      }
                    >
                      <img
                        src="/samurai.png"
                        alt="samurai"
                        className="w-full drop-shadow-lg"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* right sticky sidebar */}
          <div className="sticky top-10 h-[600px] w-80 rounded-[40px] bg-white/30 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col items-center justify-start p-6">
            {/* logo */}
            <img src="/logo.png" alt="logo" className="w-48 mb-6" />
          </div>
        </section>
      ))}
    </div>
  );
}
