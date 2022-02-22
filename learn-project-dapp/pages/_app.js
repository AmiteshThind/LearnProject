import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";
import UserNavbar from '../components/user/UserNavBar';
import { useState } from 'react';
import {Moralis} from 'moralis';
import { motion } from 'framer-motion';


function MyApp({ Component, pageProps,  }) {
  

  Moralis.initialize(process.env.NEXT_PUBLIC_APP_ID);
  Moralis.serverURL = process.env.NEXT_PUBLIC_SERVER_URL
  return (
    <MoralisProvider appId={process.env.NEXT_PUBLIC_APP_ID} serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}>
      
  
      <Component {...pageProps} />
 
    </MoralisProvider>
  )
}export default MyApp
