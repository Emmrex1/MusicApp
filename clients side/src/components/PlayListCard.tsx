import { motion } from "framer-motion";
import { FaMusic } from "react-icons/fa";
import { useUserData } from "../context/Usercontext";

const PlayListCard = () => {
  const { user, isAuth } = useUserData();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center p-4 rounded-2xl shadow-md cursor-pointer bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] hover:shadow-lg hover:from-[#2a2a2a] hover:to-[#333] transition-all duration-300 border border-transparent hover:border-[#1db954]/60"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-[#1db954] to-green-700 flex items-center justify-center rounded-xl shadow-inner">
        <FaMusic className="text-white text-2xl" />
      </div>

      <div className="ml-4">
        <h2 className="text-lg font-semibold text-white">My Playlist</h2>
        <p className="text-gray-400 text-sm">
          Playlist:{" "}
          <span className="text-[#1db954] font-medium">
            {isAuth ? user?.name || "User" : "Guest"}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default PlayListCard;
