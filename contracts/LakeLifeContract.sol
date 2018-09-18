pragma solidity ^0.4.17;

contract Owned {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}

contract LakeLifeContract is Owned {

    struct LakeRecord {
        uint256 lakeAreaSqrFt;
        uint256 lakeCapacity;
        uint256 lakeDepth;
        bool isLakeRecord;
    }

    uint numLakeRecord;

    mapping (uint => LakeRecord) public lakeRecord;

    function isLakeRecordExisting(uint lakeID) public constant returns(bool isIndeed) {
        return lakeRecord[lakeID].isLakeRecord;
    }

    function newLakeRecord(uint lakeID, uint256 lakeAreaSqrFt, uint256 lakeCapacity, uint256 lakeDepth) public returns(bool success) {
        require(!isLakeRecordExisting(lakeID));
        numLakeRecord++;
        lakeRecord[lakeID].lakeAreaSqrFt = lakeAreaSqrFt;
        lakeRecord[lakeID].lakeCapacity = lakeCapacity;
        lakeRecord[lakeID].lakeDepth = lakeDepth;
        lakeRecord[lakeID].isLakeRecord = true;
        return true;
    }

    function deleteLakeRecord(uint lakeID) public onlyOwner returns(bool success) {
        numLakeRecord--;
        lakeRecord[lakeID].isLakeRecord = true;
        return true;
    }

    function updateEntity(uint lakeID,uint256 lakeAreaSqrFt, uint256 lakeCapacity, uint256 lakeDepth) public onlyOwner returns(bool success) {
        require(isLakeRecordExisting(lakeID));
        lakeRecord[lakeID].lakeAreaSqrFt = lakeAreaSqrFt;
        lakeRecord[lakeID].lakeCapacity = lakeCapacity;
        lakeRecord[lakeID].lakeDepth = lakeDepth;
        return true;
    }

    function getLakeRecord(uint lakeID) public constant returns(uint256, uint256, uint256) {
        return(lakeRecord[lakeID].lakeAreaSqrFt, lakeRecord[lakeID].lakeCapacity, lakeRecord[lakeID].lakeDepth);
    }

    function getLakeRecordNum() public constant returns(uint) {
        return numLakeRecord;
    }

    function killContract() public onlyOwner{
        selfdestruct(owner);
    }
}
