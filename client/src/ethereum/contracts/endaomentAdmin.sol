/*
ENDAOMENT V0.1 ADMIN CONTRACT: 
    EndaomentAdmin acts as a admin user state gatekeeper for the FundFactory, Fund, OrgFactory and Org Contracts. 
    On deployment, the admin is set by the deployer. Once set, only the admin can change the admin role. 

*/

pragma solidity ^0.4.25;

contract EndaomentAdmin {
    // ========== STATE VARIABLES ==========

    address public admin;
    

    // ========== CONSTRUCTOR ==========
    
    /**
    * @notice  You're creating a new EndaomentAdmin contract.
    * @param  firstAdmin The address of the admin.
    */
    constructor(address firstAdmin) public {
        admin = firstAdmin;
    } 


    // ========== Admin Management ==========
    
    /**
    * @notice Changes the admin. 
    * @param  newAdmin The address of the new admin.
    */
    function changeAdmin(address newAdmin) public {
        require (msg.sender == admin);
        admin = newAdmin;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }
}