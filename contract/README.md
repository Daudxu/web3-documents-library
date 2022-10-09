# web3 documents library

## contract

### Profile settings

Create .env files in the root directory

```
# Application address: https://infura.io
INFURA_API_KEY=
# Application address: https://etherscan.io/
ETHERSCAN_API_KEY=
# Application address: https://www.alchemy.com/
POLYGON_TEST_API_KEY=
# Application address: https://www.alchemy.com/
POLYGON_MAIN_API_KEY=
# Your wallet private key
POLYGON_TEST_PRI_KEY=
# Your wallet private key
POLYGON_MAIN_PRI_KEY=
# Your wallet private key
LOCAL_PRI_KEY=
```
Fill in your configuration


Download dependencies

```
yarn
or
npm install
```

edit Deploy script

```
# edit  Deploy script  deploy_CoinTokenTools_v1

const { ethers, upgrades } = require("hardhat");

async function main() {
  const MyContract = await ethers.getContractFactory("DocTokenV1");
  const myContract = await upgrades.deployProxy(
    MyContract, 
# parameter 1 : You set the mint expense unit Wei  parameter 2 :your Cashier wallet address
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

```

Compile contract 

```
npx hardhat compile 
```

Deploy contract 

```

# Deploy contract to Deploy network

npx hardhat run .\scripts\deploy_CoinTokenTools_v1.js --network polygontest

```