// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract MockContractRegistry {
    address public verification;

    constructor(address _verification) {
        verification = _verification;
    }

    function getFdcVerification() external view returns (address) {
        return verification;
    }
}
