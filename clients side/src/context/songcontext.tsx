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
  id: string;
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
  albumsongs: Song[];
  albumsData: Album | null;
  fetchAlbumSongs: (id: string) => Promise<void>;
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
  const [albumsongs, setAlbumsongs] = useState<Song[]>([]);
  const [albumsData, setAlbumsData] = useState<Album | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<number>(0);

  // Fetch all songs
  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/v1/song/all`);
      const normalizedSongs: Song[] = (data.songs || []).map((song: any) => ({
        ...song,
        id: song._id ?? song.id,
        _id: song._id ?? song.id,
      }));
      setSongs(normalizedSongs);
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

  // Fetch songs for a specific album
  const fetchAlbumSongs = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ songs: Song[]; album: Album }>(
        `${server}/api/v1/song/album/${id}`
      );
      setAlbumsData(data.album);
      setAlbumsongs(data.songs || []);
    } catch (err: any) {
      setError(err.message || "Error fetching album songs");
    } finally {
      setLoading(false);
    }
  }, []);

  // Play specific song
  const playSong = (id: string) => {
    const song = songs.find((s) => s.id === id);
    if (song) {
      setSelectedSong(song);
      setIsPlaying(true);
      setIndex(songs.indexOf(song));
    }
  };

  // Toggle play/pause
  const togglePlay = () => setIsPlaying((prev) => !prev);

  // Next/Previous
  const nextSong = () => {
    if (!songs.length) return;
    const nextIndex = (index + 1) % songs.length;
    setIndex(nextIndex);
    setSelectedSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (!songs.length) return;
    const prevIndex = index === 0 ? songs.length - 1 : index - 1;
    setIndex(prevIndex);
    setSelectedSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  // Auto-fetch global data once
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
        albumsongs,
        albumsData,
        fetchAlbumSongs,
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
