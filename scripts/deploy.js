const hre = require("hardhat");
const { encodeBytes32String } = require("ethers");

function encodeSecret(value, label) {
  try {
    return encodeBytes32String(value);
  } catch (error) {
    throw new Error(
      `${label} must be 31 bytes or fewer when UTF-8 encoded so it fits in a bytes32 value.`,
      { cause: error }
    );
  }
}

async function main() {
  const username = process.env.LOGIN_USERNAME ?? "demo-user";
  const password = process.env.LOGIN_PASSWORD ?? "not-a-secret";

  const Login = await hre.ethers.getContractFactory("Login");
  const login = await Login.deploy(
    encodeSecret(username, "LOGIN_USERNAME"),
    encodeSecret(password, "LOGIN_PASSWORD")
  );
  await login.waitForDeployment();

  const address = await login.getAddress();
  const slot0 = await hre.ethers.provider.send("eth_getStorageAt", [
    address,
    hre.ethers.toBeHex(0),
    "latest",
  ]);
  const slot1 = await hre.ethers.provider.send("eth_getStorageAt", [
    address,
    hre.ethers.toBeHex(1),
    "latest",
  ]);

  console.log(`Login deployed to: ${address}`);
  console.log(`Username configured: ${username}`);
  console.log(`Slot 0 (username): ${slot0}`);
  console.log(`Slot 1 (password): ${slot1}`);
  console.log(
    "This contract is intentionally insecure: any node can recover the stored credentials from chain storage."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
