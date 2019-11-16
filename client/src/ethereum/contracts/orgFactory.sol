pragma solidity ^0.4.25;

contract OrgFactory {
    Org[] public deployedOrgs;
    mapping(address => bool) public allowedOrgs;
    event orgCreated(address newAddress);

    function createOrg(uint ein) public {
        Org newOrg = new Org(ein);
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

contract AbstractAdmin {
    function getAdmin() public view returns (address);
}


contract ERC20 {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
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
        AbstractAdmin x = AbstractAdmin ( 0xFB4536335Bd7Ee65EE7Bb4EF9aaAFa689c3C2606 );

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

    function cashOutOrg(address desiredWithdrawlAddress, address tokenAddress) public {
        require (msg.sender == orgWallet);
        ERC20 t = ERC20(tokenAddress);
        uint bal = t.balanceOf(address(this));

        t.transfer(desiredWithdrawlAddress, bal);

    }

    function setOrgWallet(address providedWallet) public {
        require (msg.sender == checkAdmin());

        orgWallet = providedWallet;

    }

     function getTokenBalance(address tokenAddress) public view returns (uint) {
            ERC20 t = ERC20(tokenAddress);
            uint bal = t.balanceOf(address(this));

        return bal;
     }

}