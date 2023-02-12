import 'bootstrap/dist/css/bootstrap.css'; 
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import UserStorage from '../src/context/UserContext';
import TokenStorage from '../src/context/TokenContext';

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    typeof document !== undefined 
    ? require('bootstrap/dist/js/bootstrap') 
    : null
  }, [])

  return (
  <TokenStorage>
    <Component {...pageProps} />
  </TokenStorage>
  )
}

export default MyApp
