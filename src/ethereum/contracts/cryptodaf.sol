pragma solidity ^0.4.25;

contract DAFfactory {
    DAF[] public deployedDAFs;

    function createDAF(uint minimum, string memory name) public {
        DAF newDAF = new DAF(minimum, msg.sender, name);
        deployedDAFs.push(newDAF);
    }

    function getDeployedDAFs() public view returns (DAF[] memory) {
        return deployedDAFs;
    }


//     function createA501c3(string memory name, string memory taxId) public {
//         A501c3 newA501c3 = new A501c3(name, taxId);
//         deployed501c3s.push(new501c3);
//     }

//     function getDeployed501c3s() public view returns (A501c3[] memory) {
//         return deployed501c3s;
//     }

}

// contract A501c3 {}
    

contract DAF {
    struct Grant {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    Grant[] public grants;
    uint public approversCount;
    string public dafName;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimum, address creator, string memory name) public {
        manager = creator;
        minimumContribution = minimum;
        dafName = name;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution); 
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createGrant(string memory description, uint value, address recipient) public restricted {
        Grant memory newGrant = Grant({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        grants.push(newGrant);
    }

    function approveGrant(uint index) public {
        Grant storage grant = grants[index];

        require(approvers[msg.sender]);
        require(!grant.approvals[msg.sender]);

        grant.approvals[msg.sender] = true;
        grant.approvalCount++;
    }

    function finalizeGrant(uint index) public restricted {
        Grant storage grant = grants[index];

        require(grant.approvalCount > (approversCount/2));
        require(!grant.complete);

        grant.recipient.transfer(grant.value);
        grant.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
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