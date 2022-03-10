import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import coolmansABI from './abis/coolmansUniverseABI.json';
import boredApeYachtClubABI from './abis/BoredApeYachtClub.json';
import mutantApeYachtClubABI from './abis/MutantApeYachtClub.json';
import boredApeKennelClubABI from './abis/BoredApeKennelClub.json';
import cloneXABI from './abis/CloneX.json';

const NftCards = (props) => {

  const [nfts, setNfts] = useState([]);
  const [offers, setOffers] = useState([]);
  

  function loadNfts() {
    // loadBoredApeYachtClub();
    loadMutantApeYachtClub();
    loadBoredApeKennelClub();
    loadCloneX();
    loadCoolmans();
  }

  //cloudflare giving 403 forbidden
  async function loadBoredApeYachtClub() {
    const address = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
    const contract = new window.web3.eth.Contract(boredApeYachtClubABI.abi, address);
    contract.methods.balanceOf(props.userAddress).call().then((bal) => {
      const arr = [];
      for(let i = 0; i < bal; i++) {
        arr.push(contract.methods.tokenOfOwnerByIndex(props.userAddress, i).call().then((tokenNum) => {
          contract.methods.tokenURI(tokenNum).call().then(async(ipfs) => {
            console.log(ipfs);
            await fetch('https://ipfs.io/ipfs/' + ipfs.replace('ipfs://', ''))
              .then((res) => {
                return res.json()
              }).then((obj) => {
                let newObj = obj;
                console.log(newObj);
                newObj.image = 'https://ipfs.io/ipfs/' + obj.image.replace('ipfs://', '')
                newObj.name = `Bored Ape Yacht Club ${tokenNum}`;
                setNfts(nfts => [...nfts, newObj])
              })
              .catch((err) => {
                console.error(err);
              })
          })
        }));
      }
    })
  }

  async function loadMutantApeYachtClub() {
    const address = "0x60E4d786628Fea6478F785A6d7e704777c86a7c6";
    const contract = new window.web3.eth.Contract(mutantApeYachtClubABI.abi, address);
    contract.methods.balanceOf(props.userAddress).call().then((bal) => {
      const arr = [];
      for(let i = 0; i < bal; i++) {
        arr.push(contract.methods.tokenOfOwnerByIndex(props.userAddress, i).call().then((tokenNum) => {
          contract.methods.tokenURI(tokenNum).call().then(async(ipfs) => {
            await fetch(ipfs)
              .then((res) => {
                return res.json();
              }).then((obj) => {
                let newObj = obj;
                newObj.image = 'https://cloudflare-ipfs.com/ipfs/' + obj.image.replace('ipfs://', '')
                newObj.name = `Mutant Ape Yacht Club ${tokenNum}`;
                setNfts(nfts => [...nfts, newObj])
              })
              .catch((err) => {
                console.error(err);
              })
          })
        }));
      }
    })
  }

  async function loadBoredApeKennelClub() {
    const address = "0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623";
    const contract = new window.web3.eth.Contract(boredApeKennelClubABI.abi, address);
    contract.methods.balanceOf(props.userAddress).call().then((bal) => {
      const arr = [];
      for(let i = 0; i < bal; i++) {
        arr.push(contract.methods.tokenOfOwnerByIndex(props.userAddress, i).call().then((tokenNum) => {
          contract.methods.tokenURI(tokenNum).call().then(async(ipfs) => {
            await fetch('https://cloudflare-ipfs.com/ipfs/' + ipfs.replace('ipfs://', ''), {mode:'cors'})
              .then((res) => {
                return res.json();
              }).then((obj) => {
                let newObj = obj;
                newObj.image = 'https://cloudflare-ipfs.com/ipfs/' + obj.image.replace('ipfs://', '')
                newObj.name = `Bored Ape Kennel Club ${tokenNum}`;
                setNfts(nfts => [...nfts, newObj])
              })
              .catch((err) => {
                console.error(err);
              })
          })
        }));
      }
    })
  }

  async function loadCloneX() {
    const address = "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B";
    const contract = new window.web3.eth.Contract(cloneXABI.abi, address);
    contract.methods.balanceOf(props.userAddress).call().then((bal) => {
      const arr = [];
      for(let i = 0; i < bal; i++) {
        arr.push(contract.methods.tokenOfOwnerByIndex(props.userAddress, i).call().then((tokenNum) => {
          contract.methods.tokenURI(tokenNum).call().then(async(ipfs) => {
            await fetch(ipfs)
              .then((res) => {
                return res.json();
              }).then((obj) => {
                setNfts(nfts => [...nfts, obj])
              })
              .catch((err) => {
                console.error(err);
              })
          })
        }));
      }
    })
  }

  async function loadCoolmans() {
    const address = "0xa5C0Bd78D1667c13BFB403E2a3336871396713c5";
    const contract = new window.web3.eth.Contract(coolmansABI.abi, address);
    contract.methods.balanceOf(props.userAddress).call().then((bal) => {
      const arr = [];
      for(let i = 0; i < bal; i++) {
        arr.push(contract.methods.tokenOfOwnerByIndex(props.userAddress, i).call().then((tokenNum) => {
          contract.methods.tokenURI(tokenNum).call().then(async(ipfs) => {
            await fetch('https://cloudflare-ipfs.com/ipfs/' + ipfs.replace('ipfs://', ''))
              .then((res) => {
                return res.json()
              }).then((obj) => {
                let newObj = obj;
                newObj.image = 'https://cloudflare-ipfs.com/ipfs/' + obj.image.replace('ipfs://', '')
                setNfts(nfts => [...nfts, newObj])
              })
              .catch((err) => {
                console.error(err);
              })
          })
        }));
      }
    });
  }
  
  //setNfts(nfts => [...nfts, newObj])

  function addToOffer(nft) {
    if(offers.filter(e => e.name === nft.name).length > 0) {
      removeFromOffer(nft);
    } else {
      setOffers(nfts => [...nfts, nft]);
    }
  }
  function removeFromOffer(nft) {
    setOffers(offers.filter((e) => e.name !== nft.name))
  }

  useEffect(() => {
    loadNfts();
  }, []);
  

  return (
    <div className='left'>
      <div className='you-offer'>
        <div className="d-flex justify-content-between">
          <header>You offer:</header>
          <header>Total: $<span></span></header>
        </div>
        <div className="offers d-flex flex-wrap overflow-auto">
          {
            offers.map(nft => {
              return (
                <Card className='card' key={nft.name} onClick={()=>{removeFromOffer(nft)}}>
                  <img src={nft.image} alt={nft.name}/>
                  <div className='card-overlay'>
                    <div className='nft-info'>
                      <span>{nft.name}</span>
                      <span>Price:</span>
                    </div>
                  </div>
                </Card>
              )
            })
          }
        </div>
      </div>
      <div className='your-items overflow-auto'>
        <div className="d-flex justify-content-between">
          <header>Your NFTs:</header>
          <Button className='float-right' onClick={()=>{setNfts([]);loadNfts();}}>Refresh</Button>
        </div>
        <div className='userNfts'>
          {
            nfts.map(nft => {
              return (
                <Card className='card' key={nft.name} onClick={()=>{addToOffer(nft)}}>
                  <img src={nft.image} alt={nft.name}/>
                  <div className='card-overlay'>
                    <div className='nft-info'>
                      <span>{nft.name}</span>
                      <span>Price:</span>
                    </div>
                  </div>
                  {offers.filter(e => e.name === nft.name).length > 0 && 
                    <div className="selected">
                      <FontAwesomeIcon className='m-auto d-block h-50' icon={solid('cart-shopping')} />
                    </div>
                  }
                </Card>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default NftCards;