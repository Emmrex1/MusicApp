// components/SongCard.tsx
import { FaBookBookmark, FaPlay } from "react-icons/fa6";
import { Button } from "./ui/button";
import { useSongAlbumData } from "../context/songcontext";
import { useUserData } from "../context/Usercontext";
import { toast } from "sonner";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { playSong } = useSongAlbumData();
  const { addToPlaylist, isAuth } = useUserData();

  const {} = useSongAlbumData();

  const saveToPlaylistHandler = () => {
  if (!isAuth) {
    toast.error("Please login to add songs to your playlist.");
    return;
  }

  if (!id) {
    toast.error("Invalid song ID — cannot add to playlist.");
    return;
  }

  addToPlaylist(id);
};


  return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
      <div className="relative group">
        <img
          src={image || "/download.png"}
          className="mr-1 w-[160px] rounded"
          alt={name}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => playSong(id)}
            className="absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaPlay />
          </Button>
             {isAuth && (
          <Button
            onClick={saveToPlaylistHandler}
            className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaBookBookmark />
          </Button>
          )}
        </div>
      </div>
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc.slice(0, 20)}...</p>
    </div>
  );
};

export default SongCard;
