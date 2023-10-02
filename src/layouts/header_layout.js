import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Menu, MenuItem, IconButton } from '@mui/material/';
import MenuDialog from '@/components/menu/menu_dialog';
import { DIALOGS } from '@/data/dialogs.js';
import styles from '@/styles/header_layout.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';

export default function HeaderLayout(props) {
  const router = useRouter();
  const { game } = useGame();

  return (
    <>
      <nav className={styles.container}>
        <BackButton url={router.pathname} />
        <h3>{game.title}</h3>
        <MenuButton url={router.pathname} game={game} />

      </nav>
      {props.children}
    </>
  );
}

function BackButton({ url }) {
  return (
    <Link href='/'>
      <IconButton className={url === '/' || url === '/login' ? styles.hidden : styles.visible}>
        <ArrowBackIcon fontSize='large' color='white' />
      </IconButton>
    </Link>
  );
}


function MenuButton({ url, game }) {
  const { cookieExists, doLogout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuRoundedIcon fontSize='large' color='white' />
      </IconButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        
        {/* If we are on a game page, show them the rules */}
        {url !== '/' && url !== '/login' ? (
          <MenuDialog
            menuTitle="How To Play"
            dialogTitle={game.title}
            dialogContent={game.rules}
            closeMenu={handleClose}
          />
        ) : null}


        {/* Dialogs data contains any constant menu item that appears as a dialog once clicked */}
        {DIALOGS.map((dialog) => {
          return (
            <MenuDialog
              menuTitle={dialog.menuTitle}
              dialogTitle={dialog.dialogTitle}
              dialogContent={dialog.dialogContent}
              closeMenu={handleClose}
              key={dialog.menuTitle}
            ></MenuDialog>
          )
        })}

        {cookieExists ? (
          <MenuItem
            onClick={() => {
              handleClose();
              doLogout();
            }}
          >
            Logout
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
}

