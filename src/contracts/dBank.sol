// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {

  //assign Token contract to variable
  Token private token; 

  //add mappings to store balances 
  mapping(address => uint) public etherBalanceOf; 
  //keep track of time when eth was deposited for start of apy rates calculations
  mapping (address => uint ) public depositStart;
  //keep track of what is being deposited by user
  mapping (address => bool) public isDeposited; 

  //add events for the isDeposited when user deposits eth and withdraw
  event Deposit(address indexed user, uint etherAmount, uint timeStart); 
  event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);

  //pass as constructor argument deployed Token contract
  constructor(Token _token) public {
    //assign token deployed contract to variable
    token = _token;
  }

  function deposit() payable public {
    //check if msg.sender didn't already deposited funds
    
    require(isDeposited[msg.sender] == false, "Error: deposit already active");
    //check if msg.value is >= than 0.01 ETH
    require(msg.value >= 1e16, "Error: desposit must be >= 0.01 Eth");

    //increase msg.sender ether deposit balance
    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value; //we are adding the eth and assigning it to etherBalancOf[msg.sender]
    //start msg.sender hodling time

    //set msg.sender deposit status to true to keep track of what they are depositing which we used mapping
    isDeposited[msg.sender] = true; 

    //emit Deposit event
    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  function withdraw() public {
    //check if msg.sender deposit status is true
    require(isDeposited[msg.sender] == true, "Error: no previous deposit");

    //assign msg.sender ether deposit balance to variable for event--cash their deposits 
    uint userBalance = etherBalanceOf[msg.sender];

    //check user's hold time--length of eth held for apy
    uint depositTime = block.timestamp - depositStart[msg.sender]; 

    //calc interest per second
    //calc accrued interest
    uint interestPerSecond = 31668017 * (etherBalanceOf[msg.sender] / 1e16);
    uint interest = interestPerSecond * depositTime;
    //31668017 - interest(10% apy) per second for min deposit of 0.01 eth 
    //1e16(10% of 0.01 eth) /31577600(seconds in 365.25 days)

    //send eth to user when withdrawing we use the ethereum global transfer function 
    msg.sender.transfer(userBalance); 

    //send interest in tokens to user
    token.mint(msg.sender, interest);

    //reset depositer data to 0 since we just withdrew it.
    etherBalanceOf[msg.sender] = 0;
    etherBalanceOf[msg.sender] = 0; 
    isDeposited[msg.sender] = false;  

    //emit withdraw event 
    emit Withdraw(msg.sender, userBalance, depositTime, interest);
  }

  function borrow() payable public {
    //check if collateral is >= than 0.01 ETH
    //check if user doesn't have active loan

    //add msg.value to ether collateral

    //calc tokens amount to mint, 50% of msg.value

    //mint&send tokens to user

    //activate borrower's loan status

    //emit event
  }

  function payOff() public {
    //check if loan is active
    //transfer tokens from user back to the contract

    //calc fee

    //send user's collateral minus fee

    //reset borrower's data

    //emit event
  }
}