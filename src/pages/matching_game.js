// MatchingGame component
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import io from 'socket.io-client';
import styles from '@/styles/matching.module.css';
import Grid from '@/components/matching/grid';
import RoomSetup from '@/components/matching/roomSetup';

let socket;

const MatchingGame = () => {
    const [count, setCount] = useState(0);
    const [input, setInput] = useState('');
    const [board, setBoard] = useState([]);
    const [roomId, setRoomId] = useState(null);

    const inc = () => {
        let newCount = count + 1;
        setCount(count + 1);
        socket.emit('increment', newCount);
    };

    const onChangeHandler = (e) => {
        console.log("In onChangeHandler");
        console.log(e);
        setInput(e.target.value);
        socket.emit('input-change', e.target.value);
    };

    useEffect(() => {
        const socketInitializer = async () => {
            await fetch('/api/socket');
            socket = io();

            socket.on('connect', () => {
                console.log("Connected");
            });

            socket.on('update-input', msg => {
                console.log("In log");
                setInput(msg);
            });

            socket.on('incremented', (count) => {
                console.log(count);
                setCount(count);
            });

            socket.on('room-joined', (roomKey) => {
                console.log("Joined room with key:", roomKey);
                setRoomId(roomKey);
                // Perform any actions required after joining the room
            });

            // Add event listeners for other room-related events as needed
        };

        socketInitializer();
    }, []);

    function joinRoom() {
        // Get the room ID from the user (e.g., through an input field)
        const roomId = "1234"; // Replace with your logic to obtain the room ID
        socket.emit('join-room', roomId);
    }

    return (
        <div>
            <div className={styles.main}>
                <h1>Family History Matching Game</h1>
                <div></div>
                <Button onClick={() => inc()}>Press</Button>
                <h2>{count}</h2>
                <input
                    placeholder="Type Something"
                    value={input}
                    onChange={onChangeHandler}
                />
            </div>

            <Grid></Grid>
            <RoomSetup></RoomSetup>

            {/* Display the room ID */}
            {roomId && (
                <div>
                    <h3>Room ID: {roomId}</h3>
                    {/* Add your game logic here */}
                </div>
            )}
        </div>
    );
}

export default MatchingGame;
