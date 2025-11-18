
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const server = "http://localhost:4003";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
  favorites?: string[];
}

interface UserContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  loginUser: (
    email: string,
    password: string,
    remember: boolean,
    navigate: (path: string) => void
  ) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<void>;
  logout: () => void;
  addToPlaylist: (id: string) => Promise<void>;
  favoriteSongs: string[];
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);

  // Fetch logged-in user data
  const fetchUserData = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${server}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data.user);
      setIsAuth(true);
      
      if (data.user.favorites) {
        setFavoriteSongs(data.user.favorites);
      } else {
        const storedFavorites = localStorage.getItem('favoriteSongs');
        if (storedFavorites) {
          setFavoriteSongs(JSON.parse(storedFavorites));
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Login function
  const loginUser = async (
    email: string,
    password: string,
    remember: boolean,
    navigate: (path: string) => void
  ) => {
    try {
      const { data } = await axios.post(`${server}/api/v1/users/login`, {
        email,
        password,
      });

      if (data?.token) {
        if (remember) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }

        toast.success("Login successful!");
        setIsAuth(true);

        await fetchUserData();
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("Invalid server response. Please try again.");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message || "Invalid credentials. Try again."
      );
    }
  };

  // Register function
  const registerUser = async (
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => {
    try {
      const { data } = await axios.post(`${server}/api/v1/users/register`, {
        name,
        email,
        password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        toast.success("Registration successful! 🎉");
        setIsAuth(true);

        await fetchUserData();
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
    setFavoriteSongs([]);
    toast.success("Logged out successfully.");
  };

  // Add to playlist
  const addToPlaylist = async (id: string) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add songs to your playlist.");
        return;
      }

      const { data } = await axios.post(
        `${server}/api/v1/users/playlist/${id}`, 
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(data?.message || "Song added to your playlist! 🎶");
      await fetchUserData();
    } catch (error: any) {
      console.error("Add to playlist failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Could not add to playlist. Please try again."
      );
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("Please login to favorite songs.");
        return;
      }

      if (!id) {
        toast.error("Invalid song ID.");
        return;
      }

      const isCurrentlyFavorite = favoriteSongs.includes(id);
      
      if (isCurrentlyFavorite) {
        setFavoriteSongs(prev => prev.filter(songId => songId !== id));
        
        try {
          await axios.delete(`${server}/api/v1/users/favorites/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.log("Backend favorites endpoint not available, using frontend only");
        }
        
        const updatedFavorites = favoriteSongs.filter(songId => songId !== id);
        localStorage.setItem('favoriteSongs', JSON.stringify(updatedFavorites));
        
        toast.success("Removed from favorites");
      } else {
        setFavoriteSongs(prev => [...prev, id]);
        
        try {
          await axios.post(
            `${server}/api/v1/users/favorites/${id}`, 
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.log("Backend favorites endpoint not available, using frontend only");
        }
        
        const updatedFavorites = [...favoriteSongs, id];
        localStorage.setItem('favoriteSongs', JSON.stringify(updatedFavorites));
        
        toast.success("Added to favorites! ❤️");
      }
    } catch (error: any) {
      console.error("Toggle favorite failed:", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  const isFavorite = (id: string): boolean => {
    return favoriteSongs.includes(id);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        loading,
        loginUser,
        registerUser,
        addToPlaylist,
        logout,
        favoriteSongs,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};