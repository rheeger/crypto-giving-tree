pragma solidity ^0.4.25;

contract AbstractOrgFactory {
    function getAllowedOrgs(address recipient) public view returns (bool);
}

contract AbstractAdmin {
    function getAdmin() public view returns (address);
}

contract TreeNursery {
    Tree[] public plantedTrees;
    address public admin;
    event treePlanted(address newAddress);

    constructor() public {
        admin = checkAdmin();
    }

    function checkAdmin() public view returns (address) {
        AbstractAdmin x = AbstractAdmin ( 0xfb4536335bd7ee65ee7bb4ef9aaafa689c3c2606 );
    
        return x.getAdmin();
    }
    
    modifier adminRestricted() {
        require(msg.sender == admin);
        _;
    }

    function plantTree(address managerAddress) public adminRestricted {
        Tree newTree = new Tree(managerAddress);
        plantedTrees.push(newTree);
        emit treePlanted(newTree);
    }

    function getPlantedTrees() public view returns (Tree[] memory) {
        return plantedTrees;
    }

}

contract Tree {
    struct Grant {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint challengeCount;
        mapping(address => bool) challenges;
    }
    
    address public manager;
    address public admin;
    uint public contributionThreshold;
    mapping(address => bool) public approvers;
    mapping(address => bool) public contributors;
    Grant[] public grants;
    uint public approversCount;
    uint public totalContributors;
    // bytes32 public branchName;
    


    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    modifier adminRestricted() {
        require(msg.sender == admin);
        _;
    }
    
    constructor(address creator) public {
        manager = creator;
        admin = 0x5173aF4f53D9c3dB1303c662624a2B50c2e4B5f1;
        contributionThreshold = 0;
        // branchName = name;

    }

    function checkRecipient(address recipient) public view returns (bool) {
        AbstractOrgFactory x = AbstractOrgFactory ( 0x5173aF4f53D9c3dB1303c662624a2B50c2e4B5f1 );
    
        return x.getAllowedOrgs(recipient);

    }
    
    function contribute() public payable {
        if (msg.value > contributionThreshold && !approvers[msg.sender] == true) {
        approvers[msg.sender] = true;
        approversCount++;
        }

    }

    function setContributionThreshold(uint suggestedContribution) public restricted {
        contributionThreshold = suggestedContribution;
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

    function finalizeGrant(uint index) public adminRestricted {
        Grant storage grant = grants[index];

        require(grant.challengeCount < (approversCount/2));
        require(!grant.complete);

        grant.recipient.transfer(grant.value);
        grant.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, address, uint) {
        return (
            // branchName,
            address(this).balance,
            grants.length,
            approversCount,
            manager,
            contributionThreshold

        );
    }

    function getGrantsCount() public view returns (uint) {
        return grants.length;
    }
}