import React, {useState} from 'react';
import { Modal, Button } from 'react-bootstrap';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import metamask from '../assets/metamask.svg';
import coinbasewallet from '../assets/coinbasewallet.png';

const Wallets = (props) => {


  return (
    <Modal show={props.showWallets} onHide={()=>{props.setShowWallets(false)}}>
      <Modal.Header closeButton>
          <Modal.Title>Connect your wallet</Modal.Title>
      </Modal.Header>
      <div className="wallets">
        <Button onClick={props.loadWeb3}>
          <img className="m-auto" src={metamask} alt="metamask wallet"></img>
          <span>MetaMask</span>
        </Button>
        <Button onClick={props.loadWeb3}>
          <img className='m-auto' src={coinbasewallet} alt="coinbase wallet"></img>
          <span>Coinbase Wallet</span>
        </Button>
      </div>
    </Modal>
  )
}

export default Wallets;