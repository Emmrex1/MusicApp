
import { useState, useEffect } from "react";
import { 
  IoHomeOutline, 
  IoAddCircleOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoChevronDown,
  IoChevronUp,
  IoMusicalNotesOutline
} from "react-icons/io5";
import { 
  RiSearchLine, 
  RiAdminLine, 
  RiPlayListAddLine,
  RiFireLine,
  RiAlbumLine
} from "react-icons/ri";
import { 
  HiOutlineMenuAlt2, 
  HiOutlineCollection,
  HiOutlineTrendingUp
} from "react-icons/hi";
import { 
  MdLibraryMusic, 
  MdFavoriteBorder, 
  MdQueueMusic, 
  MdPlayCircleFilled,
  MdDashboard,
  MdAnalytics,
  MdUpload,
  MdSecurity,
  MdAccessTime
} from "react-icons/md";
import { FaCog, FaMusic, FaRegBell, FaRandom, FaHeadphonesAlt, FaPodcast, FaPlay, FaChartBar, FaUsers } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSongAlbumData } from "../context/songcontext";
import { useUserData } from "../context/Usercontext";
import { toast } from "sonner";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserData();
  const { albums, songs } = useSongAlbumData();

  const isAdmin = user?.role === "admin";

  // Sample playlists data
  const userPlaylists = [
    { id: 1, name: "Workout Mix", songs: 25, color: "bg-gradient-to-br from-red-500 to-orange-500" },
    { id: 2, name: "Chill Vibes", songs: 18, color: "bg-gradient-to-br from-blue-500 to-purple-500" },
    { id: 3, name: "Road Trip", songs: 32, color: "bg-gradient-to-br from-green-500 to-emerald-500" },
    { id: 4, name: "Party Time", songs: 42, color: "bg-gradient-to-br from-pink-500 to-rose-500" },
  ];

  // Sample recommendations
  const recommendations = [
    { id: 1, type: "album", name: "New Releases", icon: <RiAlbumLine />, color: "text-purple-400" },
    { id: 2, type: "playlist", name: "Trending Now", icon: <RiFireLine />, color: "text-orange-400" },
    { id: 3, type: "radio", name: "Personal Radio", icon: <HiOutlineTrendingUp />, color: "text-blue-400" },
    { id: 4, type: "podcast", name: "Top Podcasts", icon: <FaPodcast />, color: "text-green-400" },
  ];

  // Main navigation items
  const mainMenuItems = [
    { 
      label: "Home", 
      icon: <IoHomeOutline className="w-5 h-5" />, 
      path: "/",
      badge: null
    },
    { 
      label: "Search", 
      icon: <RiSearchLine className="w-5 h-5" />, 
      path: "/search",
      badge: null
    },
    { 
      label: "Your Library", 
      icon: <MdLibraryMusic className="w-5 h-5" />, 
      path: "/library",
      badge: null
    },
    { 
      label: "Favorites", 
      icon: <MdFavoriteBorder className="w-5 h-5" />, 
      path: "/favorites",
      badge: user?.favorites?.length || 0
    },
    { 
      label: "Playlists", 
      icon: <MdQueueMusic className="w-5 h-5" />, 
      path: "/playlists",
      badge: user?.playlist?.length || 0
    },
  ];

  // Admin menu items
  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
      path: "/admin/dashboard",
      color: "text-purple-400"
    },
    {
      label: "Analytics",
      icon: <MdAnalytics className="w-5 h-5" />,
      path: "/admin/analytics",
      color: "text-blue-400"
    },
    {
      label: "Upload Content",
      icon: <MdUpload className="w-5 h-5" />,
      path: "/admin/upload",
      color: "text-green-400"
    },
    {
      label: "Manage Users",
      icon: <FaUsers className="w-5 h-5" />,
      path: "/admin/users",
      color: "text-yellow-400"
    },
    {
      label: "Content Moderation",
      icon: <MdSecurity className="w-5 h-5" />,
      path: "/admin/moderation",
      color: "text-red-400"
    },
    {
      label: "System Settings",
      icon: <IoSettingsOutline className="w-5 h-5" />,
      path: "/admin/settings",
      color: "text-gray-400"
    },
  ];

  const adminQuickActions = [
    { label: "Add Song", icon: <IoAddCircleOutline />, action: () => navigate("/admin/add-song") },
    { label: "Add Album", icon: <HiOutlineCollection />, action: () => navigate("/admin/add-album") },
    { label: "View Reports", icon: <FaChartBar />, action: () => navigate("/admin/reports") },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handlePlayPlaylist = (playlistId: number, playlistName: string) => {
    toast.success(`Playing ${playlistName}`);
  };

  const handleQuickMix = () => {
    toast.success("Creating your personalized mix...");
  };

  const getPlaylistDuration = (songs: number) => {
    const minutes = Math.floor(songs * 3.5);
    return minutes > 60 
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
      : `${minutes}m`;
  };

  return (
    <>
      {/* DESKTOP SIDEBAR - FIXED STRUCTURE */}
      <aside
        className={`hidden md:flex h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]
          text-white border-r border-gray-900 transition-all duration-500
          ${collapsed ? "w-[85px]" : "w-[300px] min-w-[300px]"}`}
      >
        {/* Fixed Container Structure */}
        <div className="flex flex-col h-full w-full">
          {/* HEADER SECTION */}
          <div className="flex-none p-5 pb-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              {!collapsed ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <MdPlayCircleFilled className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                      SoundScape
                    </h1>
                    <p className="text-xs text-gray-400">Premium Music Experience</p>
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                  <MdPlayCircleFilled className="w-6 h-6 text-black" />
                </div>
              )}
              
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                title={collapsed ? "Expand" : "Collapse"}
              >
                <HiOutlineMenuAlt2 className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE CONTENT AREA */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className="p-5 space-y-8">
              {/* MAIN NAVIGATION */}
              <nav className="space-y-2">
                <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 ${collapsed ? 'hidden' : 'block'}`}>
                  Navigation
                </h3>
                {mainMenuItems.map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group
                      ${location.pathname === item.path
                        ? "bg-gradient-to-r from-green-500/30 to-emerald-400/20 border border-green-500/40 text-green-300 shadow-lg shadow-green-500/20"
                        : "hover:bg-white/10 hover:border hover:border-gray-800/50"
                      }`}
                    title={collapsed ? item.label : ""}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg shadow-sm ${
                        location.pathname === item.path 
                          ? "bg-green-500/30 shadow-green-500/30" 
                          : "bg-gray-900/70 group-hover:bg-gray-800"
                      }`}>
                        {item.icon}
                      </div>
                      {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    
                    {item.badge && item.badge > 0 && !collapsed && (
                      <span className="bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* ADMIN SECTION */}
              {isAdmin && !collapsed && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      Admin Panel
                    </h3>
                    <button 
                      onClick={() => setShowAdminMenu(!showAdminMenu)}
                      className="text-xs text-gray-500 hover:text-purple-300 transition-colors flex items-center gap-1"
                    >
                      {showAdminMenu ? <IoChevronUp /> : <IoChevronDown />}
                    </button>
                  </div>

                  {/* Admin Quick Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    {adminQuickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => action.action()}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-gray-900/80 to-black/50 border border-gray-800 hover:border-gray-700 transition-all duration-300"
                        title={action.label}
                      >
                        <div className="text-green-400 mb-1 text-lg">{action.icon}</div>
                        <span className="text-xs text-gray-300">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Admin Menu Items */}
                  <AnimatePresence>
                    {showAdminMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {adminMenuItems.map((item) => (
                          <motion.button
                            key={item.label}
                            whileHover={{ x: 5 }}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-gray-700/50 ${
                              location.pathname === item.path ? "bg-white/10 border-gray-700/50" : ""
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${item.color} bg-opacity-20`}>
                              {item.icon}
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* PLAYLISTS SECTION - Only when not collapsed */}
              {!collapsed && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                        <MdQueueMusic className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">Your Playlists</h3>
                        <p className="text-xs text-gray-400">
                          {userPlaylists.length} playlists • {userPlaylists.reduce((acc, p) => acc + p.songs, 0)} songs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowPlaylists(!showPlaylists)}
                        className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
                        title={showPlaylists ? "Collapse" : "Expand"}
                      >
                        {showPlaylists ? <IoChevronUp /> : <IoChevronDown />}
                      </button>
                      <button 
                        onClick={() => navigate("/playlist/create")}
                        className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-black font-medium hover:scale-105 transition-transform shadow-md"
                        title="Create Playlist"
                      >
                        <RiPlayListAddLine className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showPlaylists && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {/* Quick Mix Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleQuickMix}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-400/50 flex items-center justify-center gap-3 transition-all duration-300"
                        >
                          <FaRandom className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-sm text-white">Quick Mix</span>
                          <span className="text-xs text-gray-400 ml-auto">Auto-generated</span>
                        </motion.button>

                        {/* Playlists List */}
                        {userPlaylists.map((playlist) => (
                          <motion.button
                            key={playlist.id}
                            whileHover={{ x: 5 }}
                            onClick={() => handlePlayPlaylist(playlist.id, playlist.name)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-900/50 to-black/30 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all duration-300 group"
                          >
                            <div className={`w-12 h-12 rounded-lg ${playlist.color} flex items-center justify-center shadow-md`}>
                              <FaMusic className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="font-medium text-white truncate">{playlist.name}</h4>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <FaHeadphonesAlt className="w-3 h-3" />
                                  {playlist.songs} songs
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MdAccessTime className="w-3 h-3" />
                                  {getPlaylistDuration(playlist.songs)}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPlaylist(playlist.id, playlist.name);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-all duration-300"
                              title="Play"
                            >
                              <FaPlay className="w-4 h-4 text-green-400" />
                            </button>
                          </motion.button>
                        ))}

                        {/* View All Button */}
                        <button
                          onClick={() => navigate("/playlists")}
                          className="w-full mt-2 py-2.5 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 transition-all duration-300 text-sm font-medium"
                        >
                          View All Playlists →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* RECOMMENDATIONS SECTION - Only when not collapsed */}
              {!collapsed && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
                        <HiOutlineTrendingUp className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">Discover More</h3>
                        <p className="text-xs text-gray-400">Personalized recommendations</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowRecommendations(!showRecommendations)}
                      className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
                      title={showRecommendations ? "Collapse" : "Expand"}
                    >
                      {showRecommendations ? <IoChevronUp /> : <IoChevronDown />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showRecommendations && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {/* Recommendations List */}
                        {recommendations.map((rec) => (
                          <motion.button
                            key={rec.id}
                            whileHover={{ x: 5 }}
                            onClick={() => navigate(`/${rec.type}s`)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-900/50 to-black/30 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all duration-300 group"
                          >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800 transition-all">
                              <div className={`text-lg ${rec.color} group-hover:text-white`}>
                                {rec.icon}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="font-medium text-white">{rec.name}</h4>
                            </div>
                          </motion.button>
                        ))}

                        {/* Statistics Grid */}
                        <div className="mt-4 pt-4 border-t border-gray-800/50">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-lg bg-gray-900/30">
                              <div className="text-xl font-bold text-green-400">{albums.length}</div>
                              <div className="text-xs text-gray-400 mt-1">Albums</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-gray-900/30">
                              <div className="text-xl font-bold text-blue-400">{songs.length}</div>
                              <div className="text-xs text-gray-400 mt-1">Songs</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-gray-900/30">
                              <div className="text-xl font-bold text-purple-400">{userPlaylists.length}</div>
                              <div className="text-xs text-gray-400 mt-1">Playlists</div>
                            </div>
                          </div>
                        </div>

                        {/* Explore Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => navigate("/discover")}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-black font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <IoMusicalNotesOutline className="w-5 h-5" />
                          Explore New Music
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* USER PROFILE SECTION - Fixed at bottom */}
          <div className="flex-none p-5 border-t border-gray-800">
            <div className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 p-3'} rounded-xl bg-gradient-to-r from-gray-900/50 to-black/30 border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer group`}>
              <div className="relative">
                <div className={`${collapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-md`}>
                  {user ? (
                    <span className="font-bold text-white text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <IoPersonOutline className="w-4 h-4 text-white" />
                  )}
                </div>
                {!collapsed && notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-md">
                    <span className="text-xs font-bold text-white">{notifications}</span>
                  </div>
                )}
              </div>
              
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate text-sm">
                        {user?.name || "Guest User"}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {user?.email || "Sign in to your account"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate("/notifications")}
                        className="p-1.5 rounded-lg hover:bg-gray-700/50 relative transition-colors"
                        title="Notifications"
                      >
                        <FaRegBell className="w-4 h-4 text-gray-400 hover:text-white" />
                        {notifications > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                      </button>
                      <button 
                        onClick={() => navigate("/settings")}
                        className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                        title="Settings"
                      >
                        <FaCog className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-300 hover:text-red-200 hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300 text-sm font-medium border border-red-500/20 hover:border-red-400/30"
                    >
                      <IoLogOutOutline className="w-4 h-4" />
                      Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE NAVIGATION */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-[#0a0a0a]/95 backdrop-blur-xl 
                 border border-gray-800 rounded-2xl flex justify-around items-center py-3 shadow-2xl 
                 md:hidden z-50"
      >
        {mainMenuItems.slice(0, 4).map((item) => (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-xs transition-all relative ${
              location.pathname === item.path
                ? "text-green-400 scale-110"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.badge && item.badge > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-black text-xs font-bold rounded-full flex items-center justify-center shadow-sm"
              >
                {item.badge}
              </motion.span>
            )}
            <div className="text-lg mb-1">{item.icon}</div>
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}

        {/* Admin Quick Action on Mobile */}
        {isAdmin && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/admin/dashboard")}
            className="flex flex-col items-center text-xs text-purple-400 hover:text-purple-300 transition-colors relative"
          >
            <div className="text-lg mb-1 relative">
              <RiAdminLine />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-sm"></span>
            </div>
            <span className="font-medium">Admin</span>
          </motion.button>
        )}
      </motion.nav>
    </>
  );
};

export default Sidebar;