import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import {HardhatUserConfig, task} from "hardhat/config";
import "dotenv/config";

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
