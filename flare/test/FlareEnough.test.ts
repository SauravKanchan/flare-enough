import { expect } from "chai";
import { ethers } from "hardhat";

describe("FlareEnough", function () {
  let flareEnough: any;
  let mockFdcVerification: any;
  let mockRegistry: any;

  beforeEach(async () => {
    const [deployer] = await ethers.getSigners();

    const FdcVerificationMock = await ethers.getContractFactory("FdcVerificationMock");
    mockFdcVerification = await FdcVerificationMock.deploy();

    const ContractRegistryMock = await ethers.getContractFactory("ContractRegistryMock");
    mockRegistry = await ContractRegistryMock.deploy(mockFdcVerification.target);

    const FlareEnough = await ethers.getContractFactory("FlareEnough");
    flareEnough = await FlareEnough.deploy();
  });

  it("should add a new event with valid proof", async () => {
    const coder = ethers.AbiCoder.defaultAbiCoder();

    const dto = {
      eventId: 1,
      name: "Trump Wins",
      eventHappened: true,
    };

    const encodedDTO = coder.encode(
      ["tuple(uint256 eventId, string name, bool eventHappened)"],
      [dto]
    );

    const mockProof = {
      merkleProof: [], // Empty for mock
      data: {
        attestationType: ethers.ZeroHash,
        sourceId: ethers.ZeroHash,
        votingRound: 0,
        lowestUsedTimestamp: 0,
        requestBody: {
          // Can be empty or mocked if unused
          url: "http://example.com",
          method: "",
          headers: [],
          body: "",
        },
        responseBody: {
          abiEncodedData: encodedDTO,
          statusCode: 200,
          headers: [],
        },
      },
    };

    await flareEnough.addEvent(mockProof);

    const storedEvent = await flareEnough.events(1);
    expect(storedEvent.name).to.equal("Trump Wins");
    expect(storedEvent.eventHappened).to.equal(true);
  });
});
