// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import './Delegated.sol';

contract NftSwap {

  struct collection {
    string name;
    address tokenAddress;
    uint price;
  }

  uint public ownerFee;
  uint public communityFee;
  mapping (address => uint) public balance; //uses user address
  mapping (address => collection) public collections; //uses contract address

  constructor() {
    ownerFee = 100; // Basis Points
    communityFee = 100;
  }

  function addCollection(string name, address tokenAddress, uint price) public onlyDelegates {
    collection newCollection = collection(name, tokenAddress, price);
    collections[tokenAddress] = newCollection;
  }

  function setPrices(collection[] newPrices) public onlyDelegates {
    for(uint i=0; i < newPrices.length; i++) {
      collections[newPrices[i].tokenAddress].price = newPrices[i].price;
    }
  }

  function depositNft() public {
    
  }

  function stake() public {
    
  }

  function depositAndStake() public {

  }

  function unStake() public {

  }

  function setOwnerFee(uint newFee) public onlyDelegates {
    ownerFee = newFee;
  }

  function setCommunityFee(uint newFee) public onlyDelegates {
    communityFee = newFee;
  }

}