App = {
	web3Provider: null,
	contracts: {},
	account: '0x0', 
	loading: false,
	tokensSold:0,
	tokenPrice:1000000000000000,	
	tokensAvilable : 750000,
	//ajtokenSaleInstance:'',
	init : function() {
		console.log('app started');
		return App.intiWeb3();
	},

	intiWeb3 : function() {
		if (typeof web3 !== 'undefined') {
			//console.log('web3  defined');
			// if there is already instance of web3 is present e.g. from metamask
			App.web3Provider = web3.currentProvider;
			//console.dir(web3.currentProvider);
			web3 = new Web3(web3.currentProvider);
		} else {
			// Specify default instance if no web3 instance is provided
			//console.log('web3 not defined')
			App.web3Provider = new Web3.providers.httpProvider('http://localhost:7545');
			web3 = new Web3(App.web3Provider);
		}

		return App.initContracts();

	},

	initContracts: function() {
		$.getJSON("AjTokenSale.json", function(ajtokensale) {
			App.contracts.AjTokenSale = TruffleContract(ajtokensale);
			App.contracts.AjTokenSale.setProvider(App.web3Provider);
			App.contracts.AjTokenSale.deployed().then(function(ajtokensale){
				//return ajtokensale.tokenPrice()
				//console.dir('dir is' + ajtokensale.tokenPrice());
				console.log('AJTOKEN sale address is ' + ajtokensale.address);
				//console.dir(ajtokensale);
			});	
		}).done(function() {
		  $.getJSON("AjToken.json", function(ajtoken) {
			App.contracts.AjToken = TruffleContract(ajtoken);
			App.contracts.AjToken.setProvider(App.web3Provider);
			App.contracts.AjToken.deployed().then(function(ajtoken){
				console.log('AJ token  address ' + ajtoken.address);
			});
			App.listenForEvents();
			return App.render();
		  });
		 });
		
	},
	listenForEvents : function() {
		App.contracts.AjTokenSale.deployed().then(function(instance) {
			instance.Sell({}, {
				fromBlock:0,
				toBlock:'latest'
			}).watch(function(err, eve) {
				console.log('event triggred', eve);
				App.render();
			})
		});
	},

	render: function() {
		if(App.loading) {
			return;
		}
		App.loading = true;

		var loader = $('#loader');
		var content = $('#content');

		loader.show();
		content.hide();

		// load account data
		//var accounts = web3.eth.getallAccounts
		
		web3.eth.getCoinbase(function(err, account) {
			if(account) {
				App.account = account;
				$('#accountAddress').html("Your account: " + account);
			} else {
				$('#accountAddress').html("Please login to MetaMask");
			}
		});
		

		//$('#accountAddress').html("Your account: " + accounts[0]);

		App.contracts.AjTokenSale.deployed().then(function(instance) {
			//var ajtokenSaleInstance;
			ajtokenSaleInstance = instance;
			//console.log(ajtokenSaleInstance);
			return ajtokenSaleInstance.tokenPrice();
		}).then(function(tokenPrice) {
			App.tokenPrice = tokenPrice.toNumber();
			//console.log('tokenPrice ' + tokenPrice.toNumber());
			$('.token-price').html(web3.fromWei(App.tokenPrice, 'ether'));
			return ajtokenSaleInstance.tokensSold();			
		}).then(function(tokensSold) {
			App.tokensSold = tokensSold.toNumber(); 
			//App.tokensSold = parseInt(tokensSold).toNumber(); 
			//App.tokensSold = 680000;
			$('.tokens-sold').html(App.tokensSold);
			$('.token-available').html(App.tokensAvilable);

			var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvilable)* 100;
			$('#progress').css('width', progressPercent+'%');

			// load token contract 

			App.contracts.AjToken.deployed().then(function(instance) {
				ajTokenInstance = instance;
				return ajTokenInstance.balanceOf(App.account);
			}).then(function(balance) {
				$('.ajtoken-balance').html(balance.toNumber());
				App.loading = false;
				loader.hide();
				content.show();
			})
		});

		//.done(function() {

			
		//});

	},

	buyTokens:  function() {
		$('#content').hide();
		$('#loader').show();

		var numberOfTokens = $('#numberOfTokens').val();
		console.log(numberOfTokens);
		App.contracts.AjTokenSale.deployed().then(function(instance) {
			
			return instance.buyTokens(numberOfTokens, {
				from: App.account, 
				value: numberOfTokens * App.tokenPrice,
				gas:500000
			});
		}).then(function(result) {
			console.log("Tokens bought..");
			$('form').trigger('reset');
			//wait for sell event

		});
	}
}


$(function() {
	$(window).load(function() {
		App.init();
	});
});