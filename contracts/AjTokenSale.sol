pragma solidity ^0.4.2;

/**
 * The AjTokenSale contract does this and that...
 */
 import './AjToken.sol';

contract AjTokenSale {
	address admin;
	AjToken public tokenContract;
	uint256 public tokenPrice;

	function AjTokenSale(AjToken _tokenContract, uint256 _tokenPrice) public {
		//Assign an Admin
		admin = msg.sender;
		//Token contract
		tokenContract = _tokenContract;
		//Set the Token Price
		tokenPrice = _tokenPrice;

	}	
}

