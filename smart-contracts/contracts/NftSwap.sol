// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import './Delegated.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import './NftSwapCredit.sol';

contract NftSwap {

  IERC20 public immutable nftSwapCredit;

  uint public totalCreditStaked = 0;
  uint public totalShares = 0;
  mapping(address => uint) public shares;

  uint public constant PRECISION_FACTOR = 10**18;
  uint sharePrice = PRECISION_FACTOR;

  // fees for owner and stakers
  uint public ownerFee = 100; //Basis Points
  uint public stakersFee = 100;


  event AddCollection(collection newCollection);
  event SetPrices();
  event DepositNfts(address indexed user, swap[] nfts);
  event WithdrawNfts(address indexed user, swap[] nfts);
  event Stake(address indexed user, uint amount);
  event Unstake(address indexed user, uint amount);
  event SetOwnerFee(uint fee);
  event SetStakersFee(uint fee);

  struct collection {
    string name;
    address nftAddress;
    uint price;
  }

  struct swap {
    address nftAddress;
    uint tokenId;
  }

  mapping (address => collection) internal collections; //uses contract address

  function getBalance(address userAddress) external view returns (uint) {
    return balances[userAddress];
  }

  function getCollection(address nftAddress) external view returns (collection) {
    return collections[nftAddress];
  }

  function addCollection(string name, address nftAddress, uint price) external onlyDelegates {
    collection newCollection = collection(name, nftAddress, price, ERC721(nftAddress));
    collections[nftAddress] = newCollection;
    emit AddCollection(newCollection);
  }

  function setPrices(collection[] newPrices) external onlyDelegates {
    uint len = newPrices.length;
    for(uint i=0; i < len; i++) {
      collections[newPrices[i].tokenAddress].price = newPrices[i].price;
    }
    emit SetPrices();
  }

  // exchange Nfts for nftSwapCredits
  function depositNfts(swap[] nfts) external {
    collection col = collections[nftAddress];
    uint total = 0;
    uint len = nfts.length;
    // transfer nfts from user to the contract, add NFTC based on value
    for(uint i=0; i<len; i++) {
      IERC721(nfts[i].nftAddress).transferFrom(msg.sender, address(this), nfts[i].tokenId);
      total += collections[nfts[i].nftAddress].price;
    }
    // calculate cut for sender, owner, and stakers
    uint senderCut = total - ownerCut - stakersCut;
    uint ownerCut = (total*ownerFee)/10000;
    uint stakersCut = (total*stakersFee)/10000;
    // send credit to sender
    nftSwapCredit.transfer(msg.sender, senderCut);
    // send credit to owner
    nftSwapCredit.transfer(owner(), ownerCut);
    // increase share value for stakers
    sharePrice *= 1 + (stakersCut/totalStaked);
    emit DepositNfts();
  }

  // exchange Nfts for Nfts, leftover value is given in nftSwapCredits
  function swapNfts(swap[] incomingNfts, swap[] outboundNfts) external {

  }

  // exchange nftSwapCredits for NFTs
  function withdrawNfts(swap[] nfts) external {
    uint len = nfts.length;
    for(uint i=0; i<len; i++) {
      uint nftPrice = collections[nfts[i].nftAddress].price;
      // require sender to have enough nftSwapCredit in account
      require(nftSwapCredit.getBalance(msg.sender) > nftPrice, "Not enough credits in wallet");
      IERC721(nfts[i].nftAddress).transfer(msg.sender, nfts[i].tokenId);
      nftSwapCredit.transferFrom(msg.sender, address(this), nftPrice);
    }
  }

  function stake(uint amount) external {
    nftSwapCredit.transferFrom(msg.sender, address(this), amount);
    // adds total credits staked
    totalCreditStaked += amount;
    uint sharesToReceive = calculateCreditToShare(amount);
    totalShares += sharesToReceive;
    shares[msg.sender] += sharesToReceive;
    emit Stake(msg.sender, sharesToReceive);
  }

  function unstake(uint amount) external {
    // checks if they have the amount of shares to unstake
    uint sharesToUnstake = calculateCreditToShare(amount);
    require(shares[msg.sender] >= sharesToUnstake, "Not enough credits to unstake");
    nftSwapCredit.transfer(msg.sender, amount);
    totalShares -= sharesToUnstake;
    shares[msg.sender] -= sharesToUnstake;
    emit Unstake(msg.sender, sharesToUnstake);
  }

  function calculateCreditToShare(uint amount) internal {
    return amount/sharePrice;
  }

  function calculateShareToCredit(uint amount) internal {
    return amount*sharePrice;
  }

  function setOwnerFee(uint fee) external onlyDelegates {
    ownerFee = fee;
    emit SetOwnerFee(fee);
  }

  function setStakersFee(uint fee) external onlyDelegates {
    stakerFee = fee;
    emit SetStakersFee(fee);
  }
}