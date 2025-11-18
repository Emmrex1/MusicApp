
import React from "react";
import AlbumCard from "../../components/AlbumCard";
import Layout from "../../components/Layout";
import Player from "../../components/Player";
import SongCard from "../../components/SongCard";
import { useSongAlbumData } from "../../context/songcontext";

const Home: React.FC = () => {
  const { albums, songs, loading } = useSongAlbumData();

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#121212] to-[#000000] min-h-screen text-white">
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading your music...</p>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#121212] to-[#000000] min-h-screen text-white">
      <Layout>
        <div className="p-6 space-y-12">
          {/* Welcome Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Welcome to SoundScape
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover new music, explore albums, and create your perfect playlist.
            </p>
          </section>

          {/* Albums Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Albums</h2>
              <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.length > 0 ? (
                albums.map((album) => (
                  <AlbumCard
                      key={album._id || (album as any).id}
                      image={album.thumbnail}
                      name={album.title}
                      desc={album.description}
                      id={album._id || (album as any).id}
                    />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Albums Available</h3>
                  <p className="text-gray-500">Check back later for new releases.</p>
                </div>
              )}
            </div>
          </section>

          {/* Songs Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Today's Top Hits</h2>
              <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                See More
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {songs.length > 0 ? (
                songs.map((song) => (
                  <SongCard
                    key={song._id || song.id}
                    image={song.thumbnail}
                    name={song.title}
                    desc={song.description}
                    id={song._id || song.id || ""}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🎶</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Songs Available</h3>
                  <p className="text-gray-500">Music coming soon!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </Layout>

      <Player />
    </div>
  );
};

export default Home;