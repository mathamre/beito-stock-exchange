import { AppProps } from "next/app";
import "@navikt/ds-css"; // Import the styles for @navikt/ds-react components
import React from "react";
//import "@navikt/ds-css-internal"; // Include internal styling (if needed)
//import "globals.css"; // Import your global CSS file if you have one

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
