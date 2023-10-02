import { Modal, Box, Typography, Button,Snackbar } from "@mui/material";
import Confetti from "react-confetti";
import { useRouter } from "next/router";
import styles from "@/styles/victory_modal.module.css";
import { useState, useEffect } from "react";

export default function VictoryModal({ open, onClose, message, onPlayAgain }) {
  const router = useRouter();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);
  const handleExit = () => {
    router.push('/login'); // Replace '/main' with the path to your main page
  };
  const handlePlayAgain = () => {
    onPlayAgain();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="victory-modal"
        aria-describedby="Appears when player wins a game"
      >
        <Box className={styles.message_container}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Congratulations!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
          <Confetti width={width} height={height} />
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handlePlayAgain}>
              Play Again
            </Button>
            <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={handleExit}>
              Exit Game
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

