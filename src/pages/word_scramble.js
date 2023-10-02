import { useState, useEffect } from "react";
import ScrambleSolve from "@/components/word_scramble/scramble_solve";
import VictoryModal from "@/components/victory_modal";
import styles from "@/styles/word_scramble.module.css";

import { useUser } from "@/contexts/UserContext";

function WordScramblePage() {
  const [gameKey, setGameKey] = useState(0);
  //get fsData from our custom hook.
  const { userFSData } = useUser();

  //an array storing the information about each person displayed.
  const [peopleArray, setPeopleArray] = useState([]);

  //an array with just the names of the people from peopleArray.
  const [nameArray, setNameArray] = useState([]);

  //an array of boolean values to keep track of which of the names have been solved
  const [solvedNamesTracker, setSolvedNameTracker] = useState([]);

  //used to show a pop up modal when all the names have been solved
  const [allSolved, setAllSolved] = useState(false);

  //the array of scrambled names.
  const [scrambledNames, setScrambledNames] = useState([]);

  //determines whether the win message is shown or hidden.
  const [showWinModal, setShowWinModal] = useState(false);

  //to change background color of body
  useEffect(() => {
    document.documentElement.style.setProperty("--background", "#c1f8ee");
  }, []);

  useEffect(() => {}, [userFSData]);

  //get an array of names to display from fsData.
  useEffect(() => {
    if (userFSData) {
      const numPeopleToDisplay = 10;
      let people = Array.from(userFSData.values()).map((person) => person);
      setPeopleArray(
        people.sort(() => 0.5 - Math.random()).slice(0, numPeopleToDisplay)
      );
    }
  }, [userFSData]);

  //after the peopleArray is set, set the nameArray.
  useEffect(() => {
    if (peopleArray !== []) {
      console.log("PeopleArray", peopleArray);
      setNameArray(
        peopleArray.map((person) => {
          return person.name.full.toLowerCase();
        })
      );
    }
  }, [peopleArray]);

  //once the nameArray has been set, use it to set solvedNameTracker and scrambledNames.
  useEffect(() => {
    if (nameArray !== []) {
      setSolvedNameTracker(new Array(nameArray.length).fill(false));
      setScrambledNames(scrambleWords(nameArray));
    }
  }, [nameArray]);

  //run the checkFinished() function every time there is an update to solveNamesTracker.
  useEffect(() => {
    checkFinished();
  }),
    [solvedNamesTracker];

  //when allSolved is updated to true, show the win modal
  useEffect(() => {
    setShowWinModal(allSolved);
  }, [allSolved]);

  const handleInputChange = (index, value) => {
    //if the current input matches the correct value.
    if (nameArray[index].toLowerCase() === value.toLowerCase()) {
      //this will set the array to a new array with updated info
      setSolvedNameTracker(() => {
        return solvedNamesTracker.map((solved, i) => {
          //will set to true if it the name that was just solved OR it is already solved.
          return i === index || solved;
        });
      });
    }
    //the current input does not match the correct value.
    else {
      //this will set the array to a new array with updated info
      setSolvedNameTracker(() => {
        return solvedNamesTracker.map((solved, i) => {
          //will only return true if it's not the index of the current input field AND it is already solved.
          return i !== index && solved;
        });
      });
    }
  };

  const checkFinished = () => {
    //will set allSolved to true, if every value in solvedNamesTracker array is true
    setAllSolved(
      solvedNamesTracker.every((value) => {
        return value;
      })
    );
  };

  const resetGame = () => {
    setPeopleArray([]);
    setNameArray([]);
    setSolvedNameTracker([]);
    setAllSolved(false);
    setScrambledNames([]);
    setGameKey(prevKey => prevKey + 1);
    
    if (userFSData) {
      const numPeopleToDisplay = 10;
      let people = Array.from(userFSData.values()).map((person) => person);
      setPeopleArray(
        people.sort(() => 0.5 - Math.random()).slice(0, numPeopleToDisplay)
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        {/* Toggle the value of showAnswers when the button is clicked and display the correct message based off of showAnswer value */}

        {/* Create a ScrambleSolve component for each scrambledName */}
        {scrambledNames.map((scrambledName, index) => {
          return (
            <ScrambleSolve
            key={`${gameKey}-${peopleArray[index].id}`}
              solved={solvedNamesTracker[index]}
              person={peopleArray[index]}
              scrambledName={scrambledName}
              handleInputChange={handleInputChange}
              index={index}
            />
          );
        })}

        {/*  */}
        <VictoryModal
          open={showWinModal}
          onClose={() => setShowWinModal(false)}
          onPlayAgain={resetGame}
          message="You solved the Word Scramble!"
        ></VictoryModal>
        {/* When all names have been solved, change the text that's displayed to the user. */}
      </div>
    </div>
  );
}

//TODO sometimes the name gets scrambled, but ends up being exactly the same, so that needs to be fixed.
const scrambleWords = (nameArray) => {
  let scrambledNamesArray = nameArray.map((name) => {
    //if there are multiple names(first and last), split them up
    // so we can randomize each individual name.
    if (name.includes(" ")) {
      let allNames = name.split(" ");
      for (let i = 0; i < allNames.length; i++) {
        let tempName = allNames[i];
        //keep randomizing the name until it is actually different.
        // unless it is just a single character (like a middle initial)
        while (allNames[i].length != 1 && allNames[i] === tempName) {
          allNames[i] = randomizeName(allNames[i]);
        }
      }
      return allNames.join(" ");
    }
    //when there is only one name, we just randomize it and return it.
    else {
      let tempName = name;
      while (tempName === name) {
        tempName = randomizeName(name);
      }
      return tempName;
    }
  });
  return scrambledNamesArray;
};

//function that randomizes the input name
const randomizeName = (name) => {
  return name
    .split("")
    .sort(() => {
      return 0.5 - Math.random();
    })
    .join("");
};

export default WordScramblePage;
