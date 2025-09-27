import { FaMusic } from "react-icons/fa6"

const PlayListCard = () => {
  return (
    <div className="flex items-center p-4 rounded-lg shadow-md cursor-pointer hover:bg-[#ffffff26]">
        <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center ">
          <FaMusic className="w-6 h-6 text-white"/>
        </div>
    </div>
  )
}

export default PlayListCard