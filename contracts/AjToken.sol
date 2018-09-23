pragma solidity ^0.4.2;

/**
 * The AjToken contract does this and that...
 */
contract AjToken {
	//Name
	string public name = "Aj Token";
	//Symbol
	string public symbol = "AJ";
	string public standard = "AJ Token V1.0 standard";
	mapping (address => uint256) public balanceOf;
	mapping (address => mapping (address => uint)) public allowance;
	
	
	uint256 public totalSupply;

	// Transfer event
	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	// Aprove event
	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);
	
	
	//constructor
	function AjToken (uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply; 
		totalSupply = _initialSupply;
	}	
    
  	//transfer function

	function transfer (address _to, uint256 _value) public returns(bool success) {
		require (balanceOf[msg.sender] >= _value);		
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		// call event
		Transfer(msg.sender, _to, _value);
		return true;
 	}
	
	// Delegated Transfer

	//approve
	function approve (address _spender, uint256 _value) public returns(bool success) {
		allowance[msg.sender][_spender] = _value;
		Approval(msg.sender, _spender, _value);
		return true;
	}
	
	//transferFrom
	function transferFrom (address _from, address _to, uint256 _value) public returns(bool success) {
		//Require _from has enough tokens, that is sender is having enough tokens		
		require (_value <= balanceOf[_from]);		
		// Require allowance is big enough , that is limit is available
		require (_value <= allowance[_from][msg.sender]);
		//change the balance > after transferring change the balance of receving and sending parties
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		//call transfer event 
		Transfer(_from, _to, _value);
		//finally, return boolean

		return true;
	}
	
	//allowance 




}




