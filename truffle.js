// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    live: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 58345, // Match any network id
      from: "0xb02b85dfb3770e5b79392a6309c7fe6a4bc50d82", // use the account-id generated during the setup process
      gas: 4712388
    }
  }
};
