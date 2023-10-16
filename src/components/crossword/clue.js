import { useState } from 'react';
import { Modal } from "@mui/material";
import Person from "@/components/person";
import { useUser } from "@/contexts/UserContext";

function Clue(props) {
  const { number, word, clue, onClueHover } = props; // Pass onClueHover from the parent component
  const [displayClue, setDisplayClue] = useState(true);
  const [showPersonInfo, setShowPersonInfo] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);
  const { userFSData } = useUser();

  // Switches between clue and answer
  function handleContextMenu(event) {
    event.preventDefault();
    setDisplayClue(!displayClue);
  }

  // Shows the person Modal when their name is clicked
  function handleNameClick() {
    if (!displayClue) {
      const transformedMap = new Map([...userFSData.entries()].map(([key, value]) => [value.name.compressedName, { key }]));
      const foundPerson = transformedMap.get(word);
      const realFoundPerson = userFSData.get(Object.values(foundPerson)[0]);
      if (foundPerson) {
        setCurrentPerson(realFoundPerson);
        setShowPersonInfo(true);
      }
    }
  }

  // Handle the clue hover
  function handleClueHover() {
    onClueHover(number);
  }

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onClick={displayClue ? null : handleNameClick}
        onMouseEnter={handleClueHover} // Add this line to trigger the hover event
        style={{ textDecoration: props.strikethrough ? 'line-through' : 'none', backgroundColor: props.isHovered ? 'yellow' : 'transparent' }}
      >
        {number + ". " + (displayClue ? clue : word)}
      </div>
      <Modal open={showPersonInfo} onClose={() => setShowPersonInfo(false)}>
        <Person personData={currentPerson} />
      </Modal>
    </>
  );
}

export default Clue;
