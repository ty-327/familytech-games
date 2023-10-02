import { useContext, createContext, useState, useEffect } from 'react';
import AuthService from '@/services/auth-service';
import { useRouter } from 'next/router';
import { isDev } from '@/lib/utils'

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [cookieExists, setCookieExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (AuthService.hasCookie()) {
      setAccessToken(AuthService.getFSCookieValue());
    } else if (isDev && router.query.fstoken) {
      // dev only
      setAccessToken(router.query.fstoken);
      document.cookie = `FS_SSO_JWT_TOKEN=${router.query.fstoken}`;
    }
    checkForCookie();
  }, [router.query.fstoken]);

  const doLogin = async () => {
    await AuthService.doLogin();
  };

  const doLogout = async () => {
    await AuthService.doLogout();
    setAccessToken(null);
  };

  const checkForCookie = () => {
    const hasCookie = AuthService.hasCookie();
    setCookieExists(hasCookie);
  };

  const context = {
    accessToken,
    cookieExists,
    doLogin,
    doLogout,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
