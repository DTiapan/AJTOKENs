var AjToken = artifacts.require("./AjToken.sol");

module.exports = function(deployer) {
  deployer.deploy(AjToken,10000000);
};
