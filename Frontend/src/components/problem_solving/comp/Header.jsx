import { Link } from 'react-router-dom';
export default function Header() {
  const style = {
    fontStyle: {
      fontFamily: "arial",
    }
  }
  return (
    <header className="h-14 w-full flex items-center justify-between px-6 border-b border-gray-700  text-white bg-[#005461]"
      style={style.fontStyle}
    >

      {/* Left */}
      <Link to="/">
        <div className="font-bold text-lg ">
          <img src="/logo.png" alt="" className="h-14" />
        </div>
      </Link>



      {/* Right */}

      <div className="flex gap-4 text-sm">
        <button className="hover:text-green-400 p-1 rounded" style={{ backgroundColor: "#018790" }}>
          Problems
        </button>
        <button className="hover:text-green-400 p-1 rounded" style={{ backgroundColor: "#018790" }}>
          Discuss
        </button>
        <button className="hover:text-green-400 p-1 rounded" style={{ backgroundColor: "#018790" }}>
          Login
        </button>
      </div>

    </header>
  );
}
