import React, { useEffect, useState } from "react";
import Nav from "../../components/layout/Nav";
import { API_BASE } from "../../utils/api";
import { getToken } from "../../utils/storage";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

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
    <div style={{ minHeight: "100vh" }}>
      <div style={{ color: "white" }}>
        <Nav />
      </div>

      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

          {loading ? (
            <p className="mt-4 text-gray-600">Loading...</p>
          ) : error ? (
            <p className="mt-4 text-red-600">{error}</p>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold">Username:</span>{" "}
                {profile?.user?.username}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span>{" "}
                {profile?.user?.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Total XP:</span>{" "}
                {profile?.user?.totalXP ?? 0}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Questions Submitted:</span>{" "}
                {profile?.submissionsCount ?? 0}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
