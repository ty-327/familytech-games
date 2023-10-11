import Clue from "./clue";
import { useEffect, useState } from "react";

function ClueList(props) {
  let { verticalClues, horizontalClues, result } = props;
  const [clueList, setClueList] = useState({ VERTICAL: verticalClues, HORIZONTAL: horizontalClues });
  const [checkedClues, setCheckedClues] = useState({}); //ADDED

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
    let clues = { VERTICAL: verticalClues, HORIZONTAL: horizontalClues };
    return clues;
  }

  //ADDED
  function handleCheckboxChange(direction, clueNumber) {
    const uniqueKey = `${direction}_${clueNumber}`;
    setCheckedClues((prevState) => ({ ...prevState, [uniqueKey]: !prevState[uniqueKey] }));
  }

  clueList.VERTICAL.sort((a, b) => a.CLUE_NUMBER - b.CLUE_NUMBER);
  clueList.HORIZONTAL.sort((a, b) => a.CLUE_NUMBER - b.CLUE_NUMBER);

  for (let i = 0; i < clueList.VERTICAL.length; i++) {
    let hint = result.find((item) => item.answer === clueList.VERTICAL[i].WORD);
    if (hint != null) {
      clueList.VERTICAL[i].CLUE = hint.clue;
    }
  }

  for (let i = 0; i < clueList.HORIZONTAL.length; i++) {
    let hint = result.find((item) => item.answer === clueList.HORIZONTAL[i].WORD);
    if (hint != null) {
      clueList.HORIZONTAL[i].CLUE = hint.clue;
    }
  }

  let duplicateIndexes = [];

  for (let clue1 = 0; clue1 < clueList.HORIZONTAL.length; clue1++) {
    for (let clue2 = clue1 + 1; clue2 < clueList.HORIZONTAL.length; clue2++) {
      if (clueList.HORIZONTAL[clue1].CLUE == clueList.HORIZONTAL[clue2].CLUE && clue1 != clue2) {
        duplicateIndexes.push([clue1, clue2]);
      }
    }
  }

  if (duplicateIndexes) {
    for (let i = duplicateIndexes.length - 1; i >= 0; i--) {
      clueList.HORIZONTAL.splice(duplicateIndexes[i][1], 1);
    }
  }

  duplicateIndexes = [];

  for (let clue1 = 0; clue1 < clueList.VERTICAL.length; clue1++) {
    for (let clue2 = clue1 + 1; clue2 < clueList.VERTICAL.length; clue2++) {
      if (clueList.VERTICAL[clue1].CLUE == clueList.VERTICAL[clue2].CLUE && clue1 != clue2) {
        duplicateIndexes.push([clue1, clue2]);
      }
    }
  }

  if (duplicateIndexes) {
    for (let i = duplicateIndexes.length - 1; i >= 0; i--) {
      clueList.VERTICAL.splice(duplicateIndexes[i][1], 1);
    }
  }

  duplicateIndexes = [];

  for (let clue1 = 0; clue1 < clueList.HORIZONTAL.length; clue1++) {
    for (let clue2 = clue1 + 1; clue2 < clueList.VERTICAL.length; clue2++) {
      if (clueList.HORIZONTAL[clue1].CLUE == clueList.VERTICAL[clue2].CLUE && clue1 != clue2) {
        duplicateIndexes.push([clue1, clue2]);
      }
    }
  }

  if (duplicateIndexes) {
    for (let i = duplicateIndexes.length - 1; i >= 0; i--) {
      clueList.VERTICAL.splice(duplicateIndexes[i][1], 1);
    }
  }
  //CHANGES TO THIS AS WELL
  return (
    <>
      <div>
        <h1>Clues</h1>
        <h2>Down</h2>
        <p>
          <i>
            Check the box next to a clue to mark it as 'done!' <br />
            Note: Names are all full names in all caps, no spaces <br />
            ex: JOHNDOE
          </i>
        </p>
        {clueList.VERTICAL.map((clues) => {
          return (
            <div key={clues.CLUE_NUMBER} style={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" onChange={() => handleCheckboxChange("VERTICAL", clues.CLUE_NUMBER)} style={{ marginRight: "8px" }} />
              <Clue number={clues.CLUE_NUMBER} word={clues.WORD} clue={clues.CLUE} strikethrough={checkedClues[`VERTICAL_${clues.CLUE_NUMBER}`]} />
            </div>
          );
        })}
        <h2>Across</h2>
        {clueList.HORIZONTAL.map((clues) => {
          return (
            <div key={clues.CLUE_NUMBER} style={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" onChange={() => handleCheckboxChange("HORIZONTAL", clues.CLUE_NUMBER)} style={{ marginRight: "8px" }} />
              <Clue number={clues.CLUE_NUMBER} word={clues.WORD} clue={clues.CLUE} strikethrough={checkedClues[`HORIZONTAL_${clues.CLUE_NUMBER}`]} />
            </div>
          );
        })}
        <h3>Answers can be seen by right-clicking the clue</h3>
      </div>
    </>
  );
}

export default ClueList;
