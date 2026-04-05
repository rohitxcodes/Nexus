import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Bg from "../../../public/clan_bg.png";
import Navbar from "../../components/layout/Nav";
import ClanLeaderbord from "../../../public/clan-leaderbord-bg.png";
import { API_BASE } from "../../utils/api";
import { getToken } from "../../utils/storage";

const initialChatMessages = [
  {
    id: "seed-1",
    tag: "[MOD]",
    tagClass: "text-amber-300",
    author: "Sir Arthur",
    text: "Ready for the raid?",
  },
  {
    id: "seed-2",
    tag: "[ELDER]",
    tagClass: "text-emerald-300",
    author: "Brian",
    text: "Kate, up for a duel?",
  },
  {
    id: "seed-3",
    tag: "[MEMBER]",
    tagClass: "text-teal-300",
    author: "Kate",
    text: "You're on, Brian! Let's do this!",
  },
];

const defaultLeaderboardMembers = [
  { name: "Sir Arthur", title: "Elder", level: 50, status: "ONLINE" },
  { name: "Galahad", title: "Member", level: 45, status: "ONLINE" },
  { name: "Brian", title: "Knight", level: 7, icon: "⚔️" },
  { name: "Kate", title: "Knight", level: 7, icon: "🛡️" },
];

function Clan() {
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [chatText, setChatText] = useState("");
  const [activeClanId, setActiveClanId] = useState(null);
  const [chatError, setChatError] = useState("");
  const [leaderboardMembers, setLeaderboardMembers] = useState(
    defaultLeaderboardMembers,
  );
  const [showClanPopup, setShowClanPopup] = useState(false);
  const [clanPopupStep, setClanPopupStep] = useState("choice");
  const [creatingName, setCreatingName] = useState("");
  const [creatingDescription, setCreatingDescription] = useState("");
  const [joiningClanId, setJoiningClanId] = useState("");
  const [clanPopupMessage, setClanPopupMessage] = useState("");
  const [isSubmittingClanAction, setIsSubmittingClanAction] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const checkClanMembership = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/clans/mine`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          setShowClanPopup(true);
          setActiveClanId(null);
          return;
        }

        const data = await res.json().catch(() => ({}));
        const members = Array.isArray(data?.members) ? data.members : [];
        const clanId = data?.clan?._id || null;

        setActiveClanId(clanId);

        if (members.length > 0) {
          setLeaderboardMembers(
            members.map((member) => ({
              name: member.username || member.name || "Member",
              title: member.rank ? `Rank ${member.rank}` : "Member",
              level: Number(member.currentLevel || member.level || 1),
              status: Number.isFinite(Number(member.totalXP))
                ? `${Number(member.totalXP)} XP`
                : "ONLINE",
            })),
          );
        }

        setShowClanPopup(false);
      } catch {
        // If the check fails, default to showing options so the user can proceed.
        setShowClanPopup(true);
        setActiveClanId(null);
      }
    };

    checkClanMembership();
  }, []);

  useEffect(() => {
    const loadChatHistoryAndConnect = async () => {
      if (!activeClanId) return;

      try {
        const token = getToken();
        const historyRes = await fetch(
          `${API_BASE}/api/chat/${activeClanId}/history`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );

        if (historyRes.ok) {
          const historyData = await historyRes.json().catch(() => ({}));
          const messages = Array.isArray(historyData?.messages)
            ? historyData.messages
            : [];

          setChatMessages(
            messages.map((message) => ({
              id:
                message?._id ||
                `${message?.sender?.username || "user"}-${message?.createdAt || Date.now()}`,
              tag: "[CLAN]",
              tagClass: "text-sky-300",
              author: message?.sender?.username || "Member",
              text: message?.content || "",
            })),
          );
        }
      } catch {
        // Keep existing chat state if history load fails.
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = io(API_BASE, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("chat:join", { clanId: activeClanId });
      });

      socket.on("chat:message", (message) => {
        setChatMessages((currentMessages) => [
          ...currentMessages,
          {
            id: message?._id || `live-${Date.now()}`,
            tag: "[CLAN]",
            tagClass: "text-sky-300",
            author: message?.sender?.username || "Member",
            text: message?.content || "",
          },
        ]);
      });

      socket.on("chat:error", (payload) => {
        setChatError(payload?.message || "Chat error");
      });
    };

    loadChatHistoryAndConnect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [activeClanId]);

  const handleSendMessage = () => {
    const rawText = chatText;

    if (!rawText.trim()) return;

    if (!socketRef.current || !activeClanId) {
      setChatError("Chat is not connected yet.");
      return;
    }

    socketRef.current.emit("chat:send", {
      clanId: activeClanId,
      content: rawText,
    });

    setChatText("");
  };

  const handleChatKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateClan = async () => {
    if (!creatingName.trim()) {
      setClanPopupMessage("Clan name is required.");
      return;
    }

    setIsSubmittingClanAction(true);
    setClanPopupMessage("");

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/clans`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: creatingName.trim(),
          description: creatingDescription.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setClanPopupMessage(data?.message || "Failed to create clan.");
        return;
      }

      setShowClanPopup(false);
    } catch {
      setClanPopupMessage("Failed to create clan. Please try again.");
    } finally {
      setIsSubmittingClanAction(false);
    }
  };

  const handleJoinClan = async () => {
    if (!joiningClanId.trim()) {
      setClanPopupMessage("Clan ID is required.");
      return;
    }

    setIsSubmittingClanAction(true);
    setClanPopupMessage("");

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/clans/request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ clanId: joiningClanId.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setClanPopupMessage(data?.message || "Failed to send join request.");
        return;
      }

      setShowClanPopup(false);
    } catch {
      setClanPopupMessage("Failed to send join request. Please try again.");
    } finally {
      setIsSubmittingClanAction(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <Navbar />

      {showClanPopup ? (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#c9ad8a] bg-[#1f2436]/95 p-5 text-[#f4e7d0] shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
            <h2 className="text-center text-2xl font-black uppercase tracking-[0.12em] text-yellow-300">
              Clan Required
            </h2>

            {clanPopupStep === "choice" ? (
              <div className="mt-5 space-y-3">
                <p className="text-center text-sm text-white/90">
                  You are not in a clan yet. Choose an action.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setClanPopupStep("join");
                    setClanPopupMessage("");
                  }}
                  className="w-full rounded-md border border-[#9e7c56] bg-[#2d3650] px-4 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-[#fff4de] transition hover:brightness-110"
                >
                  Join Clan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClanPopupStep("create");
                    setClanPopupMessage("");
                  }}
                  className="w-full rounded-md border border-[#9e7c56] bg-[#3b2f1f] px-4 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-[#fff4de] transition hover:brightness-110"
                >
                  Create Clan
                </button>
              </div>
            ) : null}

            {clanPopupStep === "create" ? (
              <div className="mt-5 space-y-3">
                <input
                  type="text"
                  value={creatingName}
                  onChange={(event) => setCreatingName(event.target.value)}
                  placeholder="Clan name"
                  className="w-full rounded-md border border-[#9e7c56] bg-[#efe0ca] px-3 py-2 text-sm text-[#4b3325] outline-none"
                />
                <input
                  type="text"
                  value={creatingDescription}
                  onChange={(event) =>
                    setCreatingDescription(event.target.value)
                  }
                  placeholder="Description (optional)"
                  className="w-full rounded-md border border-[#9e7c56] bg-[#efe0ca] px-3 py-2 text-sm text-[#4b3325] outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setClanPopupStep("choice");
                      setClanPopupMessage("");
                    }}
                    className="rounded-md border border-white/30 bg-transparent px-3 py-2 text-xs font-bold uppercase tracking-widest text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingClanAction}
                    onClick={handleCreateClan}
                    className="rounded-md border border-[#9e7c56] bg-[#3b2f1f] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#fff4de] disabled:opacity-60"
                  >
                    {isSubmittingClanAction ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            ) : null}

            {clanPopupStep === "join" ? (
              <div className="mt-5 space-y-3">
                <input
                  type="text"
                  value={joiningClanId}
                  onChange={(event) => setJoiningClanId(event.target.value)}
                  placeholder="Enter Clan ID"
                  className="w-full rounded-md border border-[#9e7c56] bg-[#efe0ca] px-3 py-2 text-sm text-[#4b3325] outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setClanPopupStep("choice");
                      setClanPopupMessage("");
                    }}
                    className="rounded-md border border-white/30 bg-transparent px-3 py-2 text-xs font-bold uppercase tracking-widest text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingClanAction}
                    onClick={handleJoinClan}
                    className="rounded-md border border-[#9e7c56] bg-[#2d3650] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#fff4de] disabled:opacity-60"
                  >
                    {isSubmittingClanAction ? "Joining..." : "Send Request"}
                  </button>
                </div>
              </div>
            ) : null}

            {clanPopupMessage ? (
              <p className="mt-3 text-center text-xs text-rose-300">
                {clanPopupMessage}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

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
                      {chatMessages.map((message, index) => (
                        <p
                          key={message.id || `${message.author}-${index}`}
                          className="whitespace-break-spaces wrap-break-word"
                        >
                          <span className="font-black tracking-[0.05em] text-sky-300">
                            {message.author}:
                          </span>{" "}
                          <span className="whitespace-break-spaces">
                            {message.text}
                          </span>
                        </p>
                      ))}
                      {chatError ? (
                        <p className="text-xs text-rose-300">{chatError}</p>
                      ) : null}
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
