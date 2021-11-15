/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @next/next/no-css-tags */
import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { isServer } from 'utils/constant';

// Fix the warning of antd
if (isServer()) {
  React.useLayoutEffect = React.useEffect;
} else {
  // eslint-disable-next-line no-self-assign
  React.useLayoutEffect = React.useLayoutEffect;
}

// avoid CSS animation transition flashing

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
          <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="manifest" href="/manifest.json" />

          {/* Self hosted font */}
          <link rel="stylesheet" href="/fonts/Avenir/styles.css" />
          <link rel="stylesheet" href="/fonts/AzoSans/styles.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
