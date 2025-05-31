// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract MockVerification {
    function verifyJsonApi(
        bytes calldata
    ) external pure returns (bool) {
        return true;
    }
}