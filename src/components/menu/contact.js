import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

import { Button, Snackbar, TextField } from '@mui/material';
import styles from '@/styles/contact.module.css';

/*
 * Contact gives a form asking the user for a name, email, and message 
 * and sends the information to the lab email (not put here for privacy purposes).
 * If all of the information fields are empty, or an error occurred while sending the 
 * email, a snackbar will popup to inform the user of the situation.
 */
export default function Contact() {

    const [isSent, setIsSent] = useState(false);

    const form = useRef();


    const sendEmail = (e) => {
        e.preventDefault();

        if (isEmptyForm()) {
            openSnackbar(emptyFormMessage);
            return;
        }

        emailjs.sendForm(process.env.SERVICE_ID, 
                         process.env.EMAIL_TEMPLATE_ID, 
                         form.current,
                         process.env.PUBLIC_KEY_EMAIL)
        .then(() => {
            setIsSent(true);
        }, () => {
            openSnackbar(errorMessage);
        });
    };

    const isEmptyForm = () => {
        return form.current.user_name.value === "" && 
               form.current.user_email.value === "" && 
               form.current.message.value === "";
    }



    //For SnackBar Messages
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState();

    let errorMessage = "An error occurred while trying to submit";
    let emptyFormMessage = "Please fill out all fields before submitting";

    const openSnackbar = (message) => {
        setSnackbarMessage(message);
        setOpen(true);
    }

    const closeSnackBar = (event, reason) => {
        //Need event as a parameter to monitor if a click was made
        //To prevent snackbar from disappearing by clicking elsewhere
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };



    return (
        <>
        {isSent === false ? (
            <>

            <form ref={form} onSubmit={sendEmail} className={styles.form}>

                <div className={styles.top}>
                    <TextField 
                        variant="outlined"
                        label="Name"
                        name="user_name" //name property is used by emailjs dependency to pull data from text fields
                        className={styles.top_box}
                    />

                    <TextField 
                        variant="outlined"
                        label="Email"
                        name="user_email"
                        className={styles.top_box}
                    />
                </div>
                
                <TextField 
                    variant="outlined"
                    label="Message"
                    name="message"
                    multiline
                    rows={3} //arbitrarily chosen
                    className={styles.textbox}
                />

                <Button type="submit">Send</Button>

            </form>

            <Snackbar
                open={open}
                autoHideDuration={2000} //milliseconds, arbitrarily chosen
                message={snackbarMessage}
                onClose={closeSnackBar}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }} //anchors the snackbar to a part of the screen
            />

            </>

        ) : (
            <div className={styles.sent_message}>
                Your message has been sent :)
            </div>
        )}
        </>
    )
}


