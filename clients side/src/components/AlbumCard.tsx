
// import React from "react";
// import { useNavigate } from "react-router-dom";

// interface AlbumCardProps {
//   image: string;
//   name: string;
//   desc: string;
//   id: string;
// }

// const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     if (!id || id === 'undefined') {
//       console.error('Invalid album ID, cannot navigate');
//       return;
//     }
//     navigate(`/album/${id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="min-w-[180px] bg-[#1f1f1f] hover:bg-[#2c2c2c] rounded-lg p-3 cursor-pointer transition-all duration-300"
//     >
//       <img
//         src={image || "/placeholder.jpg"}
//         alt={name}
//         className="rounded-lg w-[160px] h-[160px] object-cover"
//       />
//       <p className="font-bold mt-2 mb-1 text-sm truncate">{name}</p>
//       <p className="text-gray-400 text-xs truncate">{desc}</p>
//     </div>
//   );
// };

// export default AlbumCard;
import React from "react";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (!id || id === 'undefined') return;
    navigate(`/album/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-[#181818] hover:bg-[#282828] rounded-lg p-4 cursor-pointer transition-all duration-300 active:scale-95"
    >
      <div className="relative mb-4">
        {/* Image Container */}
        <div className="relative aspect-square rounded-lg shadow-2xl overflow-hidden">
          {!imageLoaded && (
            <div className="w-full h-full bg-gray-800 animate-pulse rounded-lg"></div>
          )}
          <img
            src={image || "/placeholder.jpg"}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Play Button Overlay */}
          <div className={`absolute bottom-2 right-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <button className="bg-green-500 hover:bg-green-400 text-black rounded-full p-3 shadow-2xl transform hover:scale-105 transition-all duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Text Content */}
      <div className="min-h-[60px] space-y-1">
        <p className="font-bold text-white truncate group-hover:text-green-400 transition-colors duration-200">
          {name}
        </p>
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default AlbumCard;