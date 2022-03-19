// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import './Delegated.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract NftSwap is Delegated {

  IERC20 public immutable nftSwapCredit;

  constructor(address nftSwapCredit20) {
    nftSwapCredit = IERC20(nftSwapCredit20);
  }

  uint public totalCreditStaked = 0;
  uint public totalShares = 0;
  mapping(address => uint) public shares;

  uint public constant PRECISION_FACTOR = 10**18;
  uint sharePrice = PRECISION_FACTOR;

  // fees for owner and stakers
  uint public ownerFee = 100; //Basis Points
  uint public stakersFee = 100;


  event AddNft(address nftAddress, uint price);
  event SetPrices(collection[]);
  event DepositNfts(address indexed user, swap[] nfts);
  event WithdrawNfts(address indexed user, swap[] nfts);
  event SwapNfts(address indexed user, swap[] inboundNfts, swap[] outboundNfts);
  event Stake(address indexed user, uint amount);
  event Unstake(address indexed user, uint amount);
  event SetOwnerFee(uint fee);
  event SetStakersFee(uint fee);

  struct collection {
    address nftAddress;
    uint price;
  }

  struct swap {
    address nftAddress;
    uint tokenId;
  }

  mapping (address => uint) internal prices; // uses contract address

  function getPrice(address nftAddress) external view returns (uint) {
    return prices[nftAddress];
  }

  function addNft(address nftAddress, uint price) external onlyDelegates {
    prices[nftAddress] = price;
    emit AddNft(nftAddress, price);
  }

  function setPrices(collection[] calldata newPrices) external onlyDelegates {
    uint len = newPrices.length;
    for(uint i=0; i < len; i++) {
      prices[newPrices[i].nftAddress] = newPrices[i].price;
    }
    emit SetPrices(newPrices);
  }

  // exchange Nfts for nftSwapCredits
  function depositNfts(swap[] calldata nfts) public {
    uint total = 0;
    uint len = nfts.length;
    // transfer nfts from user to the contract, add NFTC based on value
    for(uint i=0; i<len; i++) {
      IERC721(nfts[i].nftAddress).transferFrom(msg.sender, address(this), nfts[i].tokenId);
      total += prices[nfts[i].nftAddress];
    }
    // calculate cut for sender, owner, and stakers
    uint ownerCut = (total*ownerFee)/10000;
    uint stakersCut = (total*stakersFee)/10000;
    uint senderCut = total - ownerCut - stakersCut;
    // send credit to sender
    nftSwapCredit.transfer(msg.sender, senderCut);
    // send credit to owner
    nftSwapCredit.transfer(owner(), ownerCut);
    // increase share value for stakers
    sharePrice *= 1 + (stakersCut/totalCreditStaked);
    totalCreditStaked += stakersCut;
    emit DepositNfts(msg.sender, nfts);
  }

  // exchange nftSwapCredits for NFTs
  function withdrawNfts(swap[] calldata nfts) public {
    uint len = nfts.length;
    for(uint i=0; i<len; i++) {
      uint nftPrice = prices[nfts[i].nftAddress];
      // require sender to have enough nftSwapCredit in account
      require(nftSwapCredit.balanceOf(msg.sender) > nftPrice, "Not enough credits in wallet");
      IERC721(nfts[i].nftAddress).transferFrom(address(this), msg.sender, nfts[i].tokenId);
      nftSwapCredit.transferFrom(msg.sender, address(this), nftPrice);
    }
    emit WithdrawNfts(msg.sender, nfts);
  }

  // exchange Nfts for Nfts, leftover value is given in nftSwapCredits
  function swapNfts(swap[] calldata inboundNfts, swap[] calldata outboundNfts) external {
    depositNfts(inboundNfts);
    withdrawNfts(outboundNfts);
    emit SwapNfts(msg.sender, inboundNfts, outboundNfts);
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

  function calculateCreditToShare(uint amount) internal view returns(uint) {
    return amount/sharePrice;
  }

  function calculateShareToCredit(uint amount) internal view returns(uint) {
    return amount*sharePrice;
  }

  function setOwnerFee(uint fee) external onlyDelegates {
    ownerFee = fee;
    emit SetOwnerFee(fee);
  }

  function setStakersFee(uint fee) external onlyDelegates {
    stakersFee = fee;
    emit SetStakersFee(fee);
  }
}