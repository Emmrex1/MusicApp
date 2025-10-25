
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSongAlbumData } from "../context/songcontext";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Player: React.FC = () => {
  const {
    selectedSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
  } = useSongAlbumData();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showFullPlayer, setShowFullPlayer] = useState<boolean>(true);

  // Detect scroll on mobile to show mini player
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setShowFullPlayer(window.scrollY < 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedSong) return;

    audio.src = selectedSong.audio;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [selectedSong, isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setProgress(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const seekTime = parseFloat(e.target.value);
      audio.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value);
    if (audio) audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, []);

  return (
    <>
      {/* FULL PLAYER */}
      <AnimatePresence>
        {selectedSong && showFullPlayer && (
          <motion.div
            key="full-player"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: "spring", stiffness: 70 }}
            className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-[#181818]/95 backdrop-blur-lg 
                       text-white px-4 py-3 flex flex-col md:flex-row items-center justify-between 
                       shadow-lg border-t border-gray-800 z-40"
          >
            {/* Song Info */}
            <div className="flex items-center gap-3 w-full md:w-[30%] mb-2 md:mb-0">
              <img
                src={selectedSong.thumbnail}
                alt={selectedSong.title}
                className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover"
              />
              <div className="truncate">
                <p className="font-semibold text-sm md:text-base truncate">
                  {selectedSong.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {selectedSong.description?.slice(0, 40)}...
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center w-full md:w-[40%]">
              <div className="flex items-center gap-6 mb-1">
                <button onClick={prevSong}>
                  <FaBackward className="text-lg hover:text-green-500 transition" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-[#1db954] hover:bg-[#1ed760] transition"
                >
                  {isPlaying ? (
                    <FaPause className="text-lg" />
                  ) : (
                    <FaPlay className="text-lg ml-1" />
                  )}
                </motion.button>
                <button onClick={nextSong}>
                  <FaForward className="text-lg hover:text-green-500 transition" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2 w-full max-w-md">
                <span className="text-[10px]">{formatTime(progress)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={progress}
                  onChange={handleSeek}
                  className="w-full accent-green-500 cursor-pointer"
                />
                <span className="text-[10px]">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2 w-[20%] justify-end">
              <FaVolumeUp className="text-lg" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-green-500"
              />
            </div>

            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={nextSong}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINI PLAYER (Mobile only) */}
      <AnimatePresence>
        {selectedSong && !showFullPlayer && (
          <motion.div
            key="mini-player"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 70 }}
            onClick={() => setShowFullPlayer(true)}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#181818]/95 
                       border border-gray-700 rounded-2xl flex items-center justify-between 
                       px-3 py-2 shadow-lg md:hidden cursor-pointer z-40"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={selectedSong.thumbnail}
                alt={selectedSong.title}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="truncate">
                <p className="text-sm font-semibold truncate">
                  {selectedSong.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {selectedSong.description?.slice(0, 30)}...
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-2 rounded-full bg-[#1db954] text-black hover:bg-[#1ed760]"
            >
              {isPlaying ? <FaPause className="text-base" /> : <FaPlay className="text-base ml-1" />}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Player;
