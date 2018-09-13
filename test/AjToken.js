const AjToken = artifacts.require("./AjToken.sol");

contract('AjToken', function(accounts){

	it('sets the total supply upon development', function() {
		return AjToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1 million');
		});
		// body...
	});
})