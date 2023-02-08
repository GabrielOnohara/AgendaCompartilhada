import 'bootstrap/dist/css/bootstrap.css'; 
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import UserStorage from '../src/context/UserContext';

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    typeof document !== undefined 
    ? require('bootstrap/dist/js/bootstrap') 
    : null
  }, [])

  return (
  <UserStorage>
    <Component {...pageProps} />
  </UserStorage>
  )
}

export default MyApp
