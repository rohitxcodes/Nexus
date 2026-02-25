import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Body = () => {
  const sectionsRef = useRef([]);

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
            stagger: 0.1, // This will make the items animate one after the other
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

  return (
    <>
      {/* SECTION 1: Attach ref to index 0 */}
      <div className="wrapper !pt-0 translate-y-50" ref={(el) => (sectionsRef.current[0] = el)}>
        <div className="box flex py-10 px-10">
          
          {/* Added "animate-item" to these child divs for the stagger effect */}
          <div className="ele flex animate-item">
            <div className="intro-text text-5xl text-center">
              <p className="text-black text-center">Streamline Your Coding</p>
            </div>
            <div className="mask">
              <img className="inset-y-3" src="gaming.png" alt="" />
            </div>
          </div>

          <div className="ele flex animate-item">
            <div className="mask">
              <img className="inset-y-3 h-full" src="interactinve.jpg" alt="" />
            </div>
            <div className="intro-text text-5xl text-center">
              <p className="text-black text-center">Interactive Education</p>
            </div>
          </div>

          <div className="ele flex animate-item">
            <div className="mask">
              <img className="inset-y-3 h-full" src="you.jpg" alt="" />
            </div>
            <div className="intro-text text-5xl text-center">
              <p className="text-black text-center">Rewarding Levels</p>
            </div>
          </div>

          <div className="ele flex animate-item">
            <div className="intro-text text-5xl text-center">
              <p className="text-black text-center">
                MULTIPLAYER <br />
                PLAY WITH FRIENDS
                <br />
                COMPETE <br />
                WIN AND <br />
                TOP THE TABLE
              </p>
            </div>
            <div className="">
              <img className="inset-y-3 w-100" src="leaderboard.png" alt="" />
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Attach ref to index 1 */}
      <div className="wrapper1 !pt-0 translate-y-50" ref={(el) => (sectionsRef.current[1] = el)}>
        
        {/* Added animate-item to the title so it pops in first */}
        <h1
          className="text-black text-8xl text-center py-10 animate-item"
          style={{ lineHeight: "1.5", letterSpacing: "10px" }}
        >
          HOW DOES NEXUS <br />
          HELP ME
        </h1>
        
        <div className="box flex px-40 py-20">
          <div className="contain w-200 flex">
            
            {/* Added animate-item to these boxes so they stagger in after the title */}
            <div className="use bg-black animate-item">
              <h1 className="bodytext py-5 text-center text-4xl">
                Personalized Learning Paths
              </h1>
              <p className="bodytext py-20 text-center text-2xl">
                Each user gets a guided journey based on their pace and
                strengths. Whether it’s coding, productivity, memory training,
                or any other skill, the platform adapts and provides customized
                challenges that fit their growth.
              </p>
            </div>

            <div className="use bg-black animate-item">
              <h1 className="bodytext py-5 text-center text-4xl">
                Personalized Learning Paths
              </h1>
              <p className="bodytext py-20 text-center text-2xl">
                Each user gets a guided journey based on their pace and
                strengths. Whether it’s coding, productivity, memory training,
                or any other skill, the platform adapts and provides customized
                challenges that fit their growth.
              </p>
            </div>

            <div className="use bg-black animate-item">
              <h1 className="bodytext py-5 text-center text-4xl">
                Personalized Learning Paths
              </h1>
              <p className="bodytext py-20 text-center text-2xl">
                Each user gets a guided journey based on their pace and
                strengths. Whether it’s coding, productivity, memory training,
                or any other skill, the platform adapts and provides customized
                challenges that fit their growth.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Body;