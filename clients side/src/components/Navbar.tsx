
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../context/Usercontext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserData();
  const [open, setOpen] = useState(false);

  const filters = ["All", "Musics", "Podcasts", "Playlists"];

  return (
    <div className="w-full flex flex-col mb-4 relative">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-4">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <MdKeyboardArrowLeft
            className="w-8 h-8 p-2 bg-[#181818] hover:bg-[#2a2a2a] rounded-full cursor-pointer transition"
            onClick={() => navigate(-1)}
          />
          <MdKeyboardArrowRight
            className="w-8 h-8 p-2 bg-[#181818] hover:bg-[#2a2a2a] rounded-full cursor-pointer transition"
            onClick={() => navigate(1)}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 relative">
          <button className="px-4 py-1 text-sm bg-white text-black rounded-full hidden md:block hover:bg-gray-200 transition">
            Explore Premium
          </button>
          <button className="px-4 py-1 text-sm bg-white text-black rounded-full hidden md:block hover:bg-gray-200 transition">
            Install App
          </button>

          {user ? (
            <div
              onClick={() => setOpen(!open)}
              className="relative flex items-center gap-2 bg-[#282828] hover:bg-[#383838] px-2 py-1 rounded-full cursor-pointer transition"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-9 h-9 rounded-full border-2 border-green-500 opacity-60 animate-pulse"></div>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1db954&color=fff`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full relative z-10"
                />
              </div>
              <span className="hidden sm:block text-sm font-medium text-white">
                {user.name}
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1 text-sm bg-[#1db954] text-black rounded-full hover:opacity-90 transition"
            >
              Log in
            </button>
          )}

          {/* Dropdown Menu */}
          <AnimatePresence>
            {open && user && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 bg-[#282828] text-white rounded-lg shadow-lg w-40 overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-[#3a3a3a] text-sm"
                >
                  <UserIcon className="w-4 h-4" /> Profile
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-[#3a3a3a] text-sm text-red-400"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => filter === "Playlists" && navigate("/playlists")}
            className="px-4 py-1 text-sm bg-white text-black rounded-full hover:bg-gray-200 transition whitespace-nowrap"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
