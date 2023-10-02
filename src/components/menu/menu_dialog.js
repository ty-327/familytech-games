import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem } from '@mui/material';
import styles from '@/styles/menu_dialog.module.css';


/*
 * MenuDialog acts as a template for any new popup to be added to the main menu
 * 
 * @param props holds all the content to display, broken into categories
 * @returns A dialog nested within a menu item
 */
export default function MenuDialog(props) {

    const { menuTitle, dialogTitle, dialogContent, closeMenu } = props;

    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };
    
    const closeAll = () => {
        // Closes the current dialog and the menu
        // The menu doesn't close when the dialog is open because the 
        // dialog component is nested within the menu component and would close as well.
        setOpen(false);
        closeMenu();
    };


    return (
        <>

        <MenuItem onClick={openDialog}>{ menuTitle }</MenuItem>

        <Dialog
            open={open}
            onClose={closeAll}
        >
  
            <DialogTitle className={styles.item}>
                {dialogTitle}
            </DialogTitle>

  
            <DialogContent className={styles.item}>
                {dialogContent}
            </DialogContent>


            <DialogActions>
                <Button onClick={closeAll}>Close</Button>
            </DialogActions>
  
        </Dialog>

        </>
    )
}