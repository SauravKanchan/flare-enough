// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

contract FdcVerificationMock {
    function verifyJsonApi(IWeb2Json.Proof calldata) external pure returns (bool) {
        return true;
    }
}
