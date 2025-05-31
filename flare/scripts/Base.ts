import hre, { ethers } from "hardhat";

const FLARE_CONTRACT_REGISTRY_ADDRESS = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

async function getFlareContractRegistry() {
    return await ethers.getContractAt("IFlareContractRegistry", FLARE_CONTRACT_REGISTRY_ADDRESS);
}

async function getContractAddressByName(name: string) {
    const flareContractRegistry = await getFlareContractRegistry();
    return await flareContractRegistry.getContractAddressByName(name);
}

function toHex(data: string) {
    let result = "";
    for (let i = 0; i < data.length; i++) {
        result += data.charCodeAt(i).toString(16);
    }
    return result.padEnd(64, "0");
}

function toUtf8HexString(data: string) {
    return "0x" + toHex(data);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getFdcHub() {
    const fdcHubAddress = await getContractAddressByName("FdcHub");
    return await ethers.getContractAt("IFdcHub", fdcHubAddress);
}

async function getFlareSystemsManager() {
    const address = await getContractAddressByName("FlareSystemsManager");
    return await ethers.getContractAt("IFlareSystemsManager", address);
}

async function getFdcRequestFee(abiEncodedRequest: string) {
    const addr = await getContractAddressByName("FdcRequestFeeConfigurations");
    const contract = await ethers.getContractAt("IFdcRequestFeeConfigurations", addr);
    return await contract.getRequestFee(abiEncodedRequest);
}

async function getRelay() {
    const addr = await getContractAddressByName("Relay");
    return await ethers.getContractAt("IRelay", addr);
}

async function prepareAttestationRequestBase(
    url: string,
    apiKey: string,
    attestationTypeBase: string,
    sourceIdBase: string,
    requestBody: any
) {
    console.log("Url:", url, "\n");
    const attestationType = toUtf8HexString(attestationTypeBase);
    const sourceId = toUtf8HexString(sourceIdBase);

    const request = {
        attestationType,
        sourceId,
        requestBody,
    };
    console.log("Prepared request:\n", request, "\n");

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (response.status !== 200) {
        throw new Error(`Response status is not OK: ${response.status} ${response.statusText}`);
    }
    console.log("Response status is OK\n");

    return await response.json();
}

async function calculateRoundId(transaction: any) {
    const blockNumber = transaction.blockNumber ?? transaction.receipt?.blockNumber;
    const block = await ethers.provider.getBlock(blockNumber);
    const timestamp = BigInt(block.timestamp);

    const systemsManager = await getFlareSystemsManager();
    const start = BigInt(await systemsManager.firstVotingRoundStartTs());
    const duration = BigInt(await systemsManager.votingEpochDurationSeconds());

    const roundId = Number((timestamp - start) / duration);
    console.log("Block timestamp:", timestamp.toString());
    console.log("Start:", start.toString());
    console.log("Duration:", duration.toString());
    console.log("Calculated round id:", roundId);
    console.log("Actual round id:", await systemsManager.getCurrentVotingEpochId());

    return roundId;
}

async function submitAttestationRequest(abiEncodedRequest: string) {
    const hub = await getFdcHub();
    const fee = await getFdcRequestFee(abiEncodedRequest);

    const tx = await hub.requestAttestation(abiEncodedRequest, {
        value: fee,
    });
    const receipt = await tx.wait();

    console.log("Submitted request:", receipt.transactionHash);

    const roundId = await calculateRoundId(receipt);
    console.log(
        `Check round progress at: https://${hre.network.name}-systems-explorer.flare.rocks/voting-epoch/${roundId}?tab=fdc\n`
    );

    return roundId;
}

async function postRequestToDALayer(url: string, request: any, watchStatus = false) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (watchStatus && response.status !== 200) {
        throw new Error(`Response status is not OK: ${response.status} ${response.statusText}`);
    } else if (watchStatus) {
        console.log("Response status is OK");
    }

    return await response.json();
}

async function retrieveDataAndProofBase(url: string, abiEncodedRequest: string, roundId: number) {
    console.log("Waiting for the round to finalize...");
    const relay = await getRelay();

    while (!(await relay.isFinalized(200, roundId))) {
        await sleep(30000);
    }

    console.log("Round finalized!\n");

    const request = {
        votingRoundId: roundId,
        requestBytes: abiEncodedRequest,
    };

    console.log("Prepared request:\n", request);

    await sleep(10000);
    let proof = await postRequestToDALayer(url, request, true);
    console.log("Waiting for the DA Layer to generate the proof...");

    while (proof.response_hex === undefined) {
        await sleep(10000);
        proof = await postRequestToDALayer(url, request, false);
    }

    console.log("Proof generated!\n");
    console.log("Proof:", proof);

    return proof;
}

async function retrieveDataAndProofBaseWithRetry(
    url: string,
    abiEncodedRequest: string,
    roundId: number,
    attempts = 10
) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await retrieveDataAndProofBase(url, abiEncodedRequest, roundId);
        } catch (e: any) {
            console.log(e, `Remaining attempts: ${attempts - i - 1}`);
            await sleep(20000);
        }
    }

    throw new Error(`Failed to retrieve data and proofs after ${attempts} attempts`);
}

export {
    toUtf8HexString,
    sleep,
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBase,
    retrieveDataAndProofBaseWithRetry,
    getFdcHub,
    getFdcRequestFee,
    getRelay,
    calculateRoundId,
    postRequestToDALayer,
};
