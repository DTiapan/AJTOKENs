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
	uint256 public totalSupply;

	// Transfer event
	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
		);
	
	
	//constructor
	function AjToken (uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply; 
		totalSupply = _initialSupply;
	}	
    
    
	/*constructor (uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply; 
		totalSupply = _initialSupply;
		//allocate the totalSupply
	}	*/

	//transfer

	function transfer (address _to, uint256 _value) public returns(bool success) {
		require (balanceOf[msg.sender] >= _value);		
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		// call event
		Transfer(msg.sender, _to, _value);
		return true;
 	}
	

}




