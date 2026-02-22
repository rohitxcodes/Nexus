import { useNavigate } from "react-router-dom";
import BounceIcons from "../../features/problem_solving/components/level/BounceIcons";

export default function LevelPage() {
  const navigate = useNavigate();

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
      <BounceIcons />

      {/* sidebar */}
      <div
        className="
          fixed top-0 left-0 z-50
          h-full w-80
          px-5 py-5
          bg-white/30 backdrop-blur-2xl
          text-[#363232]
          flex flex-col gap-6
        "
      >

        <img 
          src="/logo.png" 
          className="h-24 cursor-pointer" 
          alt="Logo" 
          onClick={() => navigate("/")}
        />

        <nav className="flex flex-col gap-20 text-4xl font-bold py-6 px-9">
          <button 
          className="cursor-pointer"
            onClick={() => navigate("/train")}
          >
            TRAIN
          </button>
          <button 
          className="cursor-pointer"
            onClick={() => navigate("/practice")}
          >
            PRACTICE
          </button>
          <button 
          className="cursor-pointer"
            onClick={() => navigate("/about")}
          >
            ABOUT
          </button>
          <button 
          className="cursor-pointer"
            onClick={() => navigate("/shop")}
          >
            SHOP
          </button>
        </nav>
      </div>
    </div>
  );
}