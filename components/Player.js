import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import {
  SwitchHorizontalIcon,
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(30);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatState, setRepeatState] = useState("off");

  const repeatStates = ["off", "context", "track"];

  const fetchCurrentTrack = () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setCurrentTrackId(data?.body?.item?.id);
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data?.body?.is_playing);
      });
    });
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const handleShuffle = () => {
    if (isShuffling) {
      spotifyApi.setShuffle(false);
      setIsShuffling(false);
    } else {
      spotifyApi.setShuffle(true);
      setIsShuffling(true);
    }
  };

  const handleRepeat = () => {
    //Write a function to handle repeat
    const currentIndex = repeatStates.indexOf(repeatState);
    const newIndex = currentIndex + 1;
    if (newIndex > repeatStates.length - 1) {
      setRepeatState("off");
      spotifyApi.setRepeat("off");
    } else {
      setRepeatState(repeatStates[newIndex]);
      spotifyApi.setRepeat(repeatStates[newIndex]);
    }
  };

  const debouncedSetVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        console.error(err);
      });
    }, 500),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume <= 100) {
      debouncedSetVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentTrack();
      setVolume(30);
    }
  }, [currentTrackId, session, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsShuffling(data?.body?.shuffle_state);
        setRepeatState(data?.body?.repeat_state);
      });
    }
  }, [spotifyApi]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Song Info */}
      <div className="flex items-center space-x-4">
        <img
          src={songInfo?.album.images?.[0]?.url}
          alt="album"
          className="hidden md:inline h-10 w-10"
        />
        <div>
          <h3>{songInfo?.name}</h3>
          {songInfo?.artists?.map(function (artist, index) {
            return (
              <span className="text-xs text-gray-600" key={index}>
                {(index ? ", " : "") + artist.name}
              </span>
            );
          })}
        </div>
      </div>
      {/* Playback Controls */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon
          onClick={handleShuffle}
          className={`button ${isShuffling ? "text-blue-500" : "text-white"}`}
        />
        <RewindIcon
          onClick={() =>
            spotifyApi.skipToPrevious().then(() => {
              fetchCurrentTrack();
            })
          }
          className="button"
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon className="button w-10 h-10" onClick={handlePlayPause} />
        )}
        <FastForwardIcon
          onClick={() => {
            spotifyApi.skipToNext().then(() => {
              fetchCurrentTrack();
            });
          }}
          className="button"
        />
        <ReplyIcon
          className={`button ${
            repeatState === "context"
              ? "text-blue-500"
              : repeatState === "track"
              ? "text-green-500"
              : "text-white"
          }`}
          onClick={handleRepeat}
        />
      </div>
      {/* Volume Controls */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="button"
          onClick={() => {
            volume > 0 && setVolume(volume - 10);
          }}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          min="0"
          max="100"
          onChange={(e) => setVolume(Number(e.target.value))}
          value={volume}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => {
            volume < 100 && setVolume(volume + 10);
          }}
        />
      </div>
    </div>
  );
}

export default Player;
