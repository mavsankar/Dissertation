// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Product {
        uint id;
        string name;
        address currentOwner;
        string location;
    }
    
    mapping(uint => Product) public products;
    uint public productCount = 0;
    
    event ProductAdded(uint id, string name, address owner, string location);
    event OwnershipTransferred(uint id, address from, address to, string location);
    
    function addProduct(string memory _name, string memory _location) public {
        productCount++;
        products[productCount] = Product(productCount, _name, msg.sender, _location);
        emit ProductAdded(productCount, _name, msg.sender, _location);
    }
    
    function transferOwnership(uint _id, address _newOwner, string memory _location) public {
        require(products[_id].currentOwner == msg.sender, "Only current owner can transfer ownership");
        address previousOwner = products[_id].currentOwner;
        products[_id].currentOwner = _newOwner;
        products[_id].location = _location;
        emit OwnershipTransferred(_id, previousOwner, _newOwner, _location);
    }
}
