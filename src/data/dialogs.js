import BugIcon from '@mui/icons-material/BugReportOutlined';
import Contact from '@/components/menu/contact.js';

/*
 * Any menu item that appears as a dialog once clicked and is 
 * always shown is contained below
*/

export const DIALOGS = [
    {
        menuTitle: "Contact Us",
        dialogTitle: <div>Contact Us</div>,
        dialogContent:
            <div>
                We love hearing from our users! Let us know of any 
                suggestions, ideas, or stories you'd like to share!

                <Contact/>
            </div>,
    },
    {
        menuTitle: "Report a Bug",
        dialogTitle: <div>Oh no! <BugIcon/></div>,
        dialogContent: 
            <div>
                Found a bug crawling in our website? 
                Please let us know so we can remove it! 

                <Contact/>
            </div>,
    },
    {
        menuTitle: "Settings",
        dialogTitle: <div>Settings</div>,
        dialogContent: 
            <div>
                Customize your settings here!
            </div>,
    }

]