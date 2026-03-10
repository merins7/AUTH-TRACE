//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {FashionAuth} from "../src/FashionAuth.sol";

contract Deploy is Script{
    function run() external {
        vm.startBroadcast();
        FashionAuth fashionAuth = new FashionAuth();
        vm.stopBroadcast();
    }
}