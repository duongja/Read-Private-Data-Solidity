# Read Private Data in Solidity

This repository is a small Hardhat project that demonstrates an important Ethereum security property:

`private` in Solidity does not mean secret.

The `Login` contract stores a username and password as `private bytes32` values. The accompanying test shows that both values can still be recovered directly from storage slots with a normal JSON-RPC call.

## Why this exists

Developers new to Solidity often assume `private` behaves like application-layer access control. It does not. The keyword only prevents other contracts from reading the variable through Solidity syntax. The data is still stored on-chain and is readable by anyone running an archive node, using a block explorer, or calling `eth_getStorageAt`.

This project is intentionally insecure for teaching purposes.

## Project layout

```text
contracts/Login.sol    Intentionally insecure contract
test/attack.js         Tests that prove storage is readable
scripts/deploy.js      Deployment script with storage inspection output
hardhat.config.js      Hardhat configuration
```

## Requirements

- Node.js 20 or newer
- npm 10 or newer

The repo was verified on Node.js `22.20.0`.

## Install

```bash
npm install
```

## Commands

```bash
npm run compile
npm test
npm run deploy
npm run node
npm run deploy:localhost
npm run check
```

## End-to-end demo

Run the full local validation flow:

```bash
npm install
npm run check
npm run deploy
```

You can also deploy against a persistent local Hardhat node:

```bash
npm run node
```

In a second terminal:

```bash
npm run deploy:localhost
```

To use custom demo credentials, pass them as environment variables:

```bash
LOGIN_USERNAME=alice LOGIN_PASSWORD=hunter2 npm run deploy
```

Values are encoded as `bytes32`, so each input must be 31 bytes or fewer when UTF-8 encoded.

## What the test proves

The contract stores:

- `username` in storage slot `0`
- `password` in storage slot `1`

The test uses `eth_getStorageAt` to read those slots directly and then decodes the returned `bytes32` values back into strings.

## Security takeaway

Never store passwords, private keys, API tokens, recovery phrases, or any other secret material directly on-chain, even if the variable is marked `private`.

Safe design patterns usually involve:

- keeping secrets off-chain
- using signatures instead of shared secrets
- storing hashes or commitments only when the use case truly allows it
- treating all on-chain state as public by default
