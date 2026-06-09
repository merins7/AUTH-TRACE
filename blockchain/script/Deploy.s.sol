//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {AuthTrace} from "../src/AuthTrace.sol";

contract Deploy is Script{
    function run() external {
        vm.startBroadcast();
        AuthTrace authTrace = new AuthTrace();
        vm.stopBroadcast();
    }
}