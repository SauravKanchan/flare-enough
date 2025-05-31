// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

struct EventData {
    string name;
    bool eventHappened;
}

struct DataTransportObject {
    uint256 eventId;
    string name;
    bool eventHappened;
}

contract FlareEnough {
    mapping(uint256 => EventData) public events;

    function addEvent(IWeb2Json.Proof calldata data) public {
        require(isJsonApiProofValid(data), "Invalid proof");

        DataTransportObject memory dto = abi.decode(
            data.data.responseBody.abiEncodedData,
            (DataTransportObject)
        );

        // require(events[dto.eventId].name == "", "Character already exists");

        EventData memory ed = EventData({
            name: dto.name,
            eventHappened: dto.eventHappened
        });

        events[dto.eventId] = ed;
    }

    function abiSignatureHack(DataTransportObject calldata dto) public pure {}

    function isJsonApiProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        // Inline the check for now until we have an official contract deployed
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }
}