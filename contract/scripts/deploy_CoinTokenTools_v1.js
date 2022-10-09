const { ethers, upgrades } = require("hardhat");

async function main() {

  const MyContract = await ethers.getContractFactory("DocTokenV1");
  const myContract = await upgrades.deployProxy(
    MyContract, 
    // ['990000000000000000', '0xCcbe76869e63067713204483891877d9bf84fcdc'],  
    ["You set the mint expense unit Wei", 'your Cashier address'],  
    { initializer: 'initialize' } 
  );

  await myContract.deployed();

  console.log("MyContract deployed to:", myContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
