pragma solidity ^0.4.25;

contract GivingTree {
    Branch[] public deployedBranches;
    Org[] public deployedOrgs;
    mapping(address => bool) public allowedOrgs;

    function createBranch(uint suggestedContribution, bytes32 name) public {
        Branch newBranch = new Branch(suggestedContribution, msg.sender, name);
        deployedBranches.push(newBranch);
    }

    function getDeployedBranches() public view returns (Branch[] memory) {
        return deployedBranches;
    }

    function createOrg(uint ein) public {
        Org newOrg = new Org(ein);
        deployedOrgs.push(newOrg);
        allowedOrgs[newOrg] = true;
    }

    function getDeployedOrgs() public view returns (Org[] memory) {
        return deployedOrgs;
    }

    function getAllowedOrgs(address)
        return allowedOrgs(address)
}

contract Branch {
    struct Grant {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint challengeCount;
        mapping(address => bool) challenges;
    }
    
    address public manager;
    uint public contribution;
    mapping(address => bool) public approvers;
    Grant[] public grants;
    uint public approversCount;
    bytes32 public branchName;


    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint suggestedContribution, address creator, bytes32 name) public {
        contribution = suggestedContribution;
        manager = creator;
        branchName = name;

    }

    function addAlllowedOrg(uint ein) public {

    }
    
    function contribute() public payable {
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createGrant(string memory description, uint value, address recipient) public restricted {
        Grant memory newGrant = Grant({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            challengeCount: 0
        });

        grants.push(newGrant);
    }

    function approveGrant(uint index) public {
        Grant storage grant = grants[index];

        require(approvers[msg.sender]);
        require(!grant.challenges[msg.sender]);

        grant.challenges[msg.sender] = true;
        grant.challengeCount++;
    }

    function finalizeGrant(uint index) public restricted {
        Grant storage grant = grants[index];

        require(grant.challengeCount < (approversCount/2));
        require(!grant.complete);

        grant.recipient.transfer(grant.value);
        grant.complete = true;
    }

    function getSummary() public view returns (bytes32, uint, uint, uint, address) {
        return (
            branchName,
            address(this).balance,
            grants.length,
            approversCount,
            manager
        );
    }

    function getGrantsCount() public view returns (uint) {
        return grants.length;
    }
}