import { useEffect, useState, useRef } from "react";
import { Modal } from "@mui/material";
import VictoryModal from "@/components/victory_modal";
import Person from "@/components/person";
import { useUser } from "@/contexts/UserContext";
import styles from "@/styles/word_search.module.css"

function WordSearchPage() {

    //determines whether the win message is shown or hidden.
    const [showWinModal, setShowWinModal] = useState(false);

    // variable person
    const [currentPerson, setCurrentPerson] = useState(null)

    //get fsData from our custom hook.
    const { userFSData } = useUser();
    useEffect(() => {}, [userFSData]);

    //set an array of people comprised of the user's ancestors
    const [peopleArray, setPeopleArray] = useState([]);
    useEffect(() => {
        const numPeopleToDisplay = 10;

        let people = Array.from(userFSData.values()).map((person) => person);
        setPeopleArray(
          people.sort(() => 0.5 - Math.random()).slice(0, numPeopleToDisplay)
        );
    }, [userFSData]);

    // BOARD SET-UP (visible board and interactive board)
    function populateBoard() {
        var board = [];
        solutionBank.length = 0;
        placedPeople.length = 0;
    
        // establish an initial board
        for(var i=0; i<rows; i++){
            board.push([new Array(cols)]);
            for(var j=0; j<cols; j++){
                board[i][j] = defVal;
            }
        }
    
        // for as many names as there are in the list, place them on the board
        for(var i=0; i<peopleArray.length; i++){
            var name = peopleArray[i].name.first.toUpperCase()
            placeWord(board, peopleArray[i], name)
        }
    
        // finish board by setting any cells with 0 to a random letter
        for(var i=0; i<rows; i++){
            for(var j=0; j<cols; j++){
                if(board[i][j] == defVal){
                    board[i][j] = alphabet[Math.floor(Math.random() * 26)];
                }
            }
        }
    
        return board
    }
    const [wsboard, setBoard] = useState([])
    useEffect(() => setBoard(populateBoard),[peopleArray])
    const [refBoard, setRefBoard] = useState([])
    useEffect(() => setRefBoard(populateRefBoard),[])

    // MODAL
    const [showPersonInfo, setShowPersonInfo] = useState(false);    

    // HOVER
    function handleMouseOver(e,r_idx,c_idx) {
        if(selectionBegun){
            currentLocation = [r_idx,c_idx];
            let diffRow = selectionStart[0] - currentLocation[0];
            let diffCol = selectionStart[1] - currentLocation[1];
            if (diffRow == 0 || diffCol == 0 || Math.abs(diffCol) == Math.abs(diffRow)){
                for(var i=0; i<rows; i++){
                    for(var j=0; j<cols; j++){
                        refBoard[i][j].style.background = "white"
                    }
                }
                var directionRow = (1 * (diffRow < 0)) - (1 * (diffRow > 0));
                var directionCol = (1 * (diffCol < 0)) - (1 * (diffCol > 0));
                var endLocation = currentLocation;
                drawLine(selectionStart, endLocation, directionRow, directionCol, refBoard);
            }
        }
        else e.target.style.background = "lightgray";
    }
    function handleMouseLeave(e) { e.target.style.background = "white" }

    function nameMouseOver(e,person) {
        e.target.style.background = "lightgray"
        setCurrentPerson(person)
    }

    // SELECTION
    function handleMouseDown(e,r_idx,c_idx) {
        // indicate the beginning of a solution attempt
        selectionBegun = true;
        e.target.style.background = "orange";

        // initiate guess
        selectionStart = [r_idx,c_idx]
        guess.push(selectionStart)
    }
    function handleMouseUp(r_idx,c_idx) {
        // clear the selection highlighting
        for(var i=0; i<rows; i++){
            for(var j=0; j<cols; j++){
                refBoard[i][j].style.background = "white"
            }
        }

        guess.push([r_idx,c_idx]);
        var [found, idx] = checkSolution(guess);
        // if a name is found, highlight the board's cells and the name in the box
        if(found){
            let diffRow = selectionStart[0] - r_idx
            let diffCol = selectionStart[1] - c_idx
            if (diffRow == 0 || diffCol == 0 || Math.abs(diffCol) == Math.abs(diffRow)){
                var directionRow = (1 * (diffRow < 0)) - (1 * (diffRow > 0));
                var directionCol = (1 * (diffCol < 0)) - (1 * (diffCol > 0));
                highlightSolution(selectionStart, directionRow, directionCol, refBoard, nameRefs, idx)
            }
        }
        
        // reset and adjust our guessing related global helper variables
        selectionBegun = false;
        guess.length = 0;
        selectionStart = [];

        //if we have found all the people, win
        if(guessedList.length == placedPeople.length) setShowWinModal(true)

    }
    function handleNameClick(){ setShowPersonInfo(true) }

    // create references for each div that displays a placed name (for the style updater that happens when handling mouseUp)
    const nameRefs = useRef([]);
    nameRefs.current = []
    const addToNameRefs = (e) => {
        nameRefs.current.push(e)
    }
    // create references for each cell of the board to enable the mutation of a cell at any time
    const addToBoardRef = (e,r_idx,c_idx) => {
        refBoard[r_idx][c_idx] = e
    }

    return ( 
        <div>
            <div className={styles.ws_board}>
                {wsboard.map((row,r_idx) => (
                <div className={styles.ws_container} key={r_idx}>
                    {row.map((cell,c_idx) =>
                        <button className={styles.ws_cell}
                        key={c_idx}
                        onMouseDown={(e) => handleMouseDown(e,r_idx,c_idx)}
                        onMouseUp={() => handleMouseUp(r_idx,c_idx)}
                        onMouseEnter={(e) => handleMouseOver(e,r_idx,c_idx)}
                        onMouseLeave={handleMouseLeave}
                        ref={(e) => addToBoardRef(e,r_idx,c_idx)}>
                            {cell}
                        </button>)}
                </div>))}
            </div>

            <div className={styles.ws_container}>
                <div className={styles.ws_names_container}>
                    {placedPeople.map((person,idx) => 
                    <button className={styles.ws_name}
                    key={idx} 
                    ref={addToNameRefs}
                    onClick={handleNameClick}
                    onMouseEnter={(e) => nameMouseOver(e,person)}
                    onMouseLeave={handleMouseLeave}>
                        {person.name.first.toUpperCase()}
                    </button>)}
                </div>
            </div>

            <Modal open={showPersonInfo} onClose={() => setShowPersonInfo(false)}>
                <Person personData={currentPerson}/>
            </Modal>

            <VictoryModal
            open={showWinModal}
            onClose={() => setShowWinModal(false)}
            message="You solved the Word Search!"
            />

        </div>
    )
}

// set up a reference board to store the cells of the board as mutable DOM elements
function populateRefBoard(){
    var refBoard = []

    //establish refBoard
    for(var i=0; i<rows; i++){
        refBoard.push([new Array(cols)]);
    }

    return refBoard
}

// PLACEMENT
function placeWord(board, person, name){
    var maxAttempts = 10

    for(var i=0; i<maxAttempts; i++){

        // set start positions ([0]=row, [1]=col)
        var start = [Math.floor(Math.random() * rows),Math.floor(Math.random() * cols)]

        // get a direction
        var directionIndex = Math.floor(Math.random() * 8)
        var direction = allDirections[directionIndex]

        // find the potential end positions ([0]=row, [1]=col)
        var end = [start[0] + (direction[0] * (name.length-1)), start[1] + (direction[1] * (name.length-1))]

        // check if word will fit on board, keep trying to place if out of bounds
        if(end[0]<0 || end[0]>rows-1 || end[1]<0 || end[1]>cols-1) continue
        else{
          // from the starting position, place each letter of the name in the given direction
          permitAndPlace(board, start, end, direction, person, name)
          break
        }
    }

    return board;
}
function permitAndPlace(board, start, end, direction, person, name){

    for(var i=0; i<name.length; i++){
        let cell = board[start[0]+(direction[0]*i)][start[1]+(direction[1]*i)]
        let letter = name[i]
        if(cell != letter && cell != defVal) return false; // disallows a word's placement
    }

    // place the word
    for(var i=0; i<name.length; i++) board[start[0]+(direction[0]*i)][start[1]+(direction[1]*i)] = name[i];

    // store start and end positions as a solution in the solution bank
    var solution = [start,end]
    solutionBank.push(solution)

    // keep record that the name was officially placed
    placedPeople.push(person)

    return true
}

// SOLUTION HELPERS
function checkSolution(proposedSolution){

    let proposedSolutionString = JSON.stringify(proposedSolution)

    if( !guessedList.includes(proposedSolutionString) && placedPeople.includes(proposedSolutionString)) guessedList.push(proposedSolutionString)

    for(var i=0; i<solutionBank.length; i++){
        let solutionBank_i = JSON.stringify(solutionBank[i])
        var found = (proposedSolutionString == solutionBank_i)
        if(found) break
    }

    return [found, i]
}

function drawLine(selectionStart, endLocation, directionRow, directionCol, refBoard){
    var startRow = selectionStart[0]
    var startCol = selectionStart[1]
    var endRow = endLocation[0]
    var endCol = endLocation[1]
    while(startRow!=endRow || startCol!=endCol){
        refBoard[startRow][startCol].style.background = "orange"
        startRow += directionRow;
        startCol += directionCol;
    }
    refBoard[startRow][startCol].style.background = "orange"
}

function highlightSolution(selectionStart, directionRow, directionCol, refBoard, nameRefs, idx){
    var color = getColor()
    var startRow = selectionStart[0]
    var startCol = selectionStart[1]
    while(startRow!=currentLocation[0] || startCol!=currentLocation[1]){
        refBoard[startRow][startCol].style.color = color;
        refBoard[startRow][startCol].style.fontWeight = "bold";
        startRow += directionRow;
        startCol += directionCol;
    }
    refBoard[startRow][startCol].style.color = color
    refBoard[startRow][startCol].style.fontWeight = "bold";
}

// generate a loop of colors
var colors = ["red", "blue", "orange"]
var seed = Math.floor(Math.random() * colors.length)
function getColor(){
    var color = colors[seed%(colors.length)]
    seed++;
    return color
}

// guessing
var solutionBank = []
var guess = []
var currentLocation = []
var selectionStart = []
var selectionBegun = false;
var guessedList = []

// board variables
var placedPeople = []
const defVal = '0'
var rows = 20
var cols = 20
var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
var allDirections = [
  [1,1],    //se
  [1,0],    //s
  [1,-1],   //sw
  [0,-1],   //w
  [-1,-1],  //nw
  [-1,0],   //n
  [-1,1],   //ne
  [0,1],    //e
]

export default WordSearchPage;