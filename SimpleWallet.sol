// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleWallet {
    address public owner;

    event Deposit(address indexed sender, uint amount);
    event Withdraw(address indexed reciver, uint amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function deposit() public payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint _amount) public onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(owner).transfer(_amount);
        emit Withdraw(owner, _amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}