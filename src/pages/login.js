import LoginButton from '@/components/login_button';
import styles from '@/styles/login.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const { cookieExists } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (cookieExists) {
      router.push("/");
    }
  }, [cookieExists])

  return (
    <div className={styles.container}>
      <LoginButton />
    </div>
  );
}
