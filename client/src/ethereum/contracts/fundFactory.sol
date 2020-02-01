/*
ENDAOMENT V0.1 DONOR-ADVISED FUND CONTRACTS: 
    FundFactory contract creates Donor-Advised Funds at the direction of the admin returned from EndaomentAdmin contract. 

    Fund contract allows Fund.manager to issue Grants to the contract. Those Grants may only be issued to addresses created by the orgFactory contract, under the control of EndaomentAdmin.admin. 

    EndaomentAdmin.admin is the sole verifier of any proposed grants and is only account that may trigger tranfers out of the Fund. 
*/

pragma solidity ^0.4.25;


// INTERFACES
contract AbstractOrgFactory {
    function getAllowedOrgs(address recipient) public view returns (bool);
}

contract AbstractAdmin {
    function getAdmin() public view returns (address);
}

contract ERC20 {
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function transfer(address to, uint tokens) public returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
}


// FUND FACTORY 
contract FundFactory {
    // ========== STATE VARIABLES ==========
    
    Fund[] public createdFunds;
    address public admin;
    event fundCreated(address newAddress);
    

    // ========== CONSTRUCTOR ==========    

    /**
    * @notice  Create new Fund Factory
    */
    constructor() public {
        admin = checkAdmin();
    }


    // ========== Admin Management ==========
    
    function checkAdmin() public view returns (address) {
        AbstractAdmin x = AbstractAdmin ( 0x0A0EEF5dDCcdf1f912E6d12118280984500fFAa9 );
    
        return x.getAdmin();
    }
    
    modifier adminRestricted() {
        require(msg.sender == checkAdmin());
        _;
    }


    // ========== Fund Creation & Management ==========

    /**
    * @notice  Create new Fund
    * @param managerAddress The address of the Fund's Primary Advisor
    */
    function createFund(address managerAddress) public adminRestricted {
        Fund newFund = new Fund(managerAddress);
        createdFunds.push(newFund);
        emit fundCreated(newFund);
    }

    function countFunds() public view returns (uint) {
        return createdFunds.length;
    }

    function getFund(uint index) public view returns (address) {
        return createdFunds[index-1]; 
    }

}



// FUND CONTRACT
contract Fund {

    // ========== STATE VARIABLES ==========
    
    struct Grant {
        string description;
        uint value;
        address recipient;
        bool complete;
    }
    
    address public manager;
    address public admin;
    mapping(address => bool) public contributors;
    Grant[] public grants;
    uint public totalContributors;


    // ========== CONSTRUCTOR ==========    
    
    /**
    * @notice Create new Fund
    * @param creator Address of the Fund's Primary Advisor
    */
    constructor(address creator) public {
        manager = creator;
        admin = checkAdmin();

    }
    

    // ========== Admin Management ==========
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    modifier adminRestricted() {
        require(msg.sender == checkAdmin());
        _;
    }
     
    function checkAdmin() public view returns (address) {
        AbstractAdmin x = AbstractAdmin ( 0x0A0EEF5dDCcdf1f912E6d12118280984500fFAa9 );
    
        return x.getAdmin();
    }


    // ========== Fund Management & Info ==========
    
    /**
     * @notice Change Fund Primary Advisor
     * @param  newManager The address of the new PrimaryAdvisor.
     */
    function changeManager (address newManager) public adminRestricted {
        manager = newManager;

    }

    function checkRecipient(address recipient) public view returns (bool) {
        AbstractOrgFactory x = AbstractOrgFactory ( 0x095a27Ccc6B34c5EB4C8fF7951826338c42d5Cb5 );
    
        return x.getAllowedOrgs(recipient);

    }

     function getSummary(address tokenAddress) public view returns (uint, uint, uint, address) {
            ERC20 t = ERC20(tokenAddress);
            uint bal = t.balanceOf(address(this));

        return (
            bal,
            address(this).balance,
            grants.length,
            manager
        );
    }
    
    /**
     * @notice Create new Grant Reccomendation
     * @param  description The address of the Owner.
     */
    function createGrant(string memory description, uint value, address recipient) public restricted {
        require(checkRecipient(recipient) == true);

        Grant memory newGrant = Grant({
            description: description,
            value: value,
            recipient: recipient,
            complete: false
        });

        grants.push(newGrant);
    }

    /**
     * @notice Approve Grant Reccomendation
     * @param  index This Grant's index position
     * @param  tokenAddress The stablecoin's token address. 
     */
    function finalizeGrant(uint index, address tokenAddress) public adminRestricted {
        require(grant.complete == false);
        admin = checkAdmin();
        ERC20 t = ERC20(tokenAddress);
        
        Grant storage grant = grants[index];

        // //donation based fees
        // uint fee = (grant.value)/100;
        // uint finalGrant = (grant.value * 99)/100;
        // t.transfer(admin, fee);
        
        t.transfer(grant.recipient, grant.value);

        grant.complete = true;
    }


    function getGrantsCount() public view returns (uint) {
        return grants.length;
    }
}