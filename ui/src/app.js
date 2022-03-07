import './app.css';
import React, {useEffect, useState} from 'react'
import { Button } from 'react-bootstrap';
import web3 from 'web3';
import Wallets from './components/wallets';

import NftCards from './components/nftCard';


function App() {

  const [accounts, setAccounts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [showWallets, setShowWallets] = useState(false);

  async function loadWeb3() {
    try {
      if (window.ethereum) {
        window.web3 = new web3(window.ethereum);
        setAccounts(await window.ethereum.request({ method: 'eth_requestAccounts' }));
        setShowWallets(false);
        setConnected(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadWeb3();
  }, [accounts])

  return (
    <div>
      {connected ? null : <Button className='connect' onClick={()=>{setShowWallets(true)}}>Connect</Button>}
      <Wallets loadWeb3={loadWeb3} showWallets={showWallets} setShowWallets={setShowWallets}></Wallets>
      <div className='trade'>
        {
        connected ? 
          <NftCards userAddress={"0x62251103308a69be7c27d22f81e4b2dfbe00c7cf"}></NftCards>
        : 
          <div>Connect Wallet to trade</div>
        }
        <div className='right'>
          <div className='you-get'>
            <header>You get:</header>
          </div>
          <div className='bank-items'>
            <header>Bank:</header>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}

export default App;
