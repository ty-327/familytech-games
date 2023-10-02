import Square from "./square";
import styles from "@/styles/crossword.module.css";
import { useState, useEffect, useRef } from "react";
import ClueList from "./clue_list";
import { Modal } from "@mui/material";
import { useUser } from "@/contexts/UserContext";
import axios from 'axios'

let START_SQUARES = [];

function Board() {
  let BOARD = [];
  let finished = false;
  let ADDED_WORDS = [];
  let NOT_ADDED = [];
  let VERTICAL_WORDS = [];
  let HORIZONTAL_WORDS = [];
  let justAscendencyNums = [];
  let DIMENSIONS = 32;
  const { userFSData } = useUser();
  let ANCESTORS = [];
  let ascendencyNums = [];
  
  //Creates an array of all names that could be added to the crossword
  for (const [key, value] of userFSData) {
    let currentAncestorName = value.name.compressedName;
    ANCESTORS.push({
      CLUE: currentAncestorName,
      ANSWER: currentAncestorName,
      ASCENDENCY_NUM: key,
    });
  }
  let SORTED_CLUE_LIST = sortKeyWords(ANCESTORS);
  let REMAINING_WORDS = SORTED_CLUE_LIST;
  const [clues, setClues] = useState([]);
  const [board, setBoard] = useState([]);
  const [vertClues, setVertClues] = useState([]);
  const [horClues, setHorClues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [puzzleIsCorrect, setPuzzleIsCorrect] = useState(false);
  const inputLocation = useRef(new Array());

  //Tells the page if it should be loading to make sure the clues are all set up before it is shown to the user
  useEffect(() => {
    if (clues.length > 0) {
      setLoading(false);
    }
  }, [clues]);

  useEffect(() => {
    setBoard(
      setUpBoard(
        BOARD,
        SORTED_CLUE_LIST,
        START_SQUARES,
        ADDED_WORDS,
        REMAINING_WORDS,
        NOT_ADDED
      )
    );
  }, []);

  // Handles what happens when the user solves the crossword
  useEffect(() => {
    setPuzzleIsCorrect(puzzleIsCorrect);
  }, [puzzleIsCorrect]);

  // Gets the clue data for each word that is put into the crossword and sets it to the clues variable
  async function fetchData(userFSData, ascendancyNums) {
    //TO TEST LOCALLY, COMMENT OUT THE LOWER URL AND UNCOMMENT THE TOP ONE. THEN WHEN YOU PUSH TO MAIN, MAKE SURE THE TOP URL IS COMMENTED AND THE BOTTOM IS NOT
    //const url = "http://localhost:3000/api/questiongenerator";
    const url = "https://games.byufamilytech.org/api/questiongenerator";
  
    try {
      const res = await axios.post(url, {userFSData, ascendancyNums});
      setClues(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    if (userFSData) {
      console.log("data in if statement " + Array.from(userFSData.values()).length);
      const fsDataObj = Object.fromEntries(userFSData);
      fetchData(fsDataObj, justAscendencyNums);
    }
  }, [])

  // Handles what happens when a letter is changed on the board
  function handleSquareInput(letter, row, col, inputLocation) {
    let newBoard = board;
    newBoard[row].CURRENT_ROW[col].CHARACTER = letter;
    setBoard(newBoard);
    setPuzzleIsCorrect(checkIfFinished());
    if (inputLocation.current[row * DIMENSIONS + col].value == "") {
      if (inputLocation.current[row * DIMENSIONS + col - 1].value != "") {
        inputLocation.current[row * DIMENSIONS + col - 1].focus();
      } else {
        inputLocation.current[row * DIMENSIONS + col - DIMENSIONS].focus();
      }
    } else if (inputLocation.current[row * DIMENSIONS + col - 1].value != "") {
      if (inputLocation.current[row * DIMENSIONS + col + 1].value != "") {
        inputLocation.current[row * DIMENSIONS + col + 2].focus();
      } else {
        inputLocation.current[row * DIMENSIONS + col + 1].focus();
      }
    } else if (
      inputLocation.current[row * DIMENSIONS + col - DIMENSIONS].value != ""
    ) {
      if (
        inputLocation.current[row * DIMENSIONS + col + DIMENSIONS].value != ""
      ) {
        inputLocation.current[row * DIMENSIONS + col + DIMENSIONS * 2].focus();
      } else {
        inputLocation.current[row * DIMENSIONS + col + DIMENSIONS].focus();
      }
    } else {
      if (
        inputLocation.current[row * DIMENSIONS + col + DIMENSIONS].value != ""
      ) {
        inputLocation.current[row * DIMENSIONS + col + DIMENSIONS * 2].focus();
      } else if (
        inputLocation.current[row * DIMENSIONS + col + 1].value != ""
      ) {
        inputLocation.current[row * DIMENSIONS + col + 2].focus();
      } else {
        inputLocation.current[row * DIMENSIONS + col + DIMENSIONS].focus();
        inputLocation.current[row * DIMENSIONS + col + 1].focus();
      }
    }
  }

  // Implements navigating the board with arrow keys and backspace on empty square
  function handleKeyDown(event, row, col, inputLocation) {
    if (event.keyCode === 37) {
      let movedLocation = inputLocation.current[row * DIMENSIONS + col - 1].focus();
      if (movedLocation != null) {
        movedLocation.focus();
        movedLocation.setSelectionRange(1,1);
      }
    } else if (event.keyCode === 38) {
      let movedLocation = inputLocation.current[row * DIMENSIONS + col - DIMENSIONS];
      if (movedLocation != null) {
        movedLocation.focus();
        movedLocation.setSelectionRange(1,1);
      }
    } else if (event.keyCode === 39) {
      inputLocation.current[row * DIMENSIONS + col + 1].focus();
    } else if (event.keyCode === 40) {
      inputLocation.current[row * DIMENSIONS + col + DIMENSIONS].focus();
    }
  }

  // Inserts all of the other words into the board except the first word
  function insertAllWords(
    board,
    remainingWords,
    addedWords,
    START_SQUARES,
    NOT_ADDED
  ) {
    let finished = false;
    let attemptedInsertions = 0;
    while (!finished) {
      for (let i = 0; i < remainingWords.length; i++) {
        attemptedInsertions++;
        let wordInserted = checkAndInsertWord(
          remainingWords[i].ANSWER,
          board,
          remainingWords,
          addedWords,
          START_SQUARES,
          remainingWords[i].ASCENDENCY_NUM
        );
        if (wordInserted == true) {
          break;
        }
      }
      if (remainingWords.length < 1 || attemptedInsertions > 100) {
        finished = true;
      }
      if (finished) {
        if (remainingWords.length > 0) {
          for (let i = 0; i < remainingWords.length; i++) {
            NOT_ADDED.push(remainingWords[i].ANSWER);
          }
        }
      }
    }
    for (let i = 0; i < START_SQUARES.length; i++) {}
  }
  // Locates all of the possible places a word could go on the board and returns an array of those locations
  function checkForCollisions(wordToAdd, currentBoard) {
    let collisions = [];
    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = 0; j < DIMENSIONS; j++) {
        if (wordToAdd.includes(currentBoard[i].CURRENT_ROW[j].KEY_CHARACTER)) {
          collisions.push({
            row: i,
            col: j,
            character: currentBoard[i].CURRENT_ROW[j].KEY_CHARACTER,
          });
        }
      }
    }
    return collisions;
  }

  // Checks that a word can be inserted in a certain spot on the board and if it is possible to insert it, it inserts it
  function checkAndInsertWord(
    wordToAdd,
    board,
    remainingWords,
    addedWords,
    START_SQUARES,
    aNum
  ) {
    let wordInserted = false;
    let foundCollisions = checkForCollisions(wordToAdd, board);
    for (let i = 0; i < foundCollisions.length; i++) {
      let insertCheck = checkIfWordCanBeInserted(
        wordToAdd,
        foundCollisions[i],
        board
      );
      if (insertCheck.INSERT == true) {
        board = insertWord(
          wordToAdd,
          board,
          foundCollisions[i],
          insertCheck.DIRECTION,
          START_SQUARES,
          aNum
        );
        addedWords.push(wordToAdd);
        let wordIndex = remainingWords.findIndex((object) => {
          return object.ANSWER === wordToAdd;
        });
        remainingWords.splice(wordIndex, 1);

        ascendencyNums.push({ ASCENDENCY_NUMBER: aNum, NAME: wordToAdd });
        wordInserted = true;
        break;
      }
    }
    return wordInserted;
  }
  // Given a location that the word could potentially be inserted, it checks if it will collide with other words and accepts or rejects based on the current board state
  function checkIfWordCanBeInserted(wordToAdd, collision, currentBoard) {
    let canInsert = false;
    let direction = "horizontal";
    let charIndex = wordToAdd.indexOf(collision.character);
    let splitWord = wordToAdd.split(collision.character);
    let firstPart = "";
    let secondPart = "";
    if (splitWord.length == 2) {
      firstPart = splitWord[0].split("").reverse();
      secondPart = splitWord[1].split("");
    } else if (splitWord.length > 2) {
      firstPart = splitWord[0].split("").reverse();
      secondPart = splitWord[1];
      for (let i = 2; i < splitWord.length; i++) {
        secondPart += collision.character;
        secondPart += splitWord[i];
      }
    } else {
      if (charIndex == 0) {
        secondPart = splitWord[0].split("");
      } else if ((charIndex = wordToAdd.length - 1)) {
        firstPart = splitWord[0].split("");
      }
    }
    //Check to see if it can be inserted horizontally
    if (
      currentBoard[collision.row].CURRENT_ROW[collision.col + 1]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row].CURRENT_ROW[collision.col - 1]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row + 1].CURRENT_ROW[collision.col + 1]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row - 1].CURRENT_ROW[collision.col + 1]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row + 1].CURRENT_ROW[collision.col - 1]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row - 1].CURRENT_ROW[collision.col - 1]
        .KEY_CHARACTER === "*"
    ) {
      for (let i = 1; i <= firstPart.length; i++) {
        if (
          (currentBoard[collision.row].CURRENT_ROW[collision.col - i]
            .KEY_CHARACTER === "*" ||
            currentBoard[collision.row].CURRENT_ROW[collision.col - i]
              .KEY_CHARACTER === firstPart[i - 1]) &&
          currentBoard[collision.row].CURRENT_ROW[collision.col - i]
            .AVAILABLE == true &&
          currentBoard[collision.row + 1].CURRENT_ROW[collision.col - i]
            .KEY_CHARACTER == "*" &&
          currentBoard[collision.row - 1].CURRENT_ROW[collision.col - i]
            .KEY_CHARACTER == "*" &&
          currentBoard[collision.row].CURRENT_ROW[collision.col - i - 1]
            .AVAILABLE == true
        ) {
          canInsert = true;
        } else {
          canInsert = false;
          return { INSERT: canInsert, DIRECTION: direction };
        }
      }
      for (let i = 1; i <= secondPart.length; i++) {
        if (
          (currentBoard[collision.row].CURRENT_ROW[collision.col + i]
            .KEY_CHARACTER === "*" ||
            currentBoard[collision.row].CURRENT_ROW[collision.col + i]
              .KEY_CHARACTER === secondPart[i - 1]) &&
          currentBoard[collision.row].CURRENT_ROW[collision.col + i]
            .AVAILABLE == true &&
          currentBoard[collision.row + 1].CURRENT_ROW[collision.col + i]
            .KEY_CHARACTER == "*" &&
          currentBoard[collision.row - 1].CURRENT_ROW[collision.col + i]
            .KEY_CHARACTER == "*" &&
          currentBoard[collision.row].CURRENT_ROW[collision.col + i + 1]
            .AVAILABLE == true
        ) {
          canInsert = true;
        } else {
          canInsert = false;
          return { INSERT: canInsert, DIRECTION: direction };
        }
      }
    }
    if (
      currentBoard[collision.row + 1].CURRENT_ROW[collision.col]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row - 1].CURRENT_ROW[collision.col]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row + 1].CURRENT_ROW[collision.col + 1]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row - 1].CURRENT_ROW[collision.col + 1]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row + 1].CURRENT_ROW[collision.col - 1]
        .KEY_CHARACTER === "*" &&
      currentBoard[collision.row - 1].CURRENT_ROW[collision.col - 1]
        .KEY_CHARACTER === "*"
    ) {
      direction = "vertical";
      for (let i = 1; i <= firstPart.length; i++) {
        if (
          (currentBoard[collision.row - i].CURRENT_ROW[collision.col]
            .KEY_CHARACTER === "*" ||
            currentBoard[collision.row - i].CURRENT_ROW[collision.col]
              .KEY_CHARACTER === firstPart[i - 1]) &&
          currentBoard[collision.row - i].CURRENT_ROW[collision.col]
            .AVAILABLE == true &&
          currentBoard[collision.row - i].CURRENT_ROW[collision.col + 1]
            .KEY_CHARACTER == "*" &&
          currentBoard[collision.row - i].CURRENT_ROW[collision.col - 1]
            .KEY_CHARACTER == "*" &&
          currentBoard[collision.row - i - 1].CURRENT_ROW[collision.col]
            .AVAILABLE == true
        ) {
          canInsert = true;
        } else {
          canInsert = false;
          return { INSERT: canInsert, DIRECTION: direction };
        }
      }
      for (let i = 1; i <= secondPart.length; i++) {
        if (
          (currentBoard[collision.row + i].CURRENT_ROW[collision.col]
            .KEY_CHARACTER === "*" ||
            currentBoard[collision.row + i].CURRENT_ROW[collision.col]
              .KEY_CHARACTER === secondPart[i - 1]) &&
          currentBoard[collision.row + i].CURRENT_ROW[collision.col]
            .AVAILABLE == true &&
          currentBoard[collision.row + i].CURRENT_ROW[collision.col + 1]
            .KEY_CHARACTER == "*" &&
          currentBoard[collision.row + i].CURRENT_ROW[collision.col - 1]
            .KEY_CHARACTER == "*" &&
          currentBoard[collision.row + i + 1].CURRENT_ROW[collision.col]
            .AVAILABLE == true
        ) {
          canInsert = true;
        } else {
          canInsert = false;
          return { INSERT: canInsert, DIRECTION: direction };
        }
      }
    }
    return { INSERT: canInsert, DIRECTION: direction };
  }
  // Inserts an individual word. It splits the word apart based on where it is going to go on the board, and updates the key characters of the new squares to the word's characters. It also updates the availability of the squares surrounding the newly placed word
  function insertWord(
    wordToAdd,
    currentBoard,
    collision,
    direction,
    START_SQUARES,
    aNum
  ) {
    let charIndex = wordToAdd.indexOf(collision.character);
    let splitWord = wordToAdd.split(collision.character);
    let firstPart = "";
    let secondPart = "";
    if (splitWord.length == 2) {
      firstPart = splitWord[0].split("").reverse();
      secondPart = splitWord[1].split("");
    } else if (splitWord.length > 2) {
      firstPart = splitWord[0].split("").reverse();
      secondPart = splitWord[1];
      for (let i = 2; i < splitWord.length; i++) {
        secondPart += collision.character;
        secondPart += splitWord[i];
      }
    } else {
      if (charIndex == 0) {
        secondPart = splitWord[0].split("");
      } else if ((charIndex = wordToAdd.length - 1)) {
        firstPart = splitWord[0].split("");
      }
    }
    if (direction == "horizontal") {
      let firstRow = 0;
      let firstCol = 0;
      if (firstPart.length == 0) {
        firstRow = collision.row;
        firstCol = collision.col;
        START_SQUARES.push({ ROW: firstRow, COL: firstCol });
      }
      for (let i = 1; i <= firstPart.length; i++) {
        currentBoard[collision.row].CURRENT_ROW[
          collision.col - i
        ].KEY_CHARACTER = firstPart[i - 1];
        currentBoard[collision.row].CURRENT_ROW[
          collision.col - i
        ].AVAILABLE = false;
        if (i == firstPart.length) {
          firstRow = collision.row;
          firstCol = collision.col - i;
          START_SQUARES.push({ ROW: firstRow, COL: firstCol });
        }
      }
      currentBoard[collision.row].CURRENT_ROW[
        collision.col - firstPart.length - 1
      ].AVAILABLE = false;
      for (let i = 0; i <= secondPart.length; i++) {
        currentBoard[collision.row].CURRENT_ROW[
          collision.col + i
        ].KEY_CHARACTER = secondPart[i - 1];
        currentBoard[collision.row].CURRENT_ROW[
          collision.col + i
        ].AVAILABLE = false;
      }
      currentBoard[collision.row].CURRENT_ROW[
        collision.col + secondPart.length + 1
      ].AVAILABLE = false;
      HORIZONTAL_WORDS.push({
        WORD: wordToAdd,
        CLUE_NUMBER:
          START_SQUARES.indexOf(
            START_SQUARES.filter(
              (e) =>
                e.ROW == collision.row &&
                e.COL == collision.col - firstPart.length
            )[0]
          ) + 1,
      });
    }
    if (direction == "vertical") {
      let firstRow = 0;
      let firstCol = 0;
      if (firstPart.length == 0) {
        firstRow = collision.row;
        firstCol = collision.col;
        START_SQUARES.push({ ROW: firstRow, COL: firstCol });
      }
      for (let i = 1; i <= firstPart.length; i++) {
        currentBoard[collision.row - i].CURRENT_ROW[
          collision.col
        ].KEY_CHARACTER = firstPart[i - 1];
        currentBoard[collision.row - i].CURRENT_ROW[
          collision.col
        ].AVAILABLE = false;
        if (i == firstPart.length) {
          firstRow = collision.row - i;
          firstCol = collision.col;
          START_SQUARES.push({ ROW: firstRow, COL: firstCol });
        }
      }
      currentBoard[collision.row - firstPart.length - 1].CURRENT_ROW[
        collision.col
      ].AVAILABLE = false;
      for (let i = 0; i <= secondPart.length; i++) {
        currentBoard[collision.row + i].CURRENT_ROW[
          collision.col
        ].KEY_CHARACTER = secondPart[i - 1];
        currentBoard[collision.row + i].CURRENT_ROW[
          collision.col
        ].AVAILABLE = false;
      }
      currentBoard[collision.row + secondPart.length + 1].CURRENT_ROW[
        collision.col
      ].AVAILABLE = false;
      VERTICAL_WORDS.push({
        WORD: wordToAdd,
        CLUE_NUMBER:
          START_SQUARES.indexOf(
            START_SQUARES.filter(
              (e) =>
                e.ROW == collision.row - firstPart.length &&
                e.COL == collision.col
            )[0]
          ) + 1,
      });
      setVertClues(VERTICAL_WORDS)
    }
    currentBoard[collision.row].CURRENT_ROW[collision.col].KEY_CHARACTER =
      collision.character;
    return currentBoard;
  }
  // Sorts the key words from longest word to shortest word
  function sortKeyWords(ANCESTORS) {
    let keyWordList = getAnswersFromClues(ANCESTORS);
    keyWordList.sort(function (a, b) {
      return b.ANSWER.length - a.ANSWER.length;
    });
    return keyWordList;
  }

  // Allows us to get all words put into the puzzle
  function getAnswersFromClues(CLUE_LIST) {
    let ANSWERS = [];
    for (let i = 0; i < CLUE_LIST.length; i++) {
      ANSWERS.push({
        ANSWER: CLUE_LIST[i].ANSWER,
        ASCENDENCY_NUM: CLUE_LIST[i].ASCENDENCY_NUM,
      });
    }
    return ANSWERS;
  }
  // Puts the remaining words in a random order to generate a new crossword puzzle every time
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
  // Sets up the board before the user can see it
  function setUpBoard(
    BOARD,
    SORTED_CLUE_LIST,
    START_SQUARES,
    ADDED_WORDS,
    REMAINING_WORDS,
    NOT_ADDED
  ) {
    for (let currentRow = 0; currentRow < DIMENSIONS; currentRow++) {
      let CURRENT_ROW = [];
      for (let currentCol = 0; currentCol < DIMENSIONS; currentCol++) {
        CURRENT_ROW.push({
          ROW: currentRow,
          COL: currentCol,
          KEY_CHARACTER:
            currentRow == 0 ||
            currentRow == DIMENSIONS - 1 ||
            currentCol == 0 ||
            currentCol == DIMENSIONS - 1
              ? "&"
              : "*",
          CHARACTER:
            currentRow == 0 ||
            currentRow == DIMENSIONS - 1 ||
            currentCol == 0 ||
            currentCol == DIMENSIONS - 1
              ? "&"
              : "*",
          id: currentRow + "x" + currentCol,
          AVAILABLE:
            currentRow == 0 ||
            currentRow == DIMENSIONS - 1 ||
            currentCol == 0 ||
            currentCol == DIMENSIONS - 1
              ? false
              : true,
        });
      }
      BOARD.push({ CURRENT_ROW, id: currentRow });
    }

    const randomAncestor = SORTED_CLUE_LIST[Math.floor(Math.random() * SORTED_CLUE_LIST.length)]

    BOARD = insertFirstWord(
      9,
      4,
      //randomAncestor.ANSWER,
      SORTED_CLUE_LIST[0].ANSWER,
      BOARD,
      START_SQUARES,
      ADDED_WORDS,
      REMAINING_WORDS,
      SORTED_CLUE_LIST[0].ASCENDENCY_NUM
    );
    shuffle(REMAINING_WORDS);
    insertAllWords(
      BOARD,
      REMAINING_WORDS,
      ADDED_WORDS,
      START_SQUARES,
      NOT_ADDED
    );

    for (let i = 0; i < ascendencyNums.length; i++) {
      justAscendencyNums[i] = ascendencyNums[i].ASCENDENCY_NUMBER;
    }
    
    return BOARD;
  }
  // Inserts the first word at a set position in the board
  function insertFirstWord(
    rowIndex,
    colIndex,
    word,
    currentBoard,
    START_SQUARES,
    ADDED_WORDS,
    REMAINING_WORDS,
    aNum
  ) {
    let canInsertWord = false;
    let wordIndex = 0;
    if (word.length < DIMENSIONS - 5) {
      canInsertWord = true;
    } else {
      for (let i = 1; i < REMAINING_WORDS.length; i++) {
        if (REMAINING_WORDS[i].ANSWER.length < DIMENSIONS - 6) {
          canInsertWord = true;
          word = REMAINING_WORDS[i].ANSWER;
          wordIndex = i;
        }
      }
    }
    if (canInsertWord) {
      let splitWord = word.split("");
      for (let i = 0; i < splitWord.length; i++) {
        currentBoard[rowIndex].CURRENT_ROW[colIndex + i].KEY_CHARACTER =
          splitWord[i];
        currentBoard[rowIndex].CURRENT_ROW[colIndex + i].AVAILABLE = false;
      }
      START_SQUARES.push({ ROW: rowIndex, COL: colIndex });
      ADDED_WORDS.push(word);
      HORIZONTAL_WORDS.push({
        WORD: word,
        CLUE_NUMBER:
          START_SQUARES.indexOf(
            START_SQUARES.filter(
              (e) => e.ROW == rowIndex && e.COL == colIndex
            )[0]
          ) + 1,
      });
      setHorClues(HORIZONTAL_WORDS)
      REMAINING_WORDS.splice(wordIndex, 1);
      ascendencyNums.push({ ASCENDENCY_NUMBER: aNum, NAME: word });
    }
    return currentBoard;
  }

  // Loops through the 2D array to check if each key character matches each entered character
  function checkIfFinished() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].CURRENT_ROW.length; j++) {
        if (
          board[i].CURRENT_ROW[j].CHARACTER.toLowerCase() !=
          board[i].CURRENT_ROW[j].KEY_CHARACTER.toLowerCase()
        ) {
          finished = false;
          return finished;
        }
      }
    }
    finished = true;
    return finished;
  }

  let clueNumber = -1;
  return !loading ?(
    <>
      <div>
        {board.map((rows) => {
          return (
            <div className={styles.div} key={rows.id}>
              {rows.CURRENT_ROW.map((rowItems) => {
                {
                  clueNumber =
                    START_SQUARES.indexOf(
                      START_SQUARES.filter(
                        (e) => e.ROW == rowItems.ROW && e.COL == rowItems.COL
                      )[0]
                    ) + 1;
                }
                return (
                  <Square
                    row={rowItems.ROW}
                    col={rowItems.COL}
                    character={rowItems.CHARACTER}
                    key_character={rowItems.KEY_CHARACTER}
                    key={rowItems.id}
                    clueNumber={clueNumber}
                    handleSquareInput={handleSquareInput}
                    handleKeyDown={handleKeyDown}
                    dimensions={DIMENSIONS}
                    inputLocation={inputLocation}
                  />
                );
              })}
            </div>
          );
        })}
        {(START_SQUARES = [])}
      </div>
      <ClueList
        verticalClues={vertClues}
        horizontalClues={horClues}
        result={clues}
      />
      <Modal open={puzzleIsCorrect} onClose={() => setPuzzleIsCorrect(false)}>
        <div className={styles.modal_container}>
          <button
            className={styles.close_btn}
            onClick={() => setPuzzleIsCorrect(false)}
          >
            X
          </button>
          <h3>Congrats on solving the Crossword! </h3>
        </div>
      </Modal>
    </>
  ): (<div>Loading...</div>);
}
export default Board;
