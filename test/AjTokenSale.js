var AjTokenSale = artifacts.require('./AjTokenSale.sol');
contract('AjTokenSale', function(accounts) {
	var tokenSaleInstance;
	var tokenPrice = 1000000000000000; //in wei, 0.001 ether
	it('Initializes the contract with the correct values', function() {
		return AjTokenSale.deployed().then(function(instance) {
			tokenSaleInstance = instance;
			return tokenSaleInstance
		}).then(function(address) {
			assert.notEqual(address,0x0, 'has contract address');
			return tokenSaleInstance.tokenContract();
		}).then(function(address) {
			//assert.equal(address, 0x0, 'Token contract has the address');
			assert.notEqual(address, 0x0, 'Token contract has the address');
			return tokenSaleInstance.tokenPrice();
		}).then(function(price) {
			assert.equal(price, tokenPrice, 'token price is correct');
		});
	});
});