
// components/Player.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSongAlbumData } from "../context/songcontext";
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp } from "react-icons/fa";

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedSong) return;

    audio.src = selectedSong.audio;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
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
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] text-white p-3 md:p-4 flex flex-col md:flex-row items-center justify-between shadow-lg">
      {selectedSong ? (
        <>
          {/* Song Info */}
          <div className="flex items-center gap-3 w-[40%]">
            <img
              src={selectedSong.thumbnail}
              alt={selectedSong.title}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div>
              <p className="font-medium text-sm md:text-base">{selectedSong.title}</p>
              <p className="text-xs text-gray-400">
                {selectedSong.description?.slice(0, 40)}...
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center w-[40%]">
            <div className="flex items-center gap-5 mb-1">
              <button onClick={prevSong}>
                <FaBackward className="text-lg hover:text-green-500" />
              </button>
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-green-500 hover:bg-green-600"
              >
                {isPlaying ? (
                  <FaPause className="text-lg" />
                ) : (
                  <FaPlay className="text-lg ml-1" />
                )}
              </button>
              <button onClick={nextSong}>
                <FaForward className="text-lg hover:text-green-500" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-xs">{formatTime(progress)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="w-full accent-green-500"
              />
              <span className="text-xs">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
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
        </>
      ) : (
        <p className="text-gray-400 text-sm">Select a song to play</p>
      )}
    </div>
  );
};

export default Player;
