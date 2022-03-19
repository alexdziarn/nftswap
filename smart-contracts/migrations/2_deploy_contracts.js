// const Delegated = artifacts.require("Delegated");
const NftSwap = artifacts.require("NftSwap");
const ERC721PresetMinterPauserAutoId = artifacts.require("ERC721PresetMinterPauserAutoId");

module.exports = async function(deployer) {
  deployer.deploy(NftSwap);
  // below is a temp contract used for testing
  deployer.deploy(ERC721PresetMinterPauserAutoId, "My NFT","NFT", "https://my-json-server.typicode.com/abcoathup/samplenft/tokens/");
};
