# web3 documents library

### Profile settings

Create .env files in the root directory

```
INFURA_API_KEY=
ETHERSCAN_API_KEY=
POLYGON_TEST_API_KEY=
POLYGON_MAIN_API_KEY=
POLYGON_TEST_PRI_KEY=
POLYGON_MAIN_PRI_KEY=
LOCAL_PRI_KEY=
```
Fill in your configuration


Download dependencies

```
yarn
or
npm install
```

Compile contract

```
npx hardhat compile 
```

Deployment contract

```
# Deploy contract to polygontest network
npx hardhat run .\scripts\deploy_CoinTokenTools_v1.js --network polygontest
```

```
# Upgrade contract to polygontest network
npx hardhat run .\scripts\deploy_CoinTokenTools_v2.js --network polygontest
```

