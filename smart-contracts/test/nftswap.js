const NftSwap = artifacts.require("NftSwap");
const Nft = artifacts.require("ERC721PresetMinterPauserAutoId");
const Web3 = require('web3');

contract('NftSwap', (accounts) => {
  it('should mint 2 test nfts to 2 addresses', async() => {
    const nftInstance = await Nft.deployed();
    await nftInstance.mint(accounts[0]);
    await nftInstance.mint(accounts[0]);
    await nftInstance.mint(accounts[1]);
    await nftInstance.mint(accounts[1]);
    await nftInstance.mint(accounts[2]);
    await nftInstance.mint(accounts[2]);
    assert.equal(await nftInstance.balanceOf.call(accounts[0]), 2);
    assert.equal(await nftInstance.balanceOf.call(accounts[1]), 2);
  })

  it('should add nft and set price to 1 NFTC', async() => {
    const nftSwapInstance = await NftSwap.deployed();
    const nftInstance = await Nft.deployed();
    await nftSwapInstance.addNft(nftInstance.address, Web3.utils.toWei('1', 'ether'));
    const price = await nftSwapInstance.getPrice.call(nftInstance.address);
    assert.equal(price, Web3.utils.toWei('1', 'ether'), "price of nft was not 1NFTC");
  });

  describe('when finished with setup', () => {
    it('should change nft price to 2 NFTC', async() => {
      const nftSwapInstance = await NftSwap.deployed();
      const nftInstance = await Nft.deployed();
      const priceBefore = await nftSwapInstance.getPrice.call(nftInstance.address);
      const nftPrice = [{
        nftAddress: nftInstance.address,
        price: Web3.utils.toWei('2', 'ether'),
      }]
      await nftSwapInstance.setPrices(nftPrice);
      const price = await nftSwapInstance.getPrice.call(nftInstance.address);
      assert.notEqual(price, priceBefore, "price after equals price before");
      assert.equal(price, Web3.utils.toWei('2', 'ether'), "price of nft was not 2NFTC");
    })
  
    it('should deposit nft and mint tokens', async() => {
      const nftSwapInstance = await NftSwap.deployed();
      const nftInstance = await Nft.deployed();
      const nfts = [
        {
          nftAddress: nftInstance.address,
          tokenId: 2
        },
        {
          nftAddress: nftInstance.address,
          tokenId: 3
        },
      ];
      // get nft price
      const price = await nftSwapInstance.getPrice(nftInstance.address);
      // nft balance before acc1
      const balanceBefore = await nftInstance.balanceOf.call(accounts[1]);
      // nftc balance before acc
      const nftcBalanceBeforeAcc0 = await nftSwapInstance.balanceOf.call(accounts[0]);
      const nftcBalanceBeforeAcc1 = await nftSwapInstance.balanceOf.call(accounts[1]);
      // user must approve contract
      await nftInstance.setApprovalForAll(nftSwapInstance.address, true, {from: accounts[1]});
      await nftSwapInstance.depositNfts(nfts, {from: accounts[1]});
      // nft balance after call
      const balanceAfter = await nftInstance.balanceOf.call(accounts[1]);
      assert.equal(balanceAfter, balanceBefore - 2, "did not deposit 2 nfts");
      // price of the nft is set to be 2 NFTC, should return 98% with 2 nfts to 3.92 NFTC total
      const nftcBalanceAfterAcc0 = await nftSwapInstance.balanceOf.call(accounts[0]);
      const nftcBalanceAfterAcc1 = await nftSwapInstance.balanceOf.call(accounts[1]);
      assert.equal(nftcBalanceAfterAcc1-nftcBalanceBeforeAcc1, price*nfts.length*.98, 'depositer should receive 98% value of nfts deposited');
      assert.equal(nftcBalanceAfterAcc0-nftcBalanceBeforeAcc0, price*nfts.length*.01, 'owner should receive 1% value of nfts deposited');
    })
  
    it('should withdraw nfts and burn tokens', async() => {
      const nftSwapInstance = await NftSwap.deployed();
      const nftInstance = await Nft.deployed();
      const nfts = [
        {
          nftAddress: nftInstance.address,
          tokenId: 2
        },
      ];
      // get nft price
      const price = await nftSwapInstance.getPrice(nftInstance.address);
      // get nftc balance before withdraw
      const nftcBalanceBefore = await nftSwapInstance.balanceOf.call(accounts[1]);
      await nftSwapInstance.withdrawNfts(nfts, {from: accounts[1]});
      // get nftc balance after withdraw
      const nftcBalanceAfter = await nftSwapInstance.balanceOf.call(accounts[1]);
      assert.equal(nftcBalanceBefore-nftcBalanceAfter, price, 'did not burn tokens correctly');
    })

    it('should swap nfts using swapNfts function', async() => {
      const nftSwapInstance = await NftSwap.deployed();
      const nftInstance = await Nft.deployed();
      const nftsOut = [
        {
          nftAddress: nftInstance.address,
          tokenId: 4
        },
        {
          nftAddress: nftInstance.address,
          tokenId: 5
        },
      ];
      const nftsIn = [
        {
          nftAddress: nftInstance.address,
          tokenId: 3
        },
      ];
      const price = await nftSwapInstance.getPrice(nftInstance.address);
      const nftcBalanceBefore = await nftSwapInstance.balanceOf(accounts[2]);
      // must approve contract
      await nftInstance.setApprovalForAll(nftSwapInstance.address, true, {from: accounts[2]});
      await nftSwapInstance.swapNfts(nftsOut, nftsIn, {from: accounts[2]});
      const nftcBalanceAfter = await nftSwapInstance.balanceOf(accounts[2]);
      assert.equal(nftcBalanceAfter-nftcBalanceBefore, price*nftsOut.length*.98-price*nftsIn.length, 'payout is incorrect');
    })
  })
});
