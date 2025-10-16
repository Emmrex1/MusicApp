
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUserData } from "./context/Usercontext";
import Home from "./pages/Home/home";
import LoginForm from "./pages/Auth/Login";
import RegisterForm from "./pages/Auth/Register";

function App() {
  const { loading } = useUserData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full bg-green-500 opacity-20 blur-2xl animate-ping"></div>
          <div className="relative w-16 h-16 rounded-full bg-green-500 animate-pulse flex items-center justify-center">
            <img
              src="/spotify logo.png"
              alt="Spotify"
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>
        <p className="mt-6 text-gray-300 font-medium tracking-wide animate-pulse">
          Loading your experience...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginForm />} />
         <Route path="/register" element={<RegisterForm/>} /> 
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/album/:id" element={<AlbumPage />} /> */}
        {/* <Route path="/song/:id" element={<SongPage />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}


      </Routes>
    </Router>
  );
}

export default App;
