
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaEllipsisH, FaClock, FaMusic, FaShare, } from "react-icons/fa";
import { IoShuffle } from "react-icons/io5";
import { toast } from "sonner";
import Layout from "../../components/Layout";
import Player from "../../components/Player"
import { useSongAlbumData } from "../../context/songcontext";
import { useUserData } from "../../context/Usercontext";

const Album: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    albumsongs, 
    albumsData, 
    fetchAlbumSongs, 
    loading, 
    playSong, 
    setCurrentPlaylist,
    selectedSong,
    isPlaying,
    togglePlay,
    // nextSong,
    // prevSong
  } = useSongAlbumData();
  
  const { isAuth, toggleFavorite, isFavorite, addToPlaylist } = useUserData();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAlbumLiked, setIsAlbumLiked] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number>(-1);
  const headerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Fetch album data
  useEffect(() => {
    if (!id || id === 'undefined') {
      navigate('/');
      return;
    }
    fetchAlbumSongs(id);
  }, [id, fetchAlbumSongs, navigate]);

  // Update current playing index
  useEffect(() => {
    if (selectedSong && albumsongs.length > 0) {
      const index = albumsongs.findIndex(song => 
        song.id === selectedSong.id || song._id === selectedSong._id
      );
      setCurrentPlayingIndex(index);
    }
  }, [selectedSong, albumsongs]);

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (actionsRef.current) {
        const { top } = actionsRef.current.getBoundingClientRect();
        setIsHeaderSticky(top <= 80);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlayAlbum = () => {
    if (albumsongs.length > 0) {
      setCurrentPlaylist(albumsongs);
      playSong(albumsongs[0]);
      toast.success(`Playing "${albumsData?.title}"`);
    }
  };

  const handleShufflePlay = () => {
    if (albumsongs.length > 0) {
      const shuffled = [...albumsongs].sort(() => Math.random() - 0.5);
      setCurrentPlaylist(shuffled);
      playSong(shuffled[0]);
      toast.success("Shuffling album");
    }
  };

  const handlePlayPause = () => {
    if (selectedSong && albumsongs.includes(selectedSong)) {
      togglePlay();
    } else if (albumsongs.length > 0) {
      setCurrentPlaylist(albumsongs);
      playSong(albumsongs[0]);
    }
  };

  const handleLikeAlbum = () => {
    if (!isAuth) {
      toast.error("Please login to like albums");
      return;
    }
    setIsAlbumLiked(!isAlbumLiked);
    toast.success(isAlbumLiked ? "Album removed from favorites" : "Album added to favorites! ❤️");
  };

  const handleShareAlbum = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: albumsData?.title,
          text: `Check out "${albumsData?.title}" on SoundScape`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Album link copied to clipboard!");
    }
  };

  const handleAddToPlaylist = (songId: string) => {
    if (!isAuth) {
      toast.error("Please login to add songs to playlist");
      return;
    }
    addToPlaylist(songId);
  };

  const handleLikeSong = (songId: string) => {
    toggleFavorite(songId);
  };

  const formatDuration = (seconds: number = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotalDuration = () => {
    const totalSeconds = albumsongs.reduce((total, song) => total + (song.duration || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const getReleaseYear = () => {
    if (albumsData?.releaseDate) {
      return new Date(albumsData.releaseDate).getFullYear();
    }
    return new Date().getFullYear();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#1f1f1f] to-[#121212] min-h-screen text-white">
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading album...</p>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  if (!albumsData) {
    return (
      <div className="bg-gradient-to-b from-[#1f1f1f] to-[#121212] min-h-screen text-white">
        <Layout>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="text-6xl mb-4">🎵</div>
            <h1 className="text-2xl font-bold mb-4">Album Not Found</h1>
            <p className="text-gray-400 mb-8 max-w-md">
              The album you're looking for doesn't exist or may have been removed.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              Discover Music
            </button>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1f1f1f] to-[#121212] min-h-screen text-white pb-32">
      <Layout>
        {/* Album Hero Section */}
        <div 
          ref={headerRef}
          className="relative pt-8 pb-12 px-6 bg-gradient-to-b from-green-900/40 via-purple-900/20 to-[#1f1f1f]"
        >
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8 max-w-7xl mx-auto">
            {/* Album Art with Interactive Elements */}
            <div className="relative group self-center md:self-auto">
              <div className={`relative transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <img
                  src={albumsData.thumbnail || "/placeholder.jpg"}
                  alt={albumsData.title}
                  className="w-56 h-56 md:w-72 md:h-72 rounded-2xl shadow-2xl object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Interactive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <button 
                        onClick={handlePlayAlbum}
                        className="bg-green-500 hover:bg-green-400 text-black p-3 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
                      >
                        <FaPlay className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handleShufflePlay}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transform hover:scale-110 transition-all duration-300"
                      >
                        <IoShuffle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Loading State */}
              {!imageLoaded && (
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center shadow-2xl">
                  <div className="text-gray-600 text-lg">Loading Artwork...</div>
                </div>
              )}
            </div>

            {/* Album Information */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                  Album
                </p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {albumsData.title}
                </h1>
              </div>

              <p className="text-gray-300 text-xl leading-relaxed max-w-3xl">
                {albumsData.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 text-lg text-gray-400">
                <div className="flex items-center gap-6">
                  <span className="font-semibold text-white text-xl">{albumsData.artist || "Various Artists"}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="text-green-400">{getReleaseYear()}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{albumsongs.length} {albumsongs.length === 1 ? 'song' : 'songs'}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{calculateTotalDuration()}</span>
                </div>
              </div>

              {/* Album Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaMusic className="w-4 h-4" />
                  <span>{albumsongs.length} tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>{calculateTotalDuration()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions Header */}
        <div 
          ref={actionsRef}
          className={`sticky top-0 z-40 transition-all duration-500 ${
            isHeaderSticky 
              ? 'bg-[#1f1f1f]/95 backdrop-blur-lg border-b border-white/10 py-4 shadow-2xl' 
              : 'bg-transparent py-6'
          }`}
        >
          <div className="px-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Play/Pause Button */}
                <button 
                  onClick={handlePlayPause}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-2xl"
                >
                  {isPlaying && currentPlayingIndex !== -1 ? (
                    <>
                      <FaPause className="w-5 h-5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <FaPlay className="w-5 h-5" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                {/* Shuffle Button */}
                <button 
                  onClick={handleShufflePlay}
                  className="bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-3 backdrop-blur-sm"
                >
                  <IoShuffle className="w-5 h-5" />
                  <span>Shuffle</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Like Album */}
                <button 
                  onClick={handleLikeAlbum}
                  className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    isAlbumLiked 
                      ? 'text-red-500 bg-red-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isAlbumLiked ? <FaHeart className="w-6 h-6" /> : <FaRegHeart className="w-6 h-6" />}
                </button>

                {/* Share Album */}
                <button 
                  onClick={handleShareAlbum}
                  className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
                >
                  <FaShare className="w-6 h-6" />
                </button>

                {/* More Options */}
                <button className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                  <FaEllipsisH className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 max-w-7xl mx-auto">
          {/* Songs List Section */}
          <div className="mt-8">
            {/* Songs Header */}
            <div className="grid grid-cols-[16px_1fr_60px_100px] gap-4 px-6 py-4 text-gray-400 border-b border-white/10 text-sm font-medium mb-4">
              <div className="text-center">#</div>
              <div>Title</div>
              <div className="text-center"></div>
              <div className="text-right">
                <FaClock className="inline w-4 h-4 mr-2" />
              </div>
            </div>

            {/* Songs List */}
            <div className="space-y-1">
              {albumsongs.length > 0 ? (
                albumsongs.map((song, index) => {
                  const isCurrentPlaying = currentPlayingIndex === index;
                  const isSongFavorite = isFavorite(song.id);
                  
                  return (
                    <div
                      key={song._id || song.id || index}
                      className={`grid grid-cols-[16px_1fr_60px_100px] gap-4 px-6 py-3 rounded-lg group transition-all duration-300 cursor-pointer ${
                        isCurrentPlaying 
                          ? 'bg-green-500/20 border border-green-500/30' 
                          : 'hover:bg-white/10'
                      }`}
                      onClick={() => playSong(song)}
                    >
                      {/* Track Number / Play Button */}
                      <div className="flex items-center justify-center relative">
                        {isCurrentPlaying && isPlaying ? (
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-sm animate-pulse"></div>
                          </div>
                        ) : (
                          <>
                            <span className="group-hover:hidden text-gray-400 text-sm font-medium">
                              {index + 1}
                            </span>
                            <div className="hidden group-hover:flex">
                              <FaPlay className="w-3 h-3 text-white" />
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Song Info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={song.thumbnail || albumsData.thumbnail || "/placeholder.jpg"}
                          alt={song.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-medium truncate transition-colors ${
                            isCurrentPlaying ? "text-green-500" : "text-white"
                          }`}>
                            {song.title}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">
                            {song.artist || albumsData.artist || "Unknown Artist"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeSong(song.id);
                          }}
                          className={`p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                            isSongFavorite 
                              ? 'text-red-500 opacity-100' 
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          {isSongFavorite ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                        </button>
                        
                        {isAuth && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToPlaylist(song.id);
                            }}
                            className="p-2 rounded-full text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <FaEllipsisH className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Duration */}
                      <div className="flex items-center justify-end">
                        <span className="text-gray-400 text-sm">
                          {formatDuration(song.duration)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🎤</div>
                  <h3 className="text-2xl font-bold text-gray-300 mb-4">No Songs Yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto text-lg">
                    This album is waiting for its tracks to be added. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Albums Section */}
          {albumsongs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">More from {albumsData.artist || "This Artist"}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center py-8 text-gray-500">
                  <FaMusic className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">More albums coming soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>

      <Player />
    </div>
  );
};

export default Album;