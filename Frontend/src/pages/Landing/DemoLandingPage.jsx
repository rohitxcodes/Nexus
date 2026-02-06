import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="h-16 bg-white shadow flex items-center justify-between px-6">
        {/* Left logo */}
        <div className="w-10 h-10 rounded-full border-2 border-gray-400" />

        {/* Center links */}
        <div className="flex gap-10 text-gray-700 font-medium">
          <a href="#" className="hover:text-black">
            Link 1
          </a>
          <a href="#" className="hover:text-black">
            Link 2
          </a>
          <a href="#" className="hover:text-black">
            Link 3
          </a>
        </div>

        {/* Right profile */}
        <User className="w-7 h-7 text-blue-500" />
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-16">
          <h1 className="text-3xl font-semibold text-gray-800">Landing Page</h1>

          <Link to="/register">
            <button className="px-6 py-3 bg-white border rounded-xl shadow hover:bg-gray-200 transition font-medium">
              Get started
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
