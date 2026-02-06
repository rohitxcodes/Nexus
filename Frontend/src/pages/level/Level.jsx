import BounceIcons from "../../features/problem_solving/components/level/BounceIcons";

export default function LevelPage() {
  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden overflow-y-auto">
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
        <img src="/logo.png" className="h-24" />

        <nav className="flex flex-col gap-4 text-3xl font-bold">
          <button>TRAIN</button>
          <button>PRACTICE</button>
          <button>ABOUT</button>
          <button>SHOP</button>
        </nav>
      </div>
    </div>
  );
}
