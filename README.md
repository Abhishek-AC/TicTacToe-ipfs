# TicTacToe-ipfs
A proof of concept on how IPFS state channels can be used in Ethereum based games.

Requirements:

Local ipfs node with IPFS API URL at: http://127.0.0.1:5001, 

MetaMask set on Ropsten Testnet with some test-ether for gas. 

Setup:

in app.js set "myAddress" to your MetaMask wallet address

npm install;

npm run build;

npm start;

Website will be loaded at: http://127.0.0.1:12345

TODO: use solidity events to update state changes and response from Illegal move investigation, reduce node_modules weight.
