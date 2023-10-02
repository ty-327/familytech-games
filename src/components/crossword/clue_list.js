import Clue from "./clue";
import { useEffect, useState } from "react";

function ClueList(props) {
  let { verticalClues, horizontalClues, result } = props;
  const [clueList, setClueList] = useState({VERTICAL: verticalClues, HORIZONTAL:horizontalClues});
  useEffect(() => {
    setClueList(makeClueList());
  }, []);
  function makeClueList() {
    for (let i = 0; i < verticalClues.length; i++) {
      verticalClues[i].CLUE = verticalClues[i].WORD;
    }
    for (let i = 0; i < horizontalClues.length; i++) {
      horizontalClues[i].CLUE = horizontalClues[i].WORD;
    }
    let clues = {VERTICAL: verticalClues, HORIZONTAL: horizontalClues}
    return clues;
  }
  clueList.VERTICAL.sort((a, b) => a.CLUE_NUMBER - b.CLUE_NUMBER);
  clueList.HORIZONTAL.sort((a, b) => a.CLUE_NUMBER - b.CLUE_NUMBER); 

  for (let i = 0; i < clueList.VERTICAL.length; i++) {
    let hint = result.find(item => item.answer === clueList.VERTICAL[i].WORD);
    if (hint != null) {
      clueList.VERTICAL[i].CLUE = hint.clue
    }
  }

  for (let i = 0; i < clueList.HORIZONTAL.length; i++) {
    let hint = result.find(item => item.answer === clueList.HORIZONTAL[i].WORD);
    if (hint != null) {
      clueList.HORIZONTAL[i].CLUE = hint.clue
    }
  }

  return (
    <>
      <div>
        <h1>Clues</h1>
        <h2>Down</h2>
        {clueList.VERTICAL.map((clues) => {
          return (
            <div key={clues.CLUE_NUMBER}>
              <Clue number={clues.CLUE_NUMBER} word={clues.WORD} clue={clues.CLUE} />
            </div>
          );
        })}
        <h2>Across</h2>
        {clueList.HORIZONTAL.map((clues) => {
          return (
            <div key={clues.CLUE_NUMBER}>
              <Clue number={clues.CLUE_NUMBER} word={clues.WORD} clue={clues.CLUE} />
            </div>
          );
        })}
        <h3>Answers can be seen by right-clicking the clue</h3>
      </div>
    </>
  );
}
export default ClueList;