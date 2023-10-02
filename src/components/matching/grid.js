import styles from "@/styles/matching.module.css";
import { useState, useEffect } from "react";
import { PersonImage } from "../person_image";
import { useUser } from "@/contexts/UserContext";

function Grid() {

  const { userFSData } = useUser();
  let board = [];

  const [boardData, setBoardData] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (matchedCards.length === 18) {
      setGameOver(true);
    }
  }, [matchedCards]);

  useEffect(() => {
    initialize();
  }, []);

  const getAncestors = () => {
    console.log(userFSData);
    while (board.length < 9) {
      const keysArray = Array.from(userFSData.keys());
      const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
      const newObject = {
        firstName: userFSData.get(randomKey).name.first,
        gender: userFSData.get(randomKey).gender,
        pid: userFSData.get(randomKey).pid
      };
      
      const isDuplicate = board.some(obj =>
        obj.firstName === newObject.firstName &&
        obj.gender === newObject.gender &&
        obj.pid === newObject.pid
      );
  
      if (!isDuplicate) {
        board.push(newObject);
      }
    }
  
    console.log(board);
  }

  const shuffle = () => {
    const shuffledCards = [...board, ...board]
      .sort(() => Math.random() - 0.5)
      .map((v) => v);

    setBoardData(shuffledCards);
  };

  const initialize = () => {
    getAncestors();
    shuffle();
    setGameOver(false);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
  };

  const updateActiveCards = (i) => {
    if (!flippedCards.includes(i)) {
      if (flippedCards.length === 1) {
        const firstIdx = flippedCards[0];
        const secondIdx = i;
        if (boardData[firstIdx] === boardData[secondIdx]) {
          setMatchedCards((prev) => [...prev, firstIdx, secondIdx]);
        }

        setFlippedCards([...flippedCards, i]);
      } else if (flippedCards.length === 2) {
        console.log("flipped is 1");
        setFlippedCards([i]);
      } else {
        setFlippedCards([...flippedCards, i]);
      }

      setMoves((v) => v + 1);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.menu}>
        <p>{`Moves - ${moves}`}</p>
      </div>

      <div className={styles.board}>
        {boardData.map((data, i) => {
          const flipped = flippedCards.includes(i) ? true : false;
          const matched = matchedCards.includes(i) ? true : false;
          return (
            <div
              onClick={() => {
                updateActiveCards(i);
              }}
              key={i}
              className={`${styles.card} ${flipped || matched ? styles.active : ""} ${
                matched ? styles.matched : ""
              } ${gameOver ? styles.gameOver : ""}`}
            >
              {flipped ? (
                <PersonImage
                pid={data.pid}
                imageHeight={100}
                imageWidth={100}
                gender={data.gender}
              />
              ) : (
                ""
              )}

              {/* { <div>{data.firstName}</div> }
              <PersonImage
                pid={data.pid}
                imageHeight={100}
                imageWidth={100}
                gender={data.gender}
              /> */}
            </div>
          );
        })}
      </div>
      <div className={styles.menu}>
        <p>{`GameOver - ${gameOver}`}</p>
        <button onClick={() => initialize()}>Reset</button>
      </div>
    </div>
  );
}

export default Grid;