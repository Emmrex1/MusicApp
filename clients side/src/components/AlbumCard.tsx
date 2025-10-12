
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

  return (
    <div
      onClick={() => navigate(`/album/${id}`)}
      className="min-w-[180px] bg-[#1f1f1f] hover:bg-[#2c2c2c] rounded-lg p-3 cursor-pointer transition-all duration-300"
    >
      <img
        src={image || "/placeholder.jpg"}
        alt={name}
        className="rounded-lg w-[160px] h-[160px] object-cover"
      />
      <p className="font-bold mt-2 mb-1 text-sm truncate">{name}</p>
      <p className="text-gray-400 text-xs truncate">{desc}</p>
    </div>
  );
};

export default AlbumCard;
