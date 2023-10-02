// pages/_document.js

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>FamilyTech Games</title>

          <meta name="description" content="Free, fun family history games" />
          <meta name="keywords"    content="Family, Family History, Genealogy, Ancestor, Relative, Games" />
          <meta name="theme-color" content="#2a3492" /> {/* var(--blue) in globals.css */}

          <link rel="manifest" href="/manifest.json" />
          
          <link rel="icon"     href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/icon192x192.png"></link>

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Electrolize&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
