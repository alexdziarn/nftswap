// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import './Delegated.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract NftSwap is ERC20, Delegated {

  constructor() ERC20("NftSwap Credit", "NFTC") {
  }

  uint public totalShares = 0;
  mapping(address => uint) private shares;

  uint public constant PRECISION_FACTOR = 10**18;

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
      require(prices[nfts[i].nftAddress] > 0);
      IERC721(nfts[i].nftAddress).transferFrom(msg.sender, address(this), nfts[i].tokenId);
      total += prices[nfts[i].nftAddress];
    }
    // calculate cut for sender, owner, and stakers
    uint ownerCut = (total*ownerFee)/10000;
    uint stakersCut = (total*stakersFee)/10000;
    uint senderCut = total - ownerCut - stakersCut;
    // mint credits to sender
    _mint(msg.sender, senderCut);
    // mint credits to owner
    _mint(owner(), ownerCut);
    // mint credits to staking contract
    _mint(address(this), stakersCut);
    emit DepositNfts(msg.sender, nfts);
  }

  // exchange nftSwapCredits for NFTs
  function withdrawNfts(swap[] calldata nfts) public {
    uint len = nfts.length;
    for(uint i=0; i<len; i++) {
      uint nftPrice = prices[nfts[i].nftAddress];
      // require sender to have enough nftSwapCredit in account
      require(balanceOf(msg.sender) > nftPrice, "Not enough credits in wallet");
      IERC721(nfts[i].nftAddress).transferFrom(address(this), msg.sender, nfts[i].tokenId);
      // burns tokens
      _burn(msg.sender, nftPrice);
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
    uint sharesToReceive = calculateCreditToShare(amount);
    _transfer(msg.sender, address(this), amount);
    totalShares += sharesToReceive;
    shares[msg.sender] += sharesToReceive;
    emit Stake(msg.sender, sharesToReceive); //change to amount
  }

  function unstake(uint amount) external {
    // checks if they have the amount of shares to unstake
    uint sharesToUnstake = calculateCreditToShare(amount);
    require(shares[msg.sender] >= sharesToUnstake, "Not enough credits to unstake");
    _transfer(address(this), msg.sender, amount);
    totalShares -= sharesToUnstake;
    shares[msg.sender] -= sharesToUnstake;
    emit Unstake(msg.sender, sharesToUnstake); // change to amount
  }

  function calculateCreditToShare(uint creditAmount) public view returns(uint) {
    return (creditAmount*PRECISION_FACTOR)/getSharePrice();
  }

  function calculateShareToCredit(uint shareAmount) public view returns(uint) {
    return (shareAmount*getSharePrice())/PRECISION_FACTOR;
  }

  function getSharePrice() public view returns (uint) {
    if(balanceOf(address(this)) > 0 && totalShares > 0) {
      return balanceOf(address(this))*PRECISION_FACTOR/totalShares;
    } else if(balanceOf(address(this)) > 0) {
      return balanceOf(address(this));
    } else {
      return PRECISION_FACTOR;
    }
  }

  function getShares(address account) external view returns(uint) {
    return shares[account];
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