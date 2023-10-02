import { useEffect } from "react";
import Head from "next/head";
import { Box, Grid } from "@mui/material";

import Game from "@/components/home/game";
import { GAMES } from "@/data/games";
import styles from "@/styles/Home.module.css";



export default function Home() {

  // To change background color of body
  useEffect(() => {
    document.documentElement.style.setProperty('--background', 'white');
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>FamilyTech Games</title>

        <meta name="description" content="Free, fun family history games" />
        <meta name="keywords"    content="Family, Family History, Genealogy, Ancestor, Relative, Games" />
        <meta name="theme-color" content="#2a3492" /> {/* var(--blue) in globals.css */}

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon"     href="/favicon.ico" />
      </Head>


      <Box sx={{ flexGrow: 1 }}>
        {/* See https://mui.com/material-ui/react-grid/#auto-layout for more details on the Box and Grid tags */}

        <Grid
          container
          spacing={{ xs: 3, md: 4 }}
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        >
          {/* xs, sm, md, lg define the amount of spacing between items and number of columns
            when the screen is mobile-sized, tablet-sized, and desktop-sized respectively */}


          {/* Create a Game component for each object in the GAMES array */}
          {GAMES.map((game) => {
            return (
              <Grid item xs={1} sm={1} md={1} key={game.title}>
                <Game
                  title={game.title}
                  image={game.image}
                  url={game.url}
                  rules={game.rules}
                  pitch={game.pitch}
                  prodReady={game.isProductionReady}
                  // When mapping arrays in React, each child should have a unique id.
                  key={game.title}
                ></Game>
              </Grid>
            );
          })}


        </Grid>
      </Box>

    </div>
  );
}
