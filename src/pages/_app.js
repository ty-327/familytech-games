import '@/styles/globals.css';
import React from 'react';
import Layout from '@/layouts/header_layout';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { GameProvider } from '@/contexts/GameContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/lib/theme';

import PrivateRoute from 'private-route/PrivateRoute';
import { useRouter } from 'next/router';

import Footer from '@/layouts/footer_layout.js';


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noAuthRequired = ['/login'];

  return (

    <LoadingProvider>
      <GameProvider>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <UserProvider>
              {noAuthRequired.includes(router.pathname) ? (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              ) : (
                <PrivateRoute>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                  <Footer/>
                </PrivateRoute>
              )}
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </GameProvider>
    </LoadingProvider>

  );
}

export default MyApp;
