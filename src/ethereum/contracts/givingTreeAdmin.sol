pragma solidity ^0.4.25;

contract GivingTreeAdmin {
    address public admin;

    constructor(address firstAdmin) public {
        admin = firstAdmin;
    } 

    function changeAdmin(address newAdmin) public {
        require (msg.sender == admin);
        admin = newAdmin;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }
}