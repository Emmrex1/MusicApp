
import axios from "axios";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  type ReactNode,
} from "react";


const server = "http://localhost:7000";

export interface Song {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album: string;
}

export interface Album {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface SongAlbumContextType {
  songs: Song[];
  albums: Album[];
  loading: boolean;
  error: string | null;
  selectedSong: Song | null;
  isPlaying: boolean;
  playSong: (id: string) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  refreshSongs: () => void;
  refreshAlbums: () => void;
}

const SongAlbumContext = createContext<SongAlbumContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const SongAlbumProvider: React.FC<Props> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<number>(0);

  // Fetch all songs
  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/v1/song/all`);
      setSongs(data.songs || []);
    } catch (err: any) {
      setError(err.message || "Error fetching songs");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all albums
  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/v1/album/all`);
      setAlbums(data.albums || []);
    } catch (err: any) {
      setError(err.message || "Error fetching albums");
    } finally {
      setLoading(false);
    }
  }, []);

  // Play specific song
  const playSong = (id: string) => {
    const song = songs.find((s) => s._id === id);
    if (song) {
      setSelectedSong(song);
      setIsPlaying(true);
      setIndex(songs.indexOf(song));
    }
  };

  // Toggle play/pause
  const togglePlay = () => setIsPlaying((prev) => !prev);

  // Next/Previous song
  const nextSong = () => {
    if (songs.length === 0) return;
    const nextIndex = (index + 1) % songs.length;
    setIndex(nextIndex);
    setSelectedSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    const prevIndex = index === 0 ? songs.length - 1 : index - 1;
    setIndex(prevIndex);
    setSelectedSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, [fetchSongs, fetchAlbums]);

  return (
    <SongAlbumContext.Provider
      value={{
        songs,
        albums,
        loading,
        error,
        selectedSong,
        isPlaying,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        refreshSongs: fetchSongs,
        refreshAlbums: fetchAlbums,
      }}
    >
      {children}
    </SongAlbumContext.Provider>
  );
};

export const useSongAlbumData = (): SongAlbumContextType => {
  const context = useContext(SongAlbumContext);
  if (!context) {
    throw new Error("useSongAlbumData must be used within a SongAlbumProvider");
  }
  return context;
};
