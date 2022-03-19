// const Delegated = artifacts.require("Delegated");
const NftSwap = artifacts.require("NftSwap");
const NftSwapCredit = artifacts.require("NNftSwapCredit");

module.exports = function(deployer) {
  deployer.deploy(NftSwapCredit).then(() => {
    // deployer.deploy(Delegated);
    deployer.deploy(NftSwap, NftSwapCredit.address);
  });

};
