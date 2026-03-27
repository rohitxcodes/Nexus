import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Nav = () => {
  return (
    <>
      <nav>
        <div className="nav flex gap-50 z-1 text-amber-50">
          <div className="logo py-5">
            <Link to="/">
              <img className="h-14" src="/logo.png" alt="" />
            </Link>
          </div>
          <div className="nav-buttons flex gap-10 py-10 px-10">
            <Link to="/train/play">
              <p style={{ cursor: "pointer" }}>Train</p>
            </Link>
            <Link to="/clan">
              <p style={{ cursor: "pointer" }}>Clan</p>
            </Link>
            <Link to="/aboutUs">
              <p style={{ cursor: "pointer" }}>About</p>
            </Link>
            <Link to="/Shop">
              <p style={{ cursor: "pointer" }}>Shop</p>
            </Link>

            <Link
              to="/profile"
              style={{ display: "flex", alignItems: "center" }}
            >
              <FaUserCircle size={26} />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
