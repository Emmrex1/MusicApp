
import React from "react";
import AlbumCard from "../../components/AlbumCard";
import Layout from "../../components/Layout";
import Player from "../../components/Player";
import SongCard from "../../components/SongCard";
import { useSongAlbumData } from "../../context/songcontext";

const Home: React.FC = () => {
  const { albums, songs, loading } = useSongAlbumData();

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Layout>
        {loading ? (
          <p className="text-gray-400 text-center py-10 text-lg">
            Loading content...
          </p>
        ) : (
          <>
            {/* Albums Section */}
            <section className="mb-8">
              <h1 className="my-5 font-bold text-2xl tracking-wide">
                Featured Albums
              </h1>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-700">
                {albums.length > 0 ? (
                  albums.map((album) => (
                    <AlbumCard
                      key={album._id}
                      image={album.thumbnail}
                      name={album.title}
                      desc={album.description}
                      id={album._id}
                    />
                  ))
                ) : (
                  <p className="text-gray-400">No albums available.</p>
                )}
              </div>
            </section>

            {/* Songs Section */}
            <section className="mb-8">
              <h1 className="my-5 font-bold text-2xl tracking-wide">
                Today’s Top Hits
              </h1>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-700">
                {songs.length > 0 ? (
                  songs.map((song) => (
                    <SongCard
                      key={song._id}
                      image={song.thumbnail}
                      name={song.title}
                      desc={song.description}
                      id={song._id}
                    />
                  ))
                ) : (
                  <p className="text-gray-400">No songs available.</p>
                )}
              </div>
            </section>
          </>
        )}
      </Layout>

      <Player />
    </div>
  );
};

export default Home;
