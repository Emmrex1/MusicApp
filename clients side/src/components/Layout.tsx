import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps>  = ({children}) => {
  return (
    <div className="h-screen">
     <div className="h-[90%] flex">
       < Sidebar/>
       <div className="w-[100%] m-2 px-6 py-4 border-2 rounded-lg bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
             <Navbar/>
             {children}
       </div>
     </div>
    </div>
  )
}

export default Layout