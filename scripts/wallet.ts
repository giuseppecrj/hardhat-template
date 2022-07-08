import fs from "fs";
import chalk from "chalk";
import {HttpNetworkUserConfig} from "hardhat/types";
import config from "../hardhat.config";

export function mnemonic(defaultNetwork: string) {
  try {
    return fs.readFileSync("./wallets/mnemonic.txt").toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.",
      );
    }
  }
  return "";
}

export async function account(DEBUG = false) {
  const {hdkey} = require("ethereumjs-wallet");
  const bip39 = require("bip39");
  const {ethers} = require("hardhat");
  try {
    const mnemonic = fs
      .readFileSync("./wallets/mnemonic.txt")
      .toString()
      .trim();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    const fullPath = wallet_hdpath + account_index;
    if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet.privateKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);
    const EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet.privateKey).toString("hex");

    const qrcode = require("qrcode-terminal");
    qrcode.generate(address);
    console.log("‍📬 Deployer Account is " + address);
    for (const n in config.networks) {
      try {
        const network = config.networks[n] as HttpNetworkUserConfig;
        const provider = new ethers.providers.JsonRpcProvider(network.url);
        const balance = await provider.getBalance(address);
        console.log(" -- " + n + " --  -- -- 📡 ");
        console.log("   balance: " + ethers.utils.formatEther(balance));
        console.log(
          "   nonce: " + (await provider.getTransactionCount(address)),
        );
      } catch (e) {
        if (DEBUG) {
          console.log(e);
        }
      }
    }
  } catch (err) {
    console.log(err);
    console.log(`--- Looks like there is no mnemonic file created yet.`);
    console.log(
      `--- Please run ${chalk.greenBright("yarn generate")} to create one`,
    );
  }
}

export async function createBurner(DEBUG = false) {
  const bip39 = require("bip39");
  const {hdkey} = require("ethereumjs-wallet");

  const mnemonic = bip39.generateMnemonic();
  DEBUG && console.log("mnemonic", mnemonic);

  const seed = await bip39.mnemonicToSeed(mnemonic);
  DEBUG && console.log("seed", seed);

  const hdwallet = hdkey.fromMasterSeed(seed);
  const walletHdPath = "m/44'/60'/0'/0/";

  const accountIndex = 0;

  const fullPath = walletHdPath + accountIndex;
  DEBUG && console.log("fullPath", fullPath);

  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x" + wallet.privateKey.toString("hex");

  DEBUG && console.log("privateKey", privateKey);

  const EthUtil = require("ethereumjs-util");
  const address =
    "0x" + EthUtil.privateToAddress(wallet.privateKey).toString("hex");

  console.log(
    "🔐 Account Generated as " + address + " and set as mnemonic in root",
  );

  console.log(
    "💬 Use 'yarn run account' to get more information about the deployment account.",
  );

  if (!fs.existsSync("./wallets")) fs.mkdirSync("./wallets");

  fs.writeFileSync(
    "./wallets/" + address + ".txt",
    `${mnemonic.toString()}\n${privateKey}`,
  );
  fs.writeFileSync("./wallets/mnemonic.txt", mnemonic.toString());
}
