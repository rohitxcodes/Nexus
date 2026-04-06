import "../../App";
import "../../styles/index.css";
import { FaArrowCircleRight } from "react-icons/fa";
import Nav from "../../components/layout/Nav";
import Body from "../../components/layout/Body";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  // 1. Declare the sectionsRef as an empty array
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

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source
            src="Pixel Winter Landscape, Snowy Mountains, Retro Pixel Art, Peaceful Winter Forest.mp4"
            type="video/mp4"
          />
        </video>
        <Nav />

        <div style={{ color: "white" }}>
          {/* 2. Attach the ref to the parent container of your animate-item */}
          <div className="py-10" ref={(el) => (sectionsRef.current[0] = el)}>
            <div className="body gap-20 ">
              <div>
                <p className="body-text text-7xl">FUTURE-READY,</p>
                <p className="body-text text-7xl">SMART LEARNING</p>
              </div>
              <div className="flex gap-50">
                <Link to="/play">
                  <div className="buttons flex items-center gap-10">
                    <p className="text-center -tracking-tighter">Train</p>
                    <FaArrowCircleRight size={40} />
                  </div>
                </Link>
                <Link to="/Shop">
                  <div className="buttons flex items-center gap-5 tracking-wider">
                    <p className="text-center">Shop</p>
                    <FaArrowCircleRight size={40} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="animate-item">
            <Body />
          </div>
          {/* 3. (Optional) Attach the next ref index if you want to animate items here too */}
          <div
            className="wrapper pb-100"
            ref={(el) => (sectionsRef.current[1] = el)}
          >
            {/* If you add className="animate-item" to any element inside here, it will animate on scroll! */}
            <div className="box">
              <div>
                <p
                  className="text-black text-center text-6xl pt-10"
                  style={{ lineHeight: "1.5", letterSpacing: "10px" }}
                >
                  NEXUS IS BUILT ON{" "}
                </p>
              </div>
              <div className="px-100 py-20">
                <img src="Qualified.png" alt="" />
              </div>
              <div>
                <p className="text-black text-center text-2xl tracking-wider">
                  The world's most advanced coding assessment platform for{" "}
                  <br />
                  organizations looking to scale their hiring, upskilling, and{" "}
                  <br /> certification programs.
                </p>
              </div>
              <div className="p-20"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
