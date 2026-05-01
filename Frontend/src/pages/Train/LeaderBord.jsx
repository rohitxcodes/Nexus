import React, { useEffect, useMemo, useState } from "react";
import "../../styles/index.css";
import Nav from "../../components/layout/Nav";
import { API_BASE } from "../../utils/api";

const LeaderBord = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLeaderboardLoading(true);
      setLeaderboardError("");

      try {
        const res = await fetch(`${API_BASE}/api/leaderboard/overview`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Failed to load leaderboard");
        }

        setLeaderboard(Array.isArray(data?.top10) ? data.top10 : []);
        setMyRank(data?.me || null);
      } catch (err) {
        setLeaderboardError(err?.message || "Failed to load leaderboard");
      } finally {
        setLeaderboardLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);

  return (
    <div className="min-h-screen bg-[#061224] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(245,211,111,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_28%)]" />
      <Nav />

      <main className="relative px-6 pb-16 pt-24 md:px-10">
        <section className="mx-auto w-full max-w-6xl rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full border border-[#f5d36f]/30 bg-[#f5d36f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#f5d36f]">
                Global Rankings
              </p>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Global Leaderboard
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
                See how the top players are performing across XP and level
                progression.
              </p>
            </div>

            {myRank ? (
              <div className="rounded-2xl border border-[#f5d36f]/25 bg-[#f5d36f]/10 px-4 py-3 text-sm shadow-lg shadow-black/20">
                <p className="text-[#f5d36f]">Your Rank</p>
                <p className="text-lg font-semibold text-white">
                  #{myRank.rank} · {myRank.totalXP} XP · Level{" "}
                  {myRank.currentLevel}
                </p>
              </div>
            ) : null}
          </div>

          {leaderboardLoading ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-xl text-white/80">
              Loading leaderboard...
            </div>
          ) : null}

          {leaderboardError ? (
            <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-lg text-red-200">
              {leaderboardError}
            </div>
          ) : null}

          {!leaderboardLoading && !leaderboardError ? (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {topThree.map((entry, index) => (
                  <div
                    key={entry._id || entry.rank}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-lg shadow-black/20"
                  >
                    <p className="text-sm uppercase tracking-[0.25em] text-[#f5d36f]">
                      {index === 0 ? "Top Player" : `#${index + 1}`}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">
                      {entry.username}
                    </h3>
                    <p className="mt-3 text-sm text-white/70">
                      Rank #{entry.rank}
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      XP {entry.totalXP}
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      Level {entry.currentLevel}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm md:text-base">
                    <thead className="bg-white/5 text-white/70">
                      <tr>
                        <th className="px-5 py-4 font-medium">Rank</th>
                        <th className="px-5 py-4 font-medium">Username</th>
                        <th className="px-5 py-4 font-medium">XP</th>
                        <th className="px-5 py-4 font-medium">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => {
                        const isMe = myRank?.rank === entry.rank;

                        return (
                          <tr
                            key={entry._id || entry.rank}
                            className={`border-t border-white/10 ${
                              isMe
                                ? "bg-[#f5d36f]/10"
                                : index % 2 === 0
                                  ? "bg-white/3"
                                  : "bg-transparent"
                            }`}
                          >
                            <td className="px-5 py-4 font-semibold text-[#f5d36f]">
                              #{entry.rank}
                            </td>
                            <td className="px-5 py-4">{entry.username}</td>
                            <td className="px-5 py-4">{entry.totalXP}</td>
                            <td className="px-5 py-4">{entry.currentLevel}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default LeaderBord;
