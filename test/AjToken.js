const AjToken = artifacts.require("./AjToken.sol");

contract('AjToken', function(accounts){
	var tokenInstance;

	it('Initalizes contract with correct values', function() {
		return AjToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name) {
			assert.equal(name, 'Aj Token', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol, 'AJ', 'has correct symbol');
			return tokenInstance.standard();
		}).then(function(standard) {
			assert.equal(standard, 'AJ Token V1.0 standard', 'has the correct standard')
		});
	})

	it('Allocates the inital supply upon development', function() {
		return AjToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1 million');
			return tokenInstance.balanceOf(accounts[0]);
			//return tokenInstance.balanceOf.call({from: accounts[0]});
		}).then(function(adminbalance) {
			assert.equal(adminbalance.toNumber(), 1000000, 'It allocates the inital supply to the admin account')
		});
	});

	it('Transfers token ownership', function() {
		return AjToken.deployed().then(function(instance){
			tokenInstance = instance;
			//Test `require` statement by transferring larger than the sender's balance
			return tokenInstance.transfer.call(accounts[1], 9999999999999999999);
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >=0, 'Error message must contain revert');
			return tokenInstance.transfer.call(accounts[1], 250000,{from : accounts[0]});
		}).then(function(success) {
			assert.equal(success, true, 'Should return true');
			return tokenInstance.transfer(accounts[1], 250000,{from : accounts[0]});		
		}).then(function(receipt) {			
			assert.equal(receipt.logs.length,1, 'triggers one event');
			assert.equal(receipt.logs[0].event,'Transfer', 'Should be the Transfer event');
			assert.equal(receipt.logs[0].args._from,accounts[0], 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to,accounts[1], 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(),750000, 'deducts the amount from the sending account' );
		});
	});

	
})