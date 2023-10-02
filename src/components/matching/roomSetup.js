// RoomSetup component
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import styles from "@/styles/matching.module.css";
import io from 'socket.io-client';

let socket;

function RoomSetup() {
    const [roomKey, setRoomKey] = useState("");
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setJoinModalOpen] = useState(false);

    const handleCreateRoom = () => {
        console.log("Creating a room with key:", roomKey);
        socket.emit("create-room", roomKey);
    };

    const handleJoinRoom = () => {
        console.log("Joining a room with the key:", roomKey);
        socket.emit("join-room", roomKey);
    };

    const handleOpenCreateModal = () => {
        setRoomKey("");
        setCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
    };

    const handleOpenJoinModal = () => {
        setRoomKey("");
        setJoinModalOpen(true);
    };

    const handleCloseJoinModal = () => {
        setJoinModalOpen(false);
    };

    useEffect(() => {
        socket = io(); // Establish socket connection

        socket.on("room-created", (roomKey) => {
            console.log("Room created with key:", roomKey);
            // Perform any actions required after room creation
        });

        socket.on("room-joined", (roomKey) => {
            console.log("Joined room with key:", roomKey);
            // Perform any actions required after room joining
        });

        return () => {
            socket.disconnect(); // Disconnect socket when component unmounts
        };
    }, []);

    return (
        <div>
            <h1>Welcome to the Family History Matching Game!</h1>
            <div className={styles.roomSetup}>
                <Button onClick={handleOpenJoinModal}>Join A Room</Button>
                <Button onClick={handleOpenCreateModal}>Create A Room</Button>
            </div>

            <Modal open={isCreateModalOpen} onClose={handleCloseCreateModal} >
                <div className={styles.modal_container}>
                    <div>
                        <h2>Enter a 4 digit room key</h2>
                        <input
                            value={roomKey}
                            onChange={(e) => setRoomKey(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleCreateRoom}>Create Room</Button>
                    <Button onClick={handleCloseCreateModal}>Close</Button>
                </div>
            </Modal>

            <Modal open={isJoinModalOpen} onClose={handleCloseJoinModal}>
                <div className={styles.modal_container}>
                    <div>
                        <h2>Enter the ID of the room you would like to join</h2>
                        <input
                            value={roomKey}
                            onChange={(e) => setRoomKey(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleJoinRoom}>Join Room</Button>
                    <Button onClick={handleCloseJoinModal}>Close</Button>
                </div>
            </Modal>
        </div>
    );
}

export default RoomSetup;
