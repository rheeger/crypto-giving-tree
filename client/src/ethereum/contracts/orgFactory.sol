/*
ENDAOMENT V0.1 ORGANIZATION CONTRACTS: 
    OrgFactory contract creates new Org contracts at the direction of the admin returned from EndaomentAdmin contract. 

    Org contract allows any user to issue a Claim to the contract. Those Claims may only be approved by the EndaomentAdmin.admin. 

    EndaomentAdmin.admin is the sole account that may trigger tranfers out of the Org to the Org.orgWallet submitted in a previously approved claim. 
*/

pragma solidity ^0.4.25;


// INTERFACES
contract AbstractAdmin {
    function getAdmin() public view returns (address);
}

contract ERC20 {
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function transfer(address to, uint tokens) public returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
}


//ORG FACTORY CONTRACT
contract OrgFactory {
    
    // ========== STATE VARIABLES==========

    Org[] public deployedOrgs;
    mapping(address => bool) public allowedOrgs;
    event orgCreated(address newAddress);


    // ========== CONSTRUCTOR ==========    
    
    /**
    * @notice Create new Org Factory
    * @param adminContractAddress Address of EndaomentAdmin contract. 
    */
    constructor(address adminContractAddress) public {
        require (msg.sender == checkAdmin(adminContractAddress));
        
    }
    

    // ========== Admin Management ==========
    
    function checkAdmin(address adminContractAddress) public view returns (address) {
        AbstractAdmin x = AbstractAdmin ( adminContractAddress );
    
        return x.getAdmin();
    }


    // ========== Org Creation & Management ==========

    /**
    * @notice  Create new Org Contract
    * @param ein The U.S. Tax Identification Number for the Organization
    * @param adminContractAddress Contract address for Endaoment Admin
    */
    function createOrg(uint ein, address adminContractAddress) public {
        require(msg.sender == checkAdmin(adminContractAddress));
        Org newOrg = new Org(ein, adminContractAddress);
        deployedOrgs.push(newOrg);
        allowedOrgs[newOrg] = true;
        emit orgCreated(newOrg);
    }

    function countDeployedOrgs() public view returns (uint) {
        return deployedOrgs.length;
    }

    function getDeployedOrg(uint index) public view returns (address) {
        return deployedOrgs[index-1];
    }

    function getAllowedOrgs(address Org) public view returns (bool){
        return allowedOrgs[Org];
    }
}


//ORG CONTRACT
contract Org {

    // ========== STATE VARIABLES ==========
    
    struct Claim {
        string firstName;
        string lastName;
        string eMail;
        address desiredWallet;
        bool filesSubmitted;
    }

    uint public taxId;
    address public orgWallet;
    Claim[] public claims;
    event cashOutComplete(uint cashOutAmount);


    // ========== CONSTRUCTOR ==========    
    
    /**
    * @notice Create new Organization Contract
    * @param ein The U.S. Tax Identification Number for the Organization
    * @param adminContractAddress Contract Address for Endaoment Admin
    */
    constructor(uint ein, address adminContractAddress) public {
        taxId = ein;
        orgWallet = checkAdmin(adminContractAddress);
    }


    // ========== Admin Management ==========
    
    function checkAdmin(address adminContractAddress) public view returns (address) {
        AbstractAdmin x = AbstractAdmin ( adminContractAddress );

        return x.getAdmin();
    }


    // ========== Org Management & Info ==========
    
    /**
     * @notice Create Organization Claim
     * @param  fName First name of Administrator
     * @param  lName Last name of Administrator
     * @param  fSub Information Submitted successfully.
     * @param  eMail Email contact for Organization Administrator.
     * @param  orgAdminAddress Wallet address of Organization's Administrator.
     */
    function claimRequest(string memory fName, string memory lName, bool fSub, string eMail, address orgAdminAddress) public {
        require (fSub == true);
        require (msg.sender == orgAdminAddress);
        
        Claim memory newClaim = Claim({
            firstName: fName,
            lastName: lName,
            eMail: eMail,
            desiredWallet: msg.sender,
            filesSubmitted: true
        });

        claims.push(newClaim);
    }

    /**
     * @notice Approving Organization Claim 
     * @param  index Index value of Claim.
     * @param adminContractAddress Contract Address for Endaoment Admin
     */
    function approveClaim(uint index, address adminContractAddress) public {
        require (msg.sender == checkAdmin(adminContractAddress));

        Claim storage claim = claims[index]; 
        
        setOrgWallet(claim.desiredWallet, adminContractAddress);
    }

    /**
     * @notice Cashing out Organization Contract 
     * @param  desiredWithdrawlAddress Destination for withdrawl
     * @param tokenAddress Stablecoin address of desired token withdrawl
     * @param adminContractAddress Contract Address for Endaoment Admin
     */
    function cashOutOrg(address desiredWithdrawlAddress, address tokenAddress, address adminContractAddress) public {
        require (msg.sender == checkAdmin(adminContractAddress));
        ERC20 t = ERC20(tokenAddress);
        uint cashOutAmount = t.balanceOf(address(this));

        t.transfer(desiredWithdrawlAddress, cashOutAmount);
        emit cashOutComplete(cashOutAmount);
    }

    function setOrgWallet(address providedWallet, address adminContractAddress) public {
        require (msg.sender == checkAdmin(adminContractAddress));

        orgWallet = providedWallet;
    }

     function getTokenBalance(address tokenAddress) public view returns (uint) {
            ERC20 t = ERC20(tokenAddress);
            uint bal = t.balanceOf(address(this));

        return bal;
     }

       function getClaimsCount() public view returns (uint) {
        return claims.length;
    }

}