// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FashionAuth is ERC721URIStorage, Ownable {

    uint256 private _tokenIds;

    constructor() ERC721("Item Authentication", "IAUTH") Ownable(msg.sender) {}

    function mint(address to, string memory metadataURI) public onlyOwner returns (uint256) {

        _tokenIds++;

        uint256 newTokenId = _tokenIds;

        _mint(to, newTokenId);

        _setTokenURI(newTokenId, metadataURI);

        return newTokenId;
    }
}