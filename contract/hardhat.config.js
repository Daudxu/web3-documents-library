require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.POLYGON_TEST_PRI_KEY],
    },
    polygontest: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_TEST_API_KEY}`,
      accounts: [process.env.POLYGON_TEST_PRI_KEY],
    },
    // polygonmain: {
    //   url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_MAIN_API_KEY}`,
    //   accounts: [process.env.POLYGON_MAIN_PRI_KEY],
    // },
    test: {
      url: `http://127.0.0.1:8545`,
      accounts: [process.env.LOCAL_PRI_KEY],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
