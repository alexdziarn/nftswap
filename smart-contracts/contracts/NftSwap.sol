// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import './Delegated.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract NftSwap {

  struct collection {
    string name;
    address tokenAddress;
    uint price;
    ERC721 nftContract;
  }

  bool public stakingLive = false;
  uint public ownerFee = 100; // Basis Points;
  uint public communityFee = 100;
  mapping (address => uint) internal balance; //uses user address
  mapping (address => collection) internal collections; //uses contract address

  constructor() {
  }

  function getBalance(address userAddress) public view returns (uint) {
    return balance[userAddress];
  }

  function getCollection(address nftAddress) public view returns (collection) {
    return collections[nftAddress];
  }

  function addCollection(string name, address tokenAddress, uint price) public onlyDelegates {
    collection newCollection = collection(name, tokenAddress, price, ERC721(tokenAddress));
    collections[tokenAddress] = newCollection;
  }

  function setPrices(collection[] newPrices) public onlyDelegates {
    uint len = newPrices.length;
    for(uint i=0; i < len; i++) {
      collections[newPrices[i].tokenAddress].price = newPrices[i].price;
    }
  }

  function depositNft(address tokenAddress, uint[] tokenIds) public {
    //require the person to own tokens
    uint len = tokenIds.length;
    collection col = collections[tokenAddress];
    for(uint i=0; i < len; i++) {
      balance[msg.sender] += col.price;
      col.nftContract.transferFrom(msg.sender, address(this), tokenId);
      // transfer ERC20 credit to msg.sender
    }
  }

  function stake() public {
    
  }

  function depositAndStake() public {

  }

  function unStake() public {

  }

  function setStaking(bool stake) public onlyDelegates {
    stakingLive = stake;
  }

  function setOwnerFee(uint newFee) public onlyDelegates {
    ownerFee = newFee;
  }

  function setCommunityFee(uint newFee) public onlyDelegates {
    communityFee = newFee;
  }

}