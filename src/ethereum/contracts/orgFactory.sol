pragma solidity ^0.4.25;

contract OrgFactory {
    Org[] public deployedOrgs;
    mapping(address => bool) public allowedOrgs;

    function createOrg(uint ein) public {
        Org newOrg = new Org(ein);
        deployedOrgs.push(newOrg);
        allowedOrgs[newOrg] = true;
    }

    function getDeployedOrgs() public view returns (Org[] memory) {
        return deployedOrgs;
    }

    function getAllowedOrgs(address Org) public view returns (bool){
        return allowedOrgs[Org];
    }
}

contract Org {
    uint public taxId;
    
    constructor(uint ein) public {
        taxId = ein;
    }

}
