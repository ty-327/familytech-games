import { useState } from 'react';
import { Modal } from "@mui/material";
import Person from "@/components/person";
import { useUser } from "@/contexts/UserContext";

function Clue(props) {
  const { number, word, clue } = props;
  const [displayClue, setDisplayClue] = useState(true);
  const [showPersonInfo, setShowPersonInfo] = useState(false); 
  const [currentPerson, setCurrentPerson] = useState(null);
  const { userFSData } = useUser();

  // Switches between clue and answer
  function handleContextMenu(event) {
    event.preventDefault();
    setDisplayClue(!displayClue);
  }

  // Shows the person Modal when their name is clicked (little convoluted, maybe fix later)
  function handleNameClick() { 
    if (!displayClue) {
      const transformedMap = new Map([...userFSData.entries()].map(([key, value]) => [value.name.compressedName, { key }]));
      const foundPerson = transformedMap.get(word)
      const realFoundPerson = userFSData.get(Object.values(foundPerson)[0])
      if (foundPerson) {
        setCurrentPerson(realFoundPerson);
        setShowPersonInfo(true);
      }
    }
  }

  // useEffect(() => {
  //   setDisplayClue(false);
  // }, []);

  return (
    <>
      <div 
        onContextMenu={handleContextMenu}
        onClick={displayClue ? null : handleNameClick}
      >
        {number + ". " + (displayClue ? clue : word)}
      </div>
      <Modal open={showPersonInfo} onClose={() => setShowPersonInfo(false)}>
        <Person personData={currentPerson}/>
      </Modal>
    </>
  );
}

export default Clue;