import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import coolmansABI from './abis/coolmansUniverseABI.json';
import fishyfamABI from './abis/fishyfamABI.json';

const NftCards = (props) => {

  const [nfts, setNfts] = useState([]);



  async function loadCoolmans() {
    // loadscoolmans
    const coolmansContractAddress = "0xa5C0Bd78D1667c13BFB403E2a3336871396713c5";
    const coolmansContract = new window.web3.eth.Contract(coolmansABI.abi, coolmansContractAddress);
    coolmansContract.methods.balanceOf(props.userAddress).call().then((bal) => {
      for(let i = 0; i < bal; i++) {
        coolmansContract.methods.tokenOfOwnerByIndex(props.userAddress, i).call().then((tokenNum) => {
          coolmansContract.methods.tokenURI(tokenNum).call().then((ipfs) => {
            fetch('https://ipfs.io/ipfs/' + ipfs.replace('ipfs://', ''))
              .then((res) => {
                return res.json()
              }).then((obj) => {
                let newObj = obj;
                newObj.image = 'https://ipfs.io/ipfs/' + obj.image.replace('ipfs://', '')
                setNfts(nfts => [...nfts, newObj])
              })
          })
        })
      }
    })
  }

  async function loadFishyFam() {
    // loads FishyFam
    const fishyfamContractAddress = "0x63FA29Fec10C997851CCd2466Dad20E51B17C8aF";
    const fishyfamContract = new window.web3.eth.Contract(fishyfamABI.abi, fishyfamContractAddress);
    fishyfamContract.methods.walletOfOwner(props.userAddress).call().then((arrOfTokens) => {
      for(let i = 0; i < arrOfTokens.length; i++) {
        fishyfamContract.methods.tokenURI(arrOfTokens[i]).call().then((ipfs) => {
          fetch(ipfs)
            .then((res) => {
              return res.json();
            }).then((obj) => {
              setNfts(nfts => [...nfts, obj])
            })
        })
      }
    })
  }

  useEffect(() => {
    loadCoolmans();
    loadFishyFam();
  }, []);
  

  return (
    <div className='userNfts'>
      {
        nfts.map(nft => {
          return (
            <Card className='card' key={nft.name}>
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
  )
}

export default NftCards;