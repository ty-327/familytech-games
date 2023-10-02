import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { GAMES } from '@/data/games';

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export const GameProvider = ({ children }) => {
  const defaultGame = {
    title: 'FamilyTech Games'
  }
  const [game, setGame] = useState(defaultGame)
  const router = useRouter()

  useEffect(() => {
    const newGame = GAMES.find((g) => g.url === router.pathname);
    if (newGame) {
      setGame(newGame);
      console.log(newGame)
    } else {
      setGame(defaultGame);
    }
  }, [router.pathname]);

  const updateGame = (val) => {
    setGame(val)
  }
  
  const context = {
    game,
    updateGame
  };
  return (
    <GameContext.Provider value={context}>{children}</GameContext.Provider>
  );
};
