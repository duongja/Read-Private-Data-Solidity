const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Login", function () {
  async function deployLogin() {
    const Login = await ethers.getContractFactory("Login");
    const username = "test";
    const password = "password";

    const login = await Login.deploy(
      ethers.encodeBytes32String(username),
      ethers.encodeBytes32String(password)
    );
    await login.waitForDeployment();

    return { login, username, password };
  }

  async function readSlot(contract, slot) {
    return ethers.provider.send("eth_getStorageAt", [
      await contract.getAddress(),
      ethers.toBeHex(slot),
      "latest",
    ]);
  }

  it("authenticates when the stored credentials are provided", async function () {
    const { login, username, password } = await deployLogin();

    expect(
      await login.authenticate(
        ethers.encodeBytes32String(username),
        ethers.encodeBytes32String(password)
      )
    ).to.equal(true);

    expect(
      await login.authenticate(
        ethers.encodeBytes32String(username),
        ethers.encodeBytes32String("wrong-password")
      )
    ).to.equal(false);
  });

  it("leaks private state through raw storage reads", async function () {
    const { login, username, password } = await deployLogin();

    const slot0Bytes = await readSlot(login, 0);
    const slot1Bytes = await readSlot(login, 1);

    expect(ethers.decodeBytes32String(slot0Bytes)).to.equal(username);
    expect(ethers.decodeBytes32String(slot1Bytes)).to.equal(password);
  });
});
