// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  //add minter variable
  address public minter; 

  // add minter changed event
  event MinterChange(address indexed from, address to);

  constructor() public payable ERC20("Decentralized Bank Currency", "DCB") {
    //asign initial minter
    minter = msg.sender; 
  }

  //Add pass minter role function to the bank 
  function passMinterRole(address dBank) public returns (bool) {
    require(msg.sender == minter, "Error: only the owner can change pass minter role" );
    minter = dBank;

    emit MinterChange(msg.sender, dBank);
    return true; 
  }


  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter, "Error, msg.sender doesn not have minter role" );
		_mint(account, amount);
	}
}