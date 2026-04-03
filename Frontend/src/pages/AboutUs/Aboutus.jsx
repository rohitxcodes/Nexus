import React from "react";
import Navbar from "../../components/layout/Nav";
import Rohit from "../../../public/avtar.png";

function AboutUs() {
  const teamMembers = [
    {
      name: "Om Aditya",
      role: "Senior Frontend Engineer",
      color: "#4C4C9D",
      image: "om.jpg",
      socials: {
        github: "https://github.com/omaditya073-wq",
        linkedin: "https://www.linkedin.com/in/om-aditya-pattnaik-184ab12a7/",
        email: "mailto:omaditya073@gmail.com ",
      },
    },
    {
      name: "Sujan Sahoo",
      role: "Junior Frontend Engineer",
      color: "#5E5E32",
      image: "sujan.jpg",
      socials: {
        github: "https://github.com/Sujan-Xs",
        linkedin: "https://www.linkedin.com/in/sujan-sahoo/",
        email: "mailto:sujansahoo27@gmail.com",
      },
    },
    {
      name: "Rohit Kumar",
      role: "Software Backend Engineer",
      color: "#007A99",
      image: Rohit,
      socials: {
        github: "https://github.com/rohitxcodes",
        linkedin: "www.linkedin.com/in/hixrohit",
        email: "mailto:rohitvis695@gmail.com",
      },
    },
    {
      name: "Onkar Raj",
      role: "Junior Backend Engineer",
      color: "#6B2D82",
      image: "onkar.jpg",
      socials: {
        github: "https://github.com/ONKARAJ",
        linkedin: "https://www.linkedin.com/in/onkar-raj-8a416334b/",
        email: "mailto:onkarraj976@gmail.com ",
      },
    },
  ];
  const Icons = {
    github: (
      <img
        src="../../../public/github.svg" // your image path
        alt="GitHub"
        className="w-[18px] h-[18px] object-contain"
      />
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M4 2h4v4H4V2zm0 6h4v14H4V8zm6 0h4v2h2c1-1 2-2 4-2 3 0 5 2 5 6v8h-4v-7c0-2-1-3-3-3s-3 1-3 3v7h-4V8z" />
      </svg>
    ),
    email: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M2 4h20v2H2V4zm0 4h2v2h2v2h2v2h4v-2h2v-2h2v-2h2v12H2V8zm4 4v2h2v-2H6zm10 0v2h2v-2h-2z" />
      </svg>
    ),
  };

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen px-5 py-10 text-white  md:py-14">
        <div className="fixed inset-0 bg-[url('/aboutUs_bg.png')] bg-cover bg-center -z-10"></div>

        <div className="relative mx-auto w-full max-w-screen-xl">
          <h1 className="text-center text-3xl font-bold uppercase tracking-[0.25em] text-white sm:text-4xl md:text-5xl pt-11">
            About Us
          </h1>

          <div className="relative mt-10 max-w-2xl mx-auto w-fit">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1123]/60 to-transparent rounded-xl"></div>

            <p className="relative rounded-xl p-6 text-sm leading-relaxed text-white/85 backdrop-blur-md md:text-base ">
              At Code Quest, we pioneer a new era of learning, blending the
              timeless honor and challenge of medieval quests with innovative
              educational adventures.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F1123]/60 to-transparent"></div>
              <div className="relative">
                <h2 className="w-full bg-white/10 px-6 py-3 text-xl font-semibold text-white md:text-2xl backdrop-blur-sm">
                  Who We Are
                </h2>
                <div className="p-5 md:p-6">
                  <p className="text-sm leading-relaxed text-white/85 md:text-base">
                    Code Quest is a dynamic educational platform designed for
                    the future, where learning is an epic quest. Our platform
                    transforms coding and problem-solving education into
                    immersive medieval adventures, making smart learning
                    engaging and fun.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F1123]/60 to-transparent"></div>

              <div className="relative">
                <h2 className="w-full bg-white/10 px-6 py-3 text-xl font-semibold text-white md:text-2xl backdrop-blur-sm">
                  Our Mission
                </h2>

                <div className="p-5 md:p-6">
                  <p className="text-sm leading-relaxed text-white/85 md:text-base">
                    Our mission is to empower learners with future-ready skills
                    through a gamified learning experience. By turning education
                    into an adventurous quest, we prepare learners to thrive in
                    the tech-driven world of tomorrow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "⚔️", text: "Innovative Training" },
              { icon: "🏰", text: "Engaging Experiences" },
              { icon: "🏆", text: "Achievement Focused" },
            ].map((item, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F1123]/60 to-transparent"></div>

                <div className="relative flex flex-col items-center justify-center p-5 text-center hover:scale-105 transition duration-300">
                  <div className="text-4xl sm:text-5xl">{item.icon}</div>
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-white sm:text-sm">
                    {item.text.split(" ")[0]} <br /> {item.text.split(" ")[1]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="min-h-screen px-5 py-[60px] text-white text-center font-arcade]">
        <h2 className="text-[3rem] mb-4 tracking-[4px] uppercase">
          Meet The Team
        </h2>

        <p className="text-[#ffffff] max-w-[600px] mx-auto mb-[80px] leading-relaxed font-arcade">
          The folks behind Code Quest.
          <br />
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10 max-w-[1100px] mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              {/* Folder Card */}
              <div className="bg-[#D9D9C3] pt-5 px-3 pb-2 relative border-r-[6px] border-b-[6px] border-black/20 w-[180px]">
                {/* Image Box */}
                <div
                  className="h-[160px] border-[4px] border-[#2D2D2D] flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: member.color }}
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover [image-rendering:pixelated]"
                    />
                  ) : (
                    <div className="text-[60px]">👤</div>
                  )}
                </div>

                {/* Name Tag */}
                <div className="flex items-center pt-3 pb-1 gap-2">
                  <div className="w-[10px] h-[10px] bg-[#FF4136] rounded-full shadow-[0_0_10px_#FF4136] border border-[#700]" />

                  <span className="text-[#2D2D2D] text-base whitespace-nowrap uppercase">
                    {member.name.split(" ")[0]}
                  </span>
                </div>
              </div>

              {/* Role */}
              <p className="mt-[15px] text-[0.9rem] font-medium opacity-90">
                {member.role}
              </p>

              {/* Social Icons */}
              <div className="flex gap-2.5 mt-3">
                <a
                  href={member.socials.github}
                  className="w-8 h-8 bg-[#2D2D44] border-2 border-[#4A4A6A] flex items-center justify-center text-[#A1A1C1] transition-all duration-200 hover:bg-[#4A4A6A] hover:text-white hover:-translate-y-[2px] hover:border-white"
                >
                  {Icons.github}
                </a>

                <a
                  href={member.socials.linkedin}
                  className="w-8 h-8 bg-[#2D2D44] border-2 border-[#4A4A6A] flex items-center justify-center text-[#A1A1C1] transition-all duration-200 hover:bg-[#4A4A6A] hover:text-white hover:-translate-y-[2px] hover:border-white"
                >
                  {Icons.linkedin}
                </a>

                <a
                  href={member.socials.email}
                  className="w-8 h-8 bg-[#2D2D44] border-2 border-[#4A4A6A] flex items-center justify-center text-[#A1A1C1] transition-all duration-200 hover:bg-[#4A4A6A] hover:text-white hover:-translate-y-[2px] hover:border-white"
                >
                  {Icons.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default AboutUs;
