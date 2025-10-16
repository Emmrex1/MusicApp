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
}

interface UserContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  loginUser: (email: string, password: string, remember: boolean, navigate: (path: string) => void) => Promise<void>;
  registerUser: (name: string, email: string, password: string, navigate: (path: string) => void) => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  //  LOGIN FUNCTION
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

      setTimeout(() => navigate("/"), 2000);
    } else {
      toast.error("Invalid server response. Please try again.");
    }
  } catch (error: any) {
    console.error("Login failed:", error);
    toast.error(error.response?.data?.message || "Invalid credentials. Try again.");
  }
};

//  REGISTER FUNCTION
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
        toast.success("Registration successful! Welcome aboard 🎉");
        setIsAuth(true);

        await fetchUserData();
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  //  LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
     toast.success("Logged out successfully.")
  };

  //  FETCH USER
  const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const { data } = await axios.get(`${server}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(data.user);
    setIsAuth(true);
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

  return (
    <UserContext.Provider value={{ user, isAuth, loading, loginUser, registerUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};
