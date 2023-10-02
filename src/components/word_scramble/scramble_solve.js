import styles from "@/styles/word_scramble.module.css";
import { useEffect, useState } from "react";
import { Modal, Button } from "@mui/material";
import { FaInfoCircle } from "react-icons/fa";
import { PersonImage } from "../person_image";

import Person from "../person";

function ScrambleSolve(props) {
  //destructure the props into their own variables
  const { solved, person, scrambledName, handleInputChange, index } = props;
  const [showPersonInfo, setShowPersonInfo] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  const IMAGE_DIMENSIONS = 50;

  //this function jsut calls the props function, essentially letting the parent component handle the inputChange event.
  const handleInputChangeHelper = (event) => {
    handleInputChange(index, event.target.value);
  };

  const handleInfoClick = (event) => {
    event.preventDefault(); //keep the page from auto reloading
    setShowPersonInfo(true);
  };

  const handleShowAnsClick = (event) => {
    event.preventDefault(); //keep the page from auto reloading
    setShowAnswer(!showAnswer);
    solved = true;
  };

  return (
    <div className={styles.scrambled_name_container}>
      <h2 className={styles.scrambled_name}>{scrambledName}</h2>

      <div className={styles.person_image}>
        <PersonImage
          pid={person.pid}
          imageHeight={IMAGE_DIMENSIONS}
          imageWidth={IMAGE_DIMENSIONS}
          gender={person.gender}
        />
      </div>

      <form className={styles.input_form} spellCheck={false}>
        <input
          className={styles.input_field}
          // the text box will lock once you have solved the word. I'm not sure if we want this or not, but it is an idea
          // readOnly={solved}
          style={
            //when the name is correct, change the background color.
            solved
              ? { backgroundColor: "#c1f8ee" }
              : { backgroundColor: "#ffc7c7" }
          }
          // placeholder={showAnswer ? person.display.name : null}
          type="text"
          onChange={handleInputChangeHelper}
        />

        <Button
          id={styles.show_answer_btn}
          size="small"
          variant="outlined"
          onClick={handleShowAnsClick}
        >
          {showAnswer ? "Hide" : "Answer"}
        </Button>
        {solved ? (
          <FaInfoCircle
            title="Learn about this ancestor"
            onClick={handleInfoClick}
            className={styles.info_icon}
          />
        ) : null}
        {showAnswer ? <p id={styles.answer}>{person.name.full}</p> : null}
      </form>

      {showPersonInfo ? (
        <Modal open={showPersonInfo} onClose={() => setShowPersonInfo(false)}>
          <Person personData={person} />
        </Modal>
      ) : null}
    </div>
  );
}

export default ScrambleSolve;
