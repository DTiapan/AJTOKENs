var AjTokenSale = artifacts.require('./AjTokenSale.sol');
var AjToken = artifacts.require('./AjToken.sol');

contract('AjTokenSale', function(accounts) {
	var tokenInstance;
	var tokenSaleInstance;
	var tokenPrice = 1000000000000000; //in wei, 0.001 ether
	var admin = accounts[0];
	var buyer = accounts[1];
	var tokensAvailable = 750000;
	var numberOfToken = 10;
	var value;
	it('Initializes the contract with the correct values', function() {
		return AjTokenSale.deployed().then(function(instance) {
			tokenSaleInstance = instance;
			return tokenSaleInstance.address
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

	it('facilitates token buying', function() {
			return AjToken.deployed().then(function(instance) {
			//first lets take the tokeninstace of AjToken
			tokenInstance = instance;
			//then return the tokeninstance for AjTokenSale	
			return AjTokenSale.deployed()		
		}).then(function(instance) {
			tokenSaleInstance = instance;
			// Provision 75% of total tokens to tokensale contract
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from : admin});			
		}).then(function(receipt) {				
			return tokenSaleInstance.buyTokens(numberOfToken, {from : buyer, value:numberOfToken * tokenPrice});
		}).then(function(receipt) {
		  assert.equal(receipt.logs.length, 1, 'triggers one event');
	      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
	      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
	      assert.equal(receipt.logs[0].args._amount, numberOfToken, 'logs the number of tokens purchased');
	      return tokenSaleInstance.tokensSold();
		}).then(function(amount) {
			assert.equal(amount.toNumber(), numberOfToken, 'increments the number of tokens sold');
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance) {	
			assert.equal(balance.toNumber(), tokensAvailable - numberOfToken);
			// Try to buy tokens less than the value
			return tokenSaleInstance.buyTokens(numberOfToken,{from : buyer, value:1});
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'msg.value must be equal to number of tokens in wei');
			return tokenSaleInstance.buyTokens(800000, {from : buyer, value:numberOfToken * tokenPrice});
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'can not purchase more token than avialable');
			
		});
	});


	it('Ends token sale', function() {
			return AjToken.deployed().then(function(instance) {
			//first lets take the tokeninstace of AjToken
			tokenInstance = instance;
			//then return the tokeninstance for AjTokenSale	
			return AjTokenSale.deployed()		
		}).then(function(instance) {
			tokenSaleInstance = instance;
			// Try to ed sale from account other than the admin
			return tokenSaleInstance.endSale({from : buyer});
			
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >=0, 'must be the admin of the sale');
			return tokenSaleInstance.endSale({from : admin});
		}).then(function(receipt) {
			return tokenInstance.balanceOf(admin);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 999990, 'returns the all unsold tokens to admin');			
			 // Check that the contract has no balance
	      balance = web3.eth.getBalance(tokenSaleInstance.address)
	      assert.equal(balance.toNumber(), 0);
		});

	});
});