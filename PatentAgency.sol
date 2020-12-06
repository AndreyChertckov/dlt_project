// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

enum State {Created, Accepted, Declined, Expired}

contract PatentAgency {
    struct Patent {
        address owner;
        string applicantsName;
        string inventor;
        string agentName;
        State state;
        string registrationAddress;
        string title;
        string link;
        string country;
        uint patentNumber;
        uint decisionNumber;
        uint decisionDate;
        uint lawNumber;
        uint internationalCassificationNumber;
        string responsiblePerson;
    }
    
    event CreatePatent(uint uid, address by);
    event UpdatePatent(uint uid, address by);
    
    mapping (uint => Patent) patents;
    
    function createPatent(address _owner, string memory _inventor, string memory _applicantsName, string memory _agentName, string memory _registrationAddress, string memory _title, string memory _link, string memory _country) public returns (uint uid){
        uid = uint(keccak256(abi.encodePacked(msg.sender, block.number, block.timestamp)));
        Patent memory patent = patents[uid];
        patent.owner = _owner;
        patent.inventor = _inventor;
        patent.applicantsName = _applicantsName;
        patent.agentName = _agentName;
        patent.registrationAddress = _registrationAddress;
        patent.title = _title;
        patent.link = _link;
        patent.country = _country;
        patent.state = State.Created;
        emit CreatePatent(uid, _owner);
    }
    
    function acceptPatent(uint uid, uint _decisionNumber, uint _decisionDate, string memory _responsiblePerson, uint _patentNumber, uint _lawNumber, uint _internationalClassificationNumber) public {
        Patent memory patent = patents[uid];
        require(msg.sender == patent.owner);
        patent.state = State.Accepted;
        patent.patentNumber = _patentNumber;
        patent.decisionNumber = _decisionNumber;
        patent.decisionDate = _decisionDate;
        patent.responsiblePerson = _responsiblePerson;
        patent.lawNumber = _lawNumber;
        patent.internationalCassificationNumber = _internationalClassificationNumber;
        emit UpdatePatent(uid, patent.owner);
    }
    
    function declinePatent(uint uid, uint _decisionNumber, uint _decisionDate, string memory _responsiblePerson) public {
        Patent memory patent = patents[uid];
        require(msg.sender == patent.owner);
        patent.decisionNumber = _decisionNumber;
        patent.decisionDate = _decisionDate;
        patent.responsiblePerson = _responsiblePerson;
        emit UpdatePatent(uid, patent.owner);
    }
    
    function setExpired(uint uid) public {
        Patent memory patent = patents[uid];
        require(msg.sender == patent.owner);
        require(patent.state == State.Accepted);
        patent.state = State.Expired;
        emit UpdatePatent(uid, patent.owner);
    }
    
    function transferOwnership(uint uid, address to) public {
        Patent memory patent = patents[uid];
        require(msg.sender == patent.owner);
        patent.owner = to;
        emit UpdatePatent(uid, msg.sender);
    }
}
