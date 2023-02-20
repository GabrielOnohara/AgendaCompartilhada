import 'bootstrap/dist/css/bootstrap.css'; 
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import TokenStorage from '../src/context/TokenContext';
import CompanyStorage from '../src/context/CompanyContext';

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    typeof document !== undefined 
    ? require('bootstrap/dist/js/bootstrap') 
    : null
  }, [])

  return (
  <TokenStorage>
    <CompanyStorage>
      <Component {...pageProps} />
    </CompanyStorage>
  </TokenStorage>
  )
}

export default MyApp
