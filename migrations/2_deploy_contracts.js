var AjToken = artifacts.require("./AjToken.sol");
var AjTokenSale = artifacts.require("./AjTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(AjToken,1000000).then(function() {
  	var tokenPrice = 1000000000000000;
  	return deployer.deploy(AjTokenSale, AjToken.address, tokenPrice);
  });
  
};
