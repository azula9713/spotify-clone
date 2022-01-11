import { getSession } from "next-auth/react";
import Head from "next/head";
import MainContainer from "../components/MainContainer";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg-black h-screen overflow-hidden">
        <main className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Center */}
          <MainContainer />
        </main>
        <section className="sticky bottom-0">
          <Player />
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
