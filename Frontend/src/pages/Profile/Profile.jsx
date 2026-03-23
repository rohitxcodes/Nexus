import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/layout/Nav";
import { API_BASE } from "../../utils/api";
import { getToken, clearToken } from "../../utils/storage";
import Snowfall from "react-snowfall";
import SpotlightCard from "@/components/ui/spotlight-card";
import BounceIcons from "../../features/problem_solving/components/level/BounceIcons";
import { FileInput } from "lucide-react";


const Profile = () => {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("avtar.png");

  const handleclick = () => {
    fileInputRef.current.click();
  }
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  }
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
    <>
      <style>{`
        .nav-buttons p {
          color: #fdf5e6 !important;
        }
        .nav-buttons a {
          color: #fdf5e6 !important;
        }
      `}</style>
      <Nav />
      <Snowfall
        snowflakeCount={1000}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 50
        }}
      />
      <div className="h-screen bg-cover bg-center " style={{ backgroundImage: "url('/profile bg.png')" }}>
        <div className="h-[400px] flex gap-60 items-center">
          <div className="h-[450px] w-[450px] translate-x-[100px] pl-20  translate-y-[250px] overflow-hidden rounded-xl">
            <img
              onClick={handleclick}
              src={image}
              alt=""
              className="h-full w-full object-cover cursor-pointer"
            />
          </div>          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
          <div className="pl-[200px] pt-[300px] relative">
            <SpotlightCard className="inline-block  ">
              <div>
                <img className=" h-[400px] w-[600px] " src="details.png" alt="details" />
                <div className="absolute inset-0 flex flex-col p-8 text-white pointer-events-none">
                  <h1 className="text-3xl -translate-y-2.5 translate-x-2.5">PROFILE</h1>
                  <div className="p-3 ">
                    <p className="text-xl text-lg translate-y-2.5 translate-x-2.5">Username: {profile?.user?.username}</p>
                    <p className="text-xl text-lg translate-y-2.5 translate-x-2.5">Email: {profile?.user?.email}</p>
                    <p className="text-xl text-lg translate-y-2.5 translate-x-2.5">Submissions: {profile?.submissionsCount}</p>
                    <p className="text-xl text-lg translate-y-2.5 translate-x-2.5">Submissions: {profile?.submissionsCount}</p>
                    <p className="text-xl text-lg translate-y-2.5 translate-x-2.5">Submissions: {profile?.submissionsCount}</p>
                    <p className="text-xl text-lg translate-y-2.5 translate-x-2.5">Submissions: {profile?.submissionsCount}</p>
                    <p className="text-xl text-lg translate-y-2.5 translate-x-2.5">Submissions: {profile?.submissionsCount}</p>
                  </div>
                </div>
              </div>
            </SpotlightCard>

          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;