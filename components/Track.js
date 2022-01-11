import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/duration";

function Track({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className="grid grid-cols-2 hover:bg-gray-900 rounded-lg cursor-pointer"
      onClick={playSong}
    >
      {track.track && (
        <>
          <div className="flex space-x-4 items-center py-4 px-5">
            <p>{order + 1}</p>
            <img
              src={track.track.album.images[0].url}
              alt="album"
              className="h-10 w-10"
            />
            <div>
              <p className="w-48 lg:w-64 truncate text-white">
                {track.track.name}
              </p>
              {track?.track?.artists?.map(function (artist, index) {
                return (
                  <span
                    className="text-xs text-gray-600 max-w-64 truncate"
                    key={index}
                  >
                    {(index ? ", " : "") + artist.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between ml-auto md:ml-0">
            <p className="hidden md:inline w-48 lg:w-96 truncate text-gray-500">
              {track.track.album.name}
            </p>
            <p className="text-gray-500">
              {millisToMinutesAndSeconds(track.track.duration_ms)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Track;
