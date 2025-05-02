---
title: Blockchain Explained
date: May 02, 2025
author: Sujay Kapadnis
---

## The Basics: Blockchain Structure and Nodes

* Blockchain is a decentralized system where transaction records (in blocks) are stored across a distributed network of computers (nodes).
* The security comes from this distribution - for a record to be accepted, it must match across the network. Any mismatch would indeed flag potential fraud.
* Once blocks are added, they're effectively immutable - only new blocks can be added on top, creating the "chain" effect.

## Transactions and the Mempool

* Transactions are first *validated* by each node that receives it before entering the mempool.
* This validation includes checking digital signatures, ensuring inputs exist, and verifying the sender has sufficient balance.
* The mempool isn't a single central location but rather exists independently on each node - nodes share information about which transactions they have in their mempools.

## Block Formation and Mining
* Miners typically choose transactions based on "fee density" (fee divided by transaction size) rather than just highest fee.
* This maximizes their profit per block space used.
* About the puzzle: The "target" isn't actually shared directly between blocks. Each block contains its own difficulty target.
* The actual process is:
  1. Miner takes transactions from mempool
  2. Creates a candidate block with those transactions
  3. Adds a coinbase transaction (their reward) 
  4. Calculates the Merkle root of all transactions
  5. Assembles the block header with the previous block hash, Merkle root, timestamp, bits, and nonce
  6. Repeatedly changes the nonce (and sometimes timestamp or transaction order) to find a hash below the target

## Mining Rewards and Incentives

* Miners receive newly created coins (the "block subsidy") plus all transaction fees
* In Bitcoin, this block subsidy started at 50 BTC and halves approximately every 4 years
* Currently (May 2025), the block subsidy is 3.125 BTC per block
* This controlled issuance is how new coins enter circulation

## Difficulty Adjustment

* The adjustment aims to keep block times at approximately 10 minutes regardless of how much mining power joins or leaves the network
* If more miners join, blocks would be found faster than 10 minutes, so difficulty increases
* If miners leave, blocks would be found slower than 10 minutes, so difficulty decreases
* This self-regulating mechanism maintains consistent block timing regardless of network hashpower

## Proof of Stake Clarification

* In PoS, validators (not miners) are selected to create blocks based partly on how many coins they've staked
* They don't exactly "put stake on letting their block pass first"
* Instead, the protocol randomly selects validators, with higher stake giving a proportionally higher chance of selection
* Unlike PoW, there's no computational puzzle to solve - validation is based on economic stake in the system

## Blockchain Finality

* One concept to be mentioned is "finality":
  * In Bitcoin and most PoW systems, blocks are never 100% final
  * Each new block built on top adds "confirmation" and makes reversal exponentially more difficult
  * By convention, most Bitcoin users consider 6 confirmations (blocks built on top) to be effectively final
  * This probabilistic finality differs from some other consensus mechanisms that offer absolute finality
