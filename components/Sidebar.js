import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";

import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
  const spotifyApi = useSpotify();

  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  const colors = [];

  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setTotal(data.body.total);
        if (data.body.total <= 20) {
          setPlaylists(data.body.items);
        }
      });
    }
  }, [session, spotifyApi]);

  useEffect(() => {
    if (total > 20) {
      // generate a for loop to get all playlists
      let newPL = [];
      for (let i = 0; i <= total; i = i + 20) {
        spotifyApi.getUserPlaylists({ limit: 20, offset: i }).then((data) => {
          data.body.items.map((playlist) => {
            //Make sure there are no duplicates
            if (!newPL.includes(playlist)) {
              newPL = [...newPL, playlist];
            }
          });

          setPlaylists(newPL);
        });
      }
    }
  }, [total]);

  return (
    <div
      className="text-gray-400 p-5 text-xs border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] 
    lg:max-w-[15rem] lg:text-sm hidden md:inline-flex pb-36"
    >
      <div className="space-y-4 ml-2 font-semibold">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-500" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h5 w-5" />
          <p>Your Episodes</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-500" />

        {/* Playlists */}
        {playlists.length > 0 &&
          playlists.map((playlist) => (
            <p
              key={playlist.id}
              onClick={() => {
                setPlaylistId(playlist.id);
              }}
              className="cursor-pointer hover:text-white truncate max-w-xs lg:max-w-[12rem]"
            >
              {playlist.name}
            </p>
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
