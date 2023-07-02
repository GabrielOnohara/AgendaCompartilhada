import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import TokenStorage from "../src/context/TokenContext";
import CompanyStorage from "../src/context/CompanyContext";
import ContribuitorStorage from "../src/context/ContribuitorContext";

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
        <ContribuitorStorage>
          <Component {...pageProps} />
        </ContribuitorStorage>
      </CompanyStorage>
    </TokenStorage>
  );
}

export default MyApp;
