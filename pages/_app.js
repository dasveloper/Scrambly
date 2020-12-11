import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Scrambly | Image Scrabler</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
