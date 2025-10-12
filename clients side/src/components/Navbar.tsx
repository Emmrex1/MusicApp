import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const filters = ["All", "Musics", "Podcasts", "Playlists"];

  return (
    <>
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-4">
        {/* History Arrows */}
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

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-1 text-sm bg-white text-black rounded-full hidden md:block hover:bg-gray-200 transition">
            Explore Premium
          </button>
          <button className="px-4 py-1 text-sm bg-white text-black rounded-full hidden md:block hover:bg-gray-200 transition">
            Install App
          </button>
          {/* User / Logout */}
          <div className="flex items-center gap-2 cursor-pointer px-3 py-1 bg-[#1db954] text-black rounded-full hover:opacity-90">
            <span className="hidden sm:block font-medium">Logout</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => filter === "Playlists" && navigate("/playlists")}
            className="px-4 py-1 text-sm bg-white text-black rounded-full hover:bg-gray-200 transition"
          >
            {filter}
          </button>
        ))}
      </div>
    </>
  );
};

export default Navbar;
