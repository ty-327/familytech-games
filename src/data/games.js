import CrosswordRules from "./game_rules/crossword_rules";
import WordScrambleRules from "./game_rules/word_scramble_rules";
import WordSearchRules from "./game_rules/word_search_rules";
import MatchingGameRules from "./game_rules/matching_game_rules";

export const GAMES = [
  {
    title: "Crossword",
    url: "/crossword",
    image:
      "/game_images/crossword.png",
    pitch: <CrosswordRules isPitch={true}/>,
    rules: <CrosswordRules isPitch={false}/>,
    isProductionReady: true,
  },
  {
    title: "Word Scramble",
    url: "/word_scramble",
    image: 
      "/game_images/word_scramble.png",
    pitch: <WordScrambleRules isPitch={true}/>,
    rules: <WordScrambleRules isPitch={false}/>,
    isProductionReady: true,
  },
  {
    title: "Word Search",
    url: "/word_search",
    image:
      "/game_images/word_search2.png",
    pitch: <WordSearchRules isPitch={true}/>,
    rules: <WordSearchRules isPitch={false}/>,
    isProductionReady: true,
  },
  {
    title: "Matching Game",
    url: "/matching_game",
    image:
      "/game_images/matching_game.png",
      pitch: <MatchingGameRules isPitch={true}/>,
      rules: <MatchingGameRules isPitch={false}/>,
    isProductionReady: false,
  },
  

  //The below games are in development
  
  {
    title: "Geneopardy",
    url: "/geneopardy",
    image: "/game_images/default.png",
    rules: "Default instructions",
    isProductionReady: false,
  },
  // {
  //   title: "Matching Game",
  //   url: "/matching_game",
  //   image: "/game_images/default.png",
  //   rules: "Default instructions",
  //   isProductionReady: false,
  // },
  {
    title: "Wheel of Family Fortune",
    url: "/wheel_family_fortune",
    image: "/game_images/default.png",
    rules: "Default instructions",
    isProductionReady: false,
  },
];
