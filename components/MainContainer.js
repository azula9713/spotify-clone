import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession, signOut } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";
import FastAverageColor from "fast-average-color";

import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Tracklist from "./Tracklist";

function MainContainer() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const fac = new FastAverageColor();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const getMainColor = () => {
    fac
      .getColorAsync(playlist?.images?.[0].url)
      .then((color) => {
        setColor(color.hex);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const bgGradient = {
    backgroundImage: `linear-gradient(to top, #000, ${color})`,
  };

  useEffect(() => {
    setColor(getMainColor());
  }, [playlist]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center space-x-3 bg-black opacity-90 text-white hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt="userimage"
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      {playlist && color && (
        <>
          <section
            style={bgGradient}
            className={`flex items-end space-x-7  h-80 text-white p-8`}
          >
            <img
              src={playlist.images[0].url}
              alt="playlistcover"
              className="h-44 w-44 shadow-2xl"
              id="playlist-cover"
            />
            <div>
              <p className="uppercase">Playlist</p>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold">
                {playlist.name}
              </h2>
            </div>
          </section>
          <div>
            <Tracklist />
          </div>
        </>
      )}
    </div>
  );
}

export default MainContainer;
