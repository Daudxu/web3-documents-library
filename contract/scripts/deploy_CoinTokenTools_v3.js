const { ethers, upgrades } = require("hardhat");

// proxy address
const myContractProxyAddr = "0xC99F5d7A892D384b4B9d2f31D552237cEe795eEf"

async function main() {
    const MyContractV3 = await ethers.getContractFactory("DocTokenV3");
    // update
    const myContractV3 = await upgrades.upgradeProxy(myContractProxyAddr, MyContractV3);

    console.log("DocTokenV3 upgraded");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });