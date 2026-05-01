import { useNavigate } from "react-router-dom";
import BounceIcons from "../../features/problem_solving/components/level/BounceIcons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";
import { getToken } from "../../utils/storage";

export default function LevelPage() {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Arcade");
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);

  const dropdownOptions = [
    "Arcade",
    "Array",
    "LinkedList",
    "Stack",
    "Queue",
    "Tree",
    "Graph",
    "Sorting",
    "Searching",
  ];

  useEffect(() => {
    const fetchLevelsByTopic = async () => {
      setIsLoadingLevels(true);
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(
          `${API_BASE}/api/levels/topic/${selectedOption}`,
          {
            method: "GET",
            credentials: "include",
            headers,
          },
        );
        const data = await res.json();
        if (res.ok) {
          setFilteredLevels(data);
        } else {
          setFilteredLevels([]);
        }
      } catch (err) {
        console.error("Failed to fetch levels by topic:", err);
        setFilteredLevels([]);
      } finally {
        setIsLoadingLevels(false);
      }
    };
    fetchLevelsByTopic();
  }, [selectedOption]);

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto">
      {/* background video */}
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline
        src="/bg.mp4"
      />

      {/* bouncing icons content (scrolls) */}
      <BounceIcons
        filteredLevels={filteredLevels}
        isLoadingLevels={isLoadingLevels}
        selectedTopic={selectedOption}
      />

      {/* top right dropdown */}
      <div className="fixed top-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="rounded-lg border border-white/30 bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#363232] shadow-lg transition hover:bg-white/30"
        >
          {selectedOption} ▼
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-40 rounded-lg border border-white/30 bg-white/20 backdrop-blur-md shadow-lg overflow-hidden">
            {dropdownOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSelectedOption(option);
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-semibold uppercase tracking-wide transition ${
                  selectedOption === option
                    ? "bg-white/40 text-[#363232]"
                    : "text-[#363232] hover:bg-white/25"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-80
          px-5 py-5 bg-white/30 backdrop-blur-2xl text-[#363232]
          flex flex-col gap-6 transition-transform duration-300 ease-in-out
          ${isSidebarCollapsed ? "-translate-x-[calc(100%-3rem)]" : "translate-x-0"}
        `}
      >
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((current) => !current)}
          className="absolute right-2 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-black/20 text-2xl font-black text-[#363232] shadow-md backdrop-blur-md transition hover:bg-black/30"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {isSidebarCollapsed ? ">" : "<"}
        </button>

        <img
          src="/logo.png"
          className="h-12 w-60 cursor-pointer"
          alt="Logo"
          onClick={() => navigate("/")}
        />

        <nav className="flex flex-col gap-20 text-4xl font-bold py-6 px-9">
          <Link to="/leaderbord" className="cursor-pointer">
            LEADERBOARD
          </Link>
          <Link to="/practice" className="cursor-pointer">
            PRACTICE
          </Link>
          <Link to="/about" className="cursor-pointer">
            ABOUT
          </Link>
          <Link to="/shop" className="cursor-pointer">
            SHOP
          </Link>
        </nav>
      </div>
    </div>
  );
}
