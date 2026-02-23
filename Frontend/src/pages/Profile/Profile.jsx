import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/layout/Nav";
import { API_BASE } from "../../utils/api";
import { getToken, clearToken } from "../../utils/storage";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed: ${res.status}`);
        }

        const data = await res.json();
        setProfile({
          user: data.user,
          submissionsCount: data.submissionsCount,
        });
      } catch (e) {
        setError(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#129676] text-white">
      <Nav />

      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/30 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 ${
              activeTab === "overview"
                ? "border-b-2 border-white font-medium"
                : "opacity-70"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`pb-3 ${
              activeTab === "progress"
                ? "border-b-2 border-white font-medium"
                : "opacity-70"
            }`}
          >
            Progress
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-200">{error}</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-12">

            {/* LEFT SIDE */}
            <div className="w-full md:w-1/3 flex flex-col items-start">

              {/* Avatar */}
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-300">
                <img
                  src="https://i.pravatar.cc/300"
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="mt-6 text-2xl font-semibold">
                {profile?.user?.username}
              </h1>

              <p className="opacity-80">
                {profile?.user?.email}
              </p>

              <p className="mt-3 text-sm opacity-90">
                Full Stack Developer | Competitive Programmer
              </p>

              <button
                onClick={handleLogout}
                className="mt-6 w-64 bg-[#0f1c2e] hover:bg-[#1a2a44] py-2 rounded-md transition"
              >
                Logout
              </button>

              <p className="mt-6 text-sm opacity-80">
                <span className="font-semibold">
                  {profile?.submissionsCount ?? 0}
                </span>{" "}
                submissions ·{" "}
                <span className="font-semibold">
                  {profile?.user?.totalXP ?? 0}
                </span>{" "}
                XP
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1">

              {activeTab === "overview" && (
                <div className="bg-[#0f1c2e] p-10 rounded-xl shadow-xl w-full max-w-2xl">

                  <h2 className="text-lg font-semibold mb-6">
                    Profile Stats
                  </h2>

                  <div className="space-y-4 text-sm">
                    <p>
                      <span className="opacity-70">TOTAL XP :</span>{" "}
                      <span className="font-semibold text-lg">
                        {profile?.user?.totalXP ?? 0}
                      </span>
                    </p>

                    <p>
                      <span className="opacity-70">Questions Submitted :</span>{" "}
                      <span className="font-semibold">
                        {profile?.submissionsCount ?? 0}
                      </span>
                    </p>

                    <p>
                      <span className="opacity-70">Email :</span>{" "}
                      {profile?.user?.email}
                    </p>

                    <p>
                      <span className="opacity-70">Username :</span>{" "}
                      {profile?.user?.username}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "progress" && (
                <div className="bg-[#0f1c2e] p-10 rounded-xl shadow-xl w-full max-w-2xl">
                  <h2 className="text-lg font-semibold mb-4">
                    Progress Overview
                  </h2>

                  <p className="text-sm opacity-80">
                    More progress features coming soon...
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;