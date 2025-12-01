
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../context/Usercontext";
import { useSongAlbumData } from "../../context/songcontext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  FaMusic,
  FaUsers,
  FaChartLine,
  FaUpload,
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
//   FaFilter,
//   FaSort,
//   FaCalendar,
  FaPlay,
//   FaPause,
//   FaDownload,
  FaCog
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const server = "http://localhost:5000";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { albums, songs, fetchAlbums, fetchSongs } = useSongAlbumData();

  // Form states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [album, setAlbum] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [albumDescription, setAlbumDescription] = useState<string>('');
  const [albumThumbnail, setAlbumThumbnail] = useState<File | null>(null);
  
  // UI states
  const [btnloading, setBtnLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [allUsers, setAllUsers] = useState<any[]>([]);
   const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [showSongModal, setShowSongModal] = useState<boolean>(false);
   const [showAlbumModal, setShowAlbumModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{type: string, id: string, name: string} | null>(null);
  
  // Statistics states
  const [statistics, setStatistics] = useState({
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalPlays: 12543,
    totalDownloads: 8921,
    activeUsers: 324,
    revenue: 1250.50,
    growthRate: 12.5
  });

  // Chart data
  const [chartData, setChartData] = useState({
    playsOverTime: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Plays',
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }]
    },
    genreDistribution: {
      labels: ['Pop', 'Hip Hop', 'Rock', 'Jazz', 'Electronic'],
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }]
    },
    userActivity: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Active Users',
        data: [120, 190, 300, 500, 200, 300, 400],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    }
  });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
    fetchStatistics();
    fetchAllUsers();
  }, [user, navigate]);

  const fetchStatistics = async () => {
    try {
      // Update with actual data
      setStatistics({
        totalSongs: songs.length,
        totalAlbums: albums.length,
        totalUsers: 1000, 
        totalPlays: 12543,
        totalDownloads: 8921,
        activeUsers: 324,
        revenue: 1250.50,
        growthRate: 12.5
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${server}/api/v1/users/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for demo
      setAllUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', joined: '2024-01-15', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'premium', joined: '2024-01-10', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', joined: '2024-01-05', status: 'inactive' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'admin', joined: '2024-01-01', status: 'active' }
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !album || !songFile || !artist) {
      toast.error('Please fill all required fields');
      return;
    }

    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('album', album);
      formData.append('artist', artist);
      formData.append('song', songFile);
      if (thumbnail) formData.append('thumbnail', thumbnail);

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.post(`${server}/api/v1/song/new`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Song added successfully!');
        setTitle('');
        setDescription('');
        setAlbum('');
        setArtist('');
        setSongFile(null);
        setThumbnail(null);
        fetchSongs();
        setShowSongModal(false);
      }
    } catch (error: any) {
      console.error('Error adding song:', error);
      toast.error(error.response?.data?.message || 'Failed to add song');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleAddAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle || !albumDescription || !albumThumbnail) {
      toast.error('Please fill all required fields');
      return;
    }

    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', albumTitle);
      formData.append('description', albumDescription);
      formData.append('thumbnail', albumThumbnail);

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.post(`${server}/api/v1/album/new`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Album added successfully!');
        setAlbumTitle('');
        setAlbumDescription('');
        setAlbumThumbnail(null);
        fetchAlbums();
        setShowAlbumModal(false);
      }
    } catch (error: any) {
      console.error('Error adding album:', error);
      toast.error(error.response?.data?.message || 'Failed to add album');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const endpoint = itemToDelete.type === 'song' 
        ? `${server}/api/v1/song/${itemToDelete.id}`
        : `${server}/api/v1/album/${itemToDelete.id}`;

      const response = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} deleted successfully`);
        if (itemToDelete.type === 'song') {
          fetchSongs();
        } else {
          fetchAlbums();
        }
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.put(
        `${server}/api/v1/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('User role updated successfully');
        fetchAllUsers();
      }
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.put(
        `${server}/api/v1/users/${userId}/ban`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('User banned successfully');
        fetchAllUsers();
      }
    } catch (error: any) {
      console.error('Error banning user:', error);
      toast.error(error.response?.data?.message || 'Failed to ban user');
    }
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statsCards = [
    { label: 'Total Songs', value: statistics.totalSongs, icon: <FaMusic />, color: 'bg-green-500/20 text-green-400', change: '+12%' },
    { label: 'Total Albums', value: statistics.totalAlbums, icon: <FaChartLine />, color: 'bg-blue-500/20 text-blue-400', change: '+8%' },
    { label: 'Total Users', value: statistics.totalUsers, icon: <FaUsers />, color: 'bg-purple-500/20 text-purple-400', change: '+15%' },
    { label: 'Total Plays', value: statistics.totalPlays.toLocaleString(), icon: <FaPlay />, color: 'bg-orange-500/20 text-orange-400', change: '+23%' },
    { label: 'Revenue', value: `$${statistics.revenue.toLocaleString()}`, icon: <FaChartLine />, color: 'bg-emerald-500/20 text-emerald-400', change: '+18%' },
    { label: 'Active Users', value: statistics.activeUsers, icon: <FaUsers />, color: 'bg-pink-500/20 text-pink-400', change: '+5%' },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#000000] text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#000000] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-gray-900">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage your music platform</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-green-500/50 w-64"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-gray-900 min-h-[calc(100vh-80px)] p-4">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine /> },
              { id: 'songs', label: 'Songs', icon: <FaMusic /> },
              { id: 'albums', label: 'Albums', icon: <FaChartLine /> },
              { id: 'users', label: 'Users', icon: <FaUsers /> },
              { id: 'upload', label: 'Upload', icon: <FaUpload /> },
              { id: 'settings', label: 'Settings', icon: <FaCog /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowSongModal(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors text-sm"
              >
                <FaPlus className="w-4 h-4" />
                Add New Song
              </button>
              <button
                onClick={() => setShowAlbumModal(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-sm"
              >
                <FaPlus className="w-4 h-4" />
                Add New Album
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {statsCards.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${stat.color} bg-opacity-20`}>
                            {stat.icon}
                          </div>
                          <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            {stat.change}
                          </span>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Plays Over Time</h3>
                      <div className="h-64">
                        <Line
                          data={chartData.playsOverTime}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(255,255,255,0.1)' }
                              },
                              x: {
                                grid: { color: 'rgba(255,255,255,0.1)' }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Genre Distribution</h3>
                      <div className="h-64">
                        <Pie
                          data={chartData.genreDistribution}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'right',
                                labels: { color: '#9ca3af' }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { user: 'John Doe', action: 'uploaded a new song', time: '2 minutes ago' },
                        { user: 'Jane Smith', action: 'created a playlist', time: '15 minutes ago' },
                        { user: 'Bob Johnson', action: 'purchased premium', time: '1 hour ago' },
                        { user: 'Alice Brown', action: 'shared an album', time: '3 hours ago' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                              <span className="text-xs font-bold">{activity.user.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium">{activity.user}</p>
                              <p className="text-sm text-gray-400">{activity.action}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Songs Tab */}
              {activeTab === 'songs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Songs Management</h2>
                      <p className="text-gray-400">Manage all songs in your library</p>
                    </div>
                    <button
                      onClick={() => setShowSongModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <FaPlus /> Add Song
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSongs.map((song) => (
                      <div
                        key={song._id}
                        className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={song.thumbnail}
                            alt={song.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate">{song.title}</h4>
                            <p className="text-sm text-gray-400 truncate">{song.artist || 'Unknown Artist'}</p>
                            <p className="text-xs text-gray-500 mt-1">{song.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-gray-500">Album: {song.album}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedSong(song);
                                setShowSongModal(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setItemToDelete({ type: 'song', id: song._id, name: song.title });
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/song/${song._id}`)}
                              className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
                              title="View"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Albums Tab */}
              {activeTab === 'albums' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Albums Management</h2>
                      <p className="text-gray-400">Manage all albums in your library</p>
                    </div>
                    <button
                      onClick={() => setShowAlbumModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <FaPlus /> Add Album
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAlbums.map((album) => (
                      <div
                        key={album._id}
                        className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={album.thumbnail}
                            alt={album.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate">{album.title}</h4>
                            <p className="text-sm text-gray-400 truncate">{album.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <button
                            onClick={() => navigate(`/album/${album._id}`)}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            View Songs
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedAlbum(album);
                                setShowAlbumModal(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setItemToDelete({ type: 'album', id: album._id, name: album.title });
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Users Management</h2>
                      <p className="text-gray-400">Manage all users and their permissions</p>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <FaPlus /> Invite User
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left p-4 font-medium">User</th>
                          <th className="text-left p-4 font-medium">Email</th>
                          <th className="text-left p-4 font-medium">Role</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Joined</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-800/50 hover:bg-white/5">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                                  <span className="text-xs font-bold">{user.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-400">ID: {user.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                className="bg-gray-900 border border-gray-800 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-green-500"
                              >
                                <option value="user">User</option>
                                <option value="premium">Premium</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === 'active'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400">{user.joined}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/profile/${user.id}`)}
                                  className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                                  title="View Profile"
                                >
                                  <FaEye className="w-4 h-4" />
                                </button>
                                {user.role !== 'admin' && (
                                  <button
                                    onClick={() => handleBanUser(user.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                    title="Ban User"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Song Card */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-green-500/20">
                          <FaMusic className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Upload Song</h3>
                          <p className="text-sm text-gray-400">Add a new song to your library</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSongModal(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-700 rounded-xl hover:border-green-500/50 transition-colors flex flex-col items-center justify-center gap-2"
                      >
                        <FaUpload className="w-8 h-8 text-gray-500" />
                        <span className="font-medium">Click to upload song</span>
                        <span className="text-sm text-gray-500">MP3, WAV, FLAC up to 50MB</span>
                      </button>
                    </div>

                    {/* Upload Album Card */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <FaChartLine className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Create Album</h3>
                          <p className="text-sm text-gray-400">Create a new album collection</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAlbumModal(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-700 rounded-xl hover:border-blue-500/50 transition-colors flex flex-col items-center justify-center gap-2"
                      >
                        <FaPlus className="w-8 h-8 text-gray-500" />
                        <span className="font-medium">Create New Album</span>
                        <span className="text-sm text-gray-500">Add multiple songs in one collection</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="max-w-3xl mx-auto">
                  <div className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6">System Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                            <input
                              type="text"
                              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                              placeholder="SoundScape"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                            <textarea
                              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                              rows={3}
                              placeholder="Premium music streaming platform"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Upload Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Max File Size (MB)</label>
                            <input
                              type="number"
                              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                              defaultValue={50}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Allowed File Types</label>
                            <input
                              type="text"
                              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                              defaultValue=".mp3, .wav, .flac, .jpg, .png"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span>New user registrations</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span>Content uploads</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span>System alerts</span>
                          </label>
                        </div>
                      </div>

                      <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Add Song Modal */}
      <AnimatePresence>
        {showSongModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSongModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold">Add New Song</h2>
                <p className="text-gray-400 text-sm mt-1">Fill in the details to add a new song</p>
              </div>
              
              <form onSubmit={handleAddSong} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Song Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                      placeholder="Enter song title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Artist *</label>
                    <input
                      type="text"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                      placeholder="Enter artist name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                    rows={3}
                    placeholder="Enter song description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Album</label>
                  <select
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select an album</option>
                    {albums.map((album) => (
                      <option key={album._id} value={album._id}>{album.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Song File *</label>
                    <input
                      type="file"
                      accept=".mp3,.wav,.flac"
                      onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail Image</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowSongModal(false)}
                    className="px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={btnloading}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {btnloading ? 'Uploading...' : 'Add Song'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Delete {itemToDelete?.type}</h3>
                <p className="text-gray-400 text-center mb-6">
                  Are you sure you want to delete <span className="text-white font-medium">"{itemToDelete?.name}"</span>? 
                  This action cannot be undone.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-2 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteItem}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;