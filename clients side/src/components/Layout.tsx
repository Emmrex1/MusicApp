import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex flex-col">
      
      <div className="lg:hidden">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 m-2 px-6 py-4 border border-gray-800 rounded-xl bg-[#121212] overflow-y-auto shadow-lg">
          <div className="hidden lg:block mb-4">
            <Navbar />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
