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
        AbstractAdmin x = AbstractAdmin ( 0x5173aF4f53D9c3dB1303c662624a2B50c2e4B5f1 );
    
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
