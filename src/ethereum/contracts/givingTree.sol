pragma solidity ^0.4.25;

contract GivingTree {
    Branch[] public deployedBranches;

    function createBranch(uint suggestedContribution) public {
        Branch newBranch = new Branch(suggestedContribution, msg.sender);
        deployedBranches.push(newBranch);
    }

    function getDeployedBranches() public view returns (Branch[] memory) {
        return deployedBranches;
    }

}

contract AbstractOrgFactory {
    function getAllowedOrgs(address recipient) public view returns (bool);
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
    // bytes32 public branchName;
    


    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint suggestedContribution, address creator) public {
        contribution = suggestedContribution;
        manager = creator;
        // branchName = name;

    }

    function checkRecipient(address recipient) public view returns (bool) {
        AbstractOrgFactory x = AbstractOrgFactory ( 0x5173aF4f53D9c3dB1303c662624a2B50c2e4B5f1 );
    
        return x.getAllowedOrgs(recipient);

    }
    
    function contribute() public payable {
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createGrant(string memory description, uint value, address recipient) public restricted {
        require(!checkRecipient(recipient) == false);

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

    function getSummary() public view returns (uint, uint, uint, address) {
        return (
            // branchName,
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