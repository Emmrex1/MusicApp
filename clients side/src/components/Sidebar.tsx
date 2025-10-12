import { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { RiFolderMusicLine, RiSearchLine } from "react-icons/ri";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdLibraryMusic, MdFavoriteBorder, MdQueueMusic } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Home", icon: <IoHomeOutline className="w-6 h-6" />, path: "/" },
    { label: "Search", icon: <RiSearchLine className="w-6 h-6" />, path: "/search" },
  ];

  return (
    <>
      <aside
        className={`hidden md:flex h-screen bg-gradient-to-b from-[#1c1c1c] to-[#121212] 
          p-4 flex-col text-white border-r border-gray-800 transition-all duration-300
          ${collapsed ? "w-[80px]" : "w-[22%] min-w-[220px]"}`}
      >
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h1 className="text-2xl font-extrabold tracking-wide text-[#1db954]">
              MyMusic
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-[#2a2a2a] transition"
          >
            <HiOutlineMenuAlt2 className="w-6 h-6 text-[#1db954]" />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
              ${
                location.pathname === item.path
                  ? "bg-[#1db954] text-black shadow-md"
                  : "hover:bg-[#2a2a2a]"
              }`}
              title={collapsed ? item.label : ""}
            >
              {item.icon}
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* Sections */}
        <div className="mt-6 flex-1 overflow-y-auto space-y-4">
          <div className="bg-[#181818]/70 rounded-xl p-4 border border-gray-700 flex flex-col items-center transition hover:border-[#1db954]/60">
            {collapsed ? (
              <RiFolderMusicLine className="w-6 h-6 mb-2 text-[#1db954]" />
            ) : (
              <h2 className="text-lg font-semibold mb-2">Library</h2>
            )}
            <button className="w-full py-2 mt-2 rounded-lg bg-[#1db954] text-black font-medium hover:scale-105 transition-transform text-sm">
              + {!collapsed ? "Add to Library" : ""}
            </button>
          </div>

          <div className="bg-[#181818]/70 rounded-xl p-4 border border-gray-700 flex flex-col items-center transition hover:border-[#1db954]/60">
            {collapsed ? (
              <MdQueueMusic className="w-6 h-6 mb-2 text-[#1db954]" />
            ) : (
              <h2 className="text-lg font-semibold mb-2">Playlists</h2>
            )}
            <button
              onClick={() => navigate("/playlist")}
              className="w-full py-2 mt-2 rounded-lg bg-[#1db954] text-black font-medium hover:scale-105 transition-transform text-sm"
            >
              + {!collapsed ? "Create Playlist" : ""}
            </button>
          </div>

          {!collapsed && (
            <div className="p-4 bg-gradient-to-br from-[#252525] to-black rounded-xl border border-gray-700">
              <h1 className="text-base font-semibold">Find podcasts you’ll love</h1>
              <p className="text-sm text-gray-400 mt-1">
                We’ll keep you updated on new episodes.
              </p>
              <button className="px-4 py-1.5 bg-white text-black text-sm rounded-full mt-3 hover:bg-gray-200">
                Browse Podcasts
              </button>
            </div>
          )}
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 w-full bg-[#121212] border-t border-gray-800 flex justify-around items-center py-3 md:hidden">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center text-sm ${
            location.pathname === "/" ? "text-[#1db954]" : "text-gray-300"
          }`}
        >
          <IoHomeOutline className="w-6 h-6 mb-1" />
          Home
        </button>
        <button
          onClick={() => navigate("/library")}
          className={`flex flex-col items-center text-sm ${
            location.pathname === "/library" ? "text-[#1db954]" : "text-gray-300"
          }`}
        >
          <MdLibraryMusic className="w-6 h-6 mb-1" />
          Library
        </button>
        <button
          onClick={() => navigate("/favourite")}
          className={`flex flex-col items-center text-sm ${
            location.pathname === "/favourite" ? "text-[#1db954]" : "text-gray-300"
          }`}
        >
          <MdFavoriteBorder className="w-6 h-6 mb-1" />
          Favourite
        </button>
        <button
          onClick={() => navigate("/search")}
          className={`flex flex-col items-center text-sm ${
            location.pathname === "/search" ? "text-[#1db954]" : "text-gray-300"
          }`}
        >
          <RiSearchLine className="w-6 h-6 mb-1" />
          Search
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
