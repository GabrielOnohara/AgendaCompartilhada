import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import TokenStorage from "../src/context/TokenContext";
import CompanyStorage from "../src/context/CompanyContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = React.useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  return (
    <TokenStorage>
      <CompanyStorage>
        <Component {...pageProps} />
      </CompanyStorage>
    </TokenStorage>
  );
}

export default MyApp;
