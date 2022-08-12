const { ethers, upgrades } = require("hardhat");

// proxy address
const myContractProxyAddr = "0xC99F5d7A892D384b4B9d2f31D552237cEe795eEf"

async function main() {
    const MyContractV2 = await ethers.getContractFactory("DocTokenV2");
    // update
    const myContractV2 = await upgrades.upgradeProxy(myContractProxyAddr, MyContractV2);

    console.log("myContractV2 upgraded");
}
// https://daudxu.github.io/docStore/metadata/{id}.json
// 00000000000000000000000000000000000000000000000000000000000000000

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });