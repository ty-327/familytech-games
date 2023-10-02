import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import styles from '@/styles/login_button.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';

export default function LoginButton() {
  const { doLogin } = useAuth();
  const { loading, updateLoading } = useLoading();

  return (
    <>
      {loading ? (
        <CircularProgress color='green' />
      ) : (
        <Button
          variant='contained'
          size='small'
          className={styles.login}
          style={{padding: "20px"}}
          onClick={() => {
            doLogin();
            updateLoading(true);
          }}
        >
          Login with Family Search
        </Button>
      )}
    </>
  );
}
