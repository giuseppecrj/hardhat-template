import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "dotenv/config";

import {HardhatUserConfig, task} from "hardhat/config";
import {createBurner, account, mnemonic} from "./scripts/wallet";

const defaultNetwork = "hardhat";

const config: HardhatUserConfig = {
  defaultNetwork,
  networks: {
    hardhat: {},
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: {
        mnemonic: mnemonic(defaultNetwork),
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
      polygon: process.env.POLYGONSCAN_API_KEY!,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("generate", "Create a deployment wallet", async () => {
  await createBurner();
});

task(
  "account",
  "Get balance informations for the deployment account.",
  async () => {
    await account();
  },
);

export default config;
