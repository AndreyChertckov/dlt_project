// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

enum State {Created, Accepted, Declined, Expired}

contract Patent {
    address public owner;
    string public applicantsName;
    string public inventor;
    string public agentName;
    State public state;
    string public registrationAddress;
    string public title;
    string public link;
    string public country;
    uint public patentNumber;
    uint public decisionNumber;
    uint public decisionDate;
    uint public lawNumber;
    uint public internationalCassificationNumber;
    string public responsiblePerson;
    
    event SavePatent(address contractAddress, address by);
    event UpdatePatent(address by);
    
    constructor(address _owner, string memory _inventor, string memory _applicantsName, string memory _agentName, string memory _registrationAddress, string memory _title, string memory _link, string memory _country) { 
        owner = _owner;
        inventor = _inventor;
        applicantsName = _applicantsName;
        agentName = _agentName;
        registrationAddress = _registrationAddress;
        title = _title;
        link = _link;
        country = _country;
        state = State.Created;
        emit SavePatent(address(this), _owner);
    }
    
    function acceptPatent(uint _decisionNumber, uint _decisionDate, string memory _responsiblePerson, uint _patentNumber, uint _lawNumber, uint _internationalClassificationNumber) public {
        require(msg.sender == owner);
        state = State.Accepted;
        patentNumber = _patentNumber;
        decisionNumber = _decisionNumber;
        decisionDate = _decisionDate;
        responsiblePerson = _responsiblePerson;
        lawNumber = _lawNumber;
        internationalCassificationNumber = _internationalClassificationNumber;
        emit UpdatePatent(msg.sender);
    }
    
    function declinePatent(uint _decisionNumber, uint _decisionDate, string memory _responsiblePerson) public {
        require(msg.sender == owner);
        decisionNumber = _decisionNumber;
        decisionDate = _decisionDate;
        responsiblePerson = _responsiblePerson;
        emit UpdatePatent(msg.sender);
    }
    
    function setExpired() public {
        require(msg.sender == owner);
        require(state == State.Accepted);
        state = State.Expired;
        emit UpdatePatent(msg.sender);
    }
    
    function transferOwnership(address to) public {
        require(msg.sender == owner);
        owner = to;
    }
}
