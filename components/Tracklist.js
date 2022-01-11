import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Track from "./Track";

function Tracklist() {
  const playlist = useRecoilValue(playlistState);

  return (
    <div className="text-white px-8 flex flex-col pb-28 space-y-1">
      {playlist.tracks.items.map((track, index) => (
        <Track key={index} track={track} order={index} />
      ))}
    </div>
  );
}

export default Tracklist;
