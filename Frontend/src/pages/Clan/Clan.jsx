import React, { useEffect, useRef, useState } from "react";
import Bg from "../../../public/clan_bg.png";
import Navbar from "../../components/layout/Nav";
import ClanLeaderbord from "../../../public/clan-leaderbord-bg.png";

const initialChatMessages = [
  {
    tag: "[MOD]",
    tagClass: "text-amber-300",
    author: "Sir Arthur",
    text: "Ready for the raid?",
  },
  {
    tag: "[ELDER]",
    tagClass: "text-emerald-300",
    author: "Brian",
    text: "Kate, up for a duel?",
  },
  {
    tag: "[MEMBER]",
    tagClass: "text-teal-300",
    author: "Kate",
    text: "You're on, Brian! Let's do this!",
  },
];

const leaderboardMembers = [
  { name: "Sir Arthur", title: "Elder", level: 50, status: "ONLINE" },
  { name: "Galahad", title: "Member", level: 45, status: "ONLINE" },
  { name: "Brian", title: "Knight", level: 7, icon: "⚔️" },
  { name: "Kate", title: "Knight", level: 7, icon: "🛡️" },
];

function Clan() {
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [chatText, setChatText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = () => {
    const trimmed = chatText.trim();

    if (!trimmed) return;

    setChatMessages((currentMessages) => [
      ...currentMessages,
      {
        tag: "[YOU]",
        tagClass: "text-sky-300",
        author: "You",
        text: trimmed,
      },
    ]);
    setChatText("");
  };

  const handleChatKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <Navbar />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col px-3 pb-6 pt-20 text-[#f4e7d0] md:px-6 lg:px-10 lg:pt-24">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex flex-1 flex-col gap-6">
          <div className="grid gap-4 lg:grid-cols-[300px_1fr_340px] lg:items-start lg:gap-8">
            <div className="flex flex-col gap-4">
              <section className="mr-auto mt-5 translate-x-20 flex h-85 w-full max-w-70 flex-col overflow-hidden rounded-2xl  shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
                <div className="shrink-0   px-4 py-3 text-center shadow-inner">
                  <h2 className="text-lg font-black uppercase tracking-[0.16em] text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
                    Clan Chat
                  </h2>
                </div>

                <div className="flex min-h-0 flex-1 flex-col px-2.5 py-2.5 md:px-3">
                  <div className="flex min-h-0 flex-1 flex-col rounded-2xl border-[#c9ad8a]  p-3 shadow-[inset_0_0_0_1px_rgba(92,58,31,0.35)]">
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1 text-sm font-semibold leading-relaxed text-white">
                      {chatMessages.map((message) => (
                        <p key={`${message.tag}-${message.author}`}>
                          <span className={`font-black ${message.tagClass}`}>
                            {message.tag}
                          </span>{" "}
                          <span className="uppercase tracking-[0.05em]">
                            {message.author}:
                          </span>{" "}
                          {message.text}
                        </p>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="mt-4 shrink-0 grid grid-cols-[1fr_auto] gap-2">
                      <input
                        value={chatText}
                        onChange={(event) => setChatText(event.target.value)}
                        onKeyDown={handleChatKeyDown}
                        type="text"
                        placeholder="Type message..."
                        className="rounded-md border border-[#9e7c56] bg-[#efe0ca] px-3 py-2.5 text-sm text-[#4b3325] shadow-inner outline-none placeholder:text-[#8b6f52]"
                      />
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        className="rounded-md border border-[#9e7c56] bg-linear-to-b from-[#b48757] to-[#8f6339] px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-[#fff4de] shadow-[0_4px_0_rgba(80,50,22,0.7)] transition-transform hover:-translate-y-0.5"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <button
                className="relative z-20 self-end -mt-5 mr-2 w-fit bg-cover bg-center bg-no-repeat px-6 py-3 text-base font-black uppercase tracking-[0.14em] text-[#fff4de] shadow-[0_4px_0_rgba(80,50,22,0.7)] transition-transform duration-200 hover:scale-105"
                style={{ backgroundImage: `url(${ClanLeaderbord})` }}
              >
                1v1 Challenge
              </button>
            </div>
            <div
              className="hidden lg:block bg-transparent"
              aria-hidden="true"
            />

            <section className="h-[12rem] w-[98%] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.4)] lg:w-[90%] lg:-translate-x-16 lg:-translate-y-0.5 flex flex-col">
              <div
                className="bg-fit bg-center bg-no-repeat px-3 py-0.5 text-center shadow-inner"
                style={{ backgroundImage: `url(${ClanLeaderbord})` }}
              >
                <h2 className="text-lg font-black uppercase tracking-[0.16em] text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.55)] md:text-xl mt-1 ">
                  Clan Leaderboard
                </h2>
              </div>

              <div className="min-h-0 flex-1  px-1.5 py-1.5 md:px-2 md:py-1.5">
                <div className="h-full space-y-1 rounded-2xl  p-1.5 shadow-[inset_0_0_0_1px_rgba(92,58,31,0.35)] md:p-2">
                  {leaderboardMembers.slice(0, 3).map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between rounded-md px-2 py-1 text-xs text-white shadow-inner md:px-2.5 md:py-1.5 md:text-sm"
                    >
                      <div>
                        <p className="font-black uppercase tracking-[0.08em] leading-tight">
                          {member.name}
                        </p>
                        <p className="text-[9px] uppercase tracking-[0.1em] leading-tight text-white/75 md:text-[10px]">
                          {member.title} LvL {member.level}
                        </p>
                      </div>
                      <span className="text-sm font-black text-emerald-600 md:text-base">
                        {member.status || member.icon}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clan;
