
import React from "react";
import { FaPlay, FaHeart, FaRegHeart, FaEllipsisH, FaClock, } from "react-icons/fa";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useSongAlbumData } from "../context/songcontext";
import { useUserData } from "../context/Usercontext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
  duration?: number;
  artist?: string;
  album?: string;
  showDetails?: boolean;
  variant?: "default" | "compact" | "featured";
}

const SongCard: React.FC<SongCardProps> = ({ 
  image, 
  name, 
  desc, 
  id, 
  duration = 0,
  artist = "Unknown Artist",
  album = "Unknown Album",
  showDetails = false,
  variant = "default"
}) => {
  const { playSong, songs, selectedSong, isPlaying } = useSongAlbumData();
  const { addToPlaylist, isAuth, toggleFavorite, isFavorite } = useUserData();
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const song = songs.find(s => s.id === id || s._id === id);
    if (song) {
      playSong(song);
    }
  };

  const saveToPlaylistHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuth) {
      toast.error("Please login to add songs to your playlist.");
      return;
    }
    if (!id) {
      toast.error("Invalid song ID — cannot add to playlist.");
      return;
    }
    addToPlaylist(id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuth) {
      toast.error("Please login to like songs.");
      return;
    }
    toggleFavorite(id);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCurrentlyPlaying = selectedSong?.id === id || selectedSong?._id === id;
  const songIsFavorite = isFavorite(id);

  if (variant === "compact") {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
          isCurrentlyPlaying 
            ? "bg-green-500/20 border border-green-500/30" 
            : "bg-transparent hover:bg-white/5"
        }`}
        onClick={handlePlay}
      >
        {/* Track Number/Play Button */}
        <div className="w-6 h-6 flex items-center justify-center relative">
          {isHovered ? (
            <Button
              size="sm"
              className="w-6 h-6 p-0 bg-green-500 hover:bg-green-400 text-black rounded-full transition-all duration-200"
            >
              <FaPlay className="w-3 h-3 ml-0.5" />
            </Button>
          ) : isCurrentlyPlaying && isPlaying ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-sm animate-pulse"></div>
            </div>
          ) : (
            <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
              {songs.findIndex(s => s.id === id || s._id === id) + 1}
            </span>
          )}
        </div>

        {/* Song Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={image || "/placeholder.jpg"}
            alt={name}
            className="w-10 h-10 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className={`font-medium truncate ${
              isCurrentlyPlaying ? "text-green-500" : "text-white"
            }`}>
              {name}
            </p>
            <p className="text-gray-400 text-sm truncate">{artist}</p>
          </div>
        </div>

        {/* Actions and Duration */}
        <div className="flex items-center gap-3">
          {isHovered && (
            <div className="flex items-center gap-2 transition-all duration-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="w-8 h-8 p-0 text-gray-400 hover:text-red-500 hover:bg-transparent transition-colors"
              >
                {songIsFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-transparent transition-colors"
              >
                <FaEllipsisH />
              </Button>
            </div>
          )}
          <span className="text-gray-400 text-sm w-12 text-right">
            {formatDuration(duration)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-[#181818] hover:bg-[#282828] rounded-xl p-4 cursor-pointer transition-all duration-300 border ${
        isCurrentlyPlaying 
          ? "border-green-500/30 bg-green-500/10" 
          : "border-transparent hover:border-white/10"
      }`}
      onClick={handlePlay}
    >
      <div className="relative mb-4">
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
          <img
            src={image || "/placeholder.jpg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay with multiple actions */}
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Main Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Button
                className={`bg-green-500 hover:bg-green-400 text-black rounded-full p-3 shadow-2xl transition-all duration-300 ${
                  isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
              >
                {isCurrentlyPlaying && isPlaying ? (
                  <div className="w-4 h-4 bg-black rounded-sm"></div>
                ) : (
                  <FaPlay className="w-4 h-4 ml-0.5" />
                )}
              </Button>
            </div>

            {/* Top Right Actions */}
            <div className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm transition-all duration-200"
              >
                {songIsFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </Button>
              
              {isAuth && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveToPlaylistHandler}
                  className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm transition-all duration-200"
                >
                  <FaEllipsisH />
                </Button>
              )}
            </div>

            {/* Now Playing Indicator */}
            {isCurrentlyPlaying && (
              <div className="absolute bottom-3 left-3">
                <div className="bg-green-500 text-black text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                  <span>NOW PLAYING</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold truncate transition-colors ${
              isCurrentlyPlaying ? "text-green-500" : "text-white group-hover:text-green-400"
            }`}>
              {name}
            </h3>
            <p className="text-gray-400 text-sm truncate mt-1">{artist}</p>
          </div>
          
          {/* Quick Stats */}
          {showDetails && duration > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
              <FaClock className="w-3 h-3" />
              <span>{formatDuration(duration)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {desc && (
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{desc}</p>
        )}

        {/* Additional Info */}
        {showDetails && album && (
          <div className="pt-2 border-t border-white/5">
            <p className="text-gray-500 text-xs truncate">From: {album}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;