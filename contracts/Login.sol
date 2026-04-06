// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title Intentionally insecure on-chain login example
/// @notice Demonstrates that `private` state variables are still readable from storage.
contract Login {
    // slot 0
    bytes32 private username;

    // slot 1
    bytes32 private password;

    constructor(bytes32 _username, bytes32 _password) {
        username = _username;
        password = _password;
    }

    function authenticate(bytes32 suppliedUsername, bytes32 suppliedPassword)
        external
        view
        returns (bool)
    {
        return suppliedUsername == username && suppliedPassword == password;
    }
}
