pragma solidity ^0.4.25;

contract OrgFactory {
    Org[] public deployedOrgs;
    mapping(address => bool) public allowedOrgs;

    function createOrg(uint ein) public returns (address){
        Org newOrg = new Org(ein);
        deployedOrgs.push(newOrg);
        allowedOrgs[newOrg] = true;
        return newOrg;
    }

    function getDeployedOrgs() public view returns (Org[] memory) {
        return deployedOrgs;
    }

    function getAllowedOrgs(address Org) public view returns (bool){
        return allowedOrgs[Org];
    }
}

contract AbstractAdmin {
    function getAdmin() public view returns (address);
}

contract Org {
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

    function checkAdmin() public view returns (address) {
        AbstractAdmin x = AbstractAdmin ( 0xfb4536335bd7ee65ee7bb4ef9aaafa689c3c2606 );
    
        return x.getAdmin();
    }
    
    constructor(uint ein) public {
        taxId = ein;
    }

    function claimRequest(string memory fName, string memory lName, bool fSub, string eMail) public {
        require (fSub == true);
        
        Claim memory newClaim = Claim({
            firstName: fName,
            lastName: lName,
            eMail: eMail,
            desiredWallet: msg.sender,
            filesSubmitted: true
        });

        claims.push(newClaim);
    }

    function approveClaim(uint index) public {
        require (msg.sender == checkAdmin());

        Claim storage claim = claims[index]; 
        
        setOrgWallet(claim.desiredWallet);

    }

    function cashOutOrg(address desiredWithdrawlAddress) public {
        require (msg.sender == orgWallet);

        desiredWithdrawlAddress.transfer(address(this).balance);

    }

    function setOrgWallet(address providedWallet) public {
        require (msg.sender == checkAdmin());

        orgWallet = providedWallet;

    }

}
