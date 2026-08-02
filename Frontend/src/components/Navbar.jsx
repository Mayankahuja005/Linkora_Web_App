import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-linear-to-r from-slate-950 via-blue-950 to-slate-950 border-b border-blue-800 shadow-lg">
      <div className="w-full px-4 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-widest bg-linear-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
            LINKORA
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="px-3 sm:px-4 py-2 border border-blue-400 text-blue-300 rounded-lg hover:bg-blue-600 hover:text-white transition text-xs sm:text-sm"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-3 sm:px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition text-xs sm:text-sm"
            >
              Sign Up
            </Link>

            <Link
              to="/logout"
              className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs sm:text-sm"
            >
              Logout
            </Link>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-4 flex items-center">
          <div className="flex items-center gap-6 sm:gap-8 text-white font-medium text-sm sm:text-base">
            <Link
              to="/"
              className="hover:text-cyan-300 transition"
            >
              Feed
            </Link>

            <Link
              to="/my-connection"
              className="hover:text-cyan-300 transition"
            >
              My Connections
            </Link>
            <Link
              to="/pending"
              className="hover:text-cyan-300 transition"
            >
                Invitation
            </Link>
          </div>

          <Link
            to="/profile"
            className="ml-auto w-11 h-11 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center text-lg font-bold transition duration-300 shadow-md"
          >
            👤
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;