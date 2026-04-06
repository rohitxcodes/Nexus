import React, { useEffect, useState } from "react";
import "../../App";
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

  return (
    <>
      <div className="min-h-screen bg-[#051025] text-white">
        <Nav />

        <div className="px-6 pb-16 pt-24 md:px-10">
          <div className="mx-auto w-full max-w-4xl rounded-xl bg-black/45 p-6 backdrop-blur-sm">
            <h2 className="text-4xl tracking-widest">Global Leaderboard</h2>

            {leaderboardLoading ? (
              <p className="mt-4 text-xl">Loading leaderboard...</p>
            ) : null}

            {leaderboardError ? (
              <p className="mt-4 text-lg text-red-300">{leaderboardError}</p>
            ) : null}

            {!leaderboardLoading && !leaderboardError ? (
              <>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-base md:text-lg">
                    <thead>
                      <tr className="border-b border-white/35">
                        <th className="py-2 pr-3">Rank</th>
                        <th className="py-2 pr-3">Username</th>
                        <th className="py-2 pr-3">XP</th>
                        <th className="py-2">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry) => (
                        <tr
                          key={entry._id}
                          className="border-b border-white/15"
                        >
                          <td className="py-2 pr-3">#{entry.rank}</td>
                          <td className="py-2 pr-3">{entry.username}</td>
                          <td className="py-2 pr-3">{entry.totalXP}</td>
                          <td className="py-2">{entry.currentLevel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {myRank ? (
                  <div className="mt-5 rounded-lg border border-yellow-300/35 bg-yellow-200/10 p-4">
                    <p className="text-lg">
                      Your Rank: #{myRank.rank} | XP: {myRank.totalXP} | Level:{" "}
                      {myRank.currentLevel}
                    </p>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderBord;
