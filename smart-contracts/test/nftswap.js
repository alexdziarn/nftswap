const NftSwap = artifacts.require("NftSwap");
const Web3 = require('web3');

contract('NftSwap', (accounts) => {
  it('should add nft and set price to 1 NFTC', async () => {
    const nftSwapInstance = await NftSwap.deployed();
    // adds nft address of 0x0000000000000000000000000000000000000000 with price of 1NFTC
    await nftSwapInstance.addNft.call("0x0000000000000000000000000000000000000000", Web3.utils.toWei('1', 'ether'));
    const price = await nftSwapInstance.getPrice("0x0000000000000000000000000000000000000000");
    assert.equal(price, 1, "price of nft was not 1NFTC");
  });
});
