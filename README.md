# Node DHT

> A simple Distributed Hash Table made in NodeJS

<!-- TOC -->

- [Node DHT](#node-dht)
  - [Introduction](#introduction)
    - [Instalation](#instalation)
    - [Running](#running)
  - [Protocol](#protocol)
    - [`JOIN (address, port)`](#join-address-port)
    - [`JOIN_ACK (previousNode, nextNode)`](#join_ack-previousnode-nextnode)
    - [`TRANSFER (key, value, sender)`](#transfer-key-value-sender)
    - [`TRANSFER_ACK (key)`](#transfer_ack-key)
    - [`NEW_NODE (ip, port, id)`](#new_node-ip-port-id)
    - [`LEAVE (newPreviousNode)`](#leave-newpreviousnode)
    - [`NODE_GONE (ip, port, id)`](#node_gone-ip-port-id)
    - [`STORE(key, value)`](#storekey-value)
    - [`RETRIEVE (key, saveLocation, sender)`](#retrieve-key-savelocation-sender)
    - [`FOUND (key, value, saveLocation)`](#found-key-value-savelocation)
    - [`NOT_FOUND ()`](#not_found-)
  - [Files](#files)
  - [Commands](#commands)

<!-- /TOC -->

## Introduction

This is just an experiment as a coursework for Distributed Systems class on UFABC. The goal is to implement a simple DHT using some defined rules:

- There must always be a ring of nodes, which every node has a pointer to the next one and another pointer to the previous one
  - If a node is alone then it points to no one
  - If there are only two nodes, then them both point to each other
- File retrieval must be routed through the ring until it finds the specified file and returns it to the sender, this differs from the original DHT implementation since it does not guarantee a _O(nlogn)_ search time (that's because we're not implementing any sort of finger tables to point to the other side of the ring)
- To join the network, the node must know at least one other node which has already joined the network, otherwise it will create a new DHT.
- A node will always retain responsibility over a file if, and only if, its ID is the closest possible to the file hash key
- A node will be the next node of another node if, and only if, its ID is the closest possible to the other node's ID
- We are not assuming failures, all nodes work to perfection and grecefuly exits the network __at all times__.
- All the message flows clockwise

### Instalation

You need to have Node.js installed, see [Node's official website](http://nodejs.org).

After that, run `npm install` inside the folder

### Running

The main entrypoint is the `index.js` file. It accepts a single argument from the command line, the known hostlist, this will tell the node to connect to an existing network of other nodes. This list can be comma separated and the program will try to connect to each one of them, the first one to answer will be the entrypoint to the network.

If no nodes respond, a new network will be created.

- __Running as first node__: `node index.js`
- __Try to connect to an existing node__: `node index.js localhost:<port>`
- __Try to connect to several nodes__: `node index.js ip1:port1,ip2:port2`

## Protocol

Every node must contain 3 base informations:

- The next node
- The previous node
- The node ID

Previous and next nodes are objects with 3 properties: `ip`, `port` and `id`. The IP and port are String and Int respectively, the ID is a `sha256` hash computed on [hashFactory](./src/utils/hashFactory.js) using a fixed password and `ip:port` as base data.

The node ID starts with the highest possible hex ID, so this way if the node is the first to come to the network we'll know where the ring ends. This also helps avoiding the "Greatest Hash File" problem, over which a file's hash is greater than any other node hashes in the ring.

All communications are sent through TCP sockets and the connection __is not__ kept open. The messages are basicaly a set of 12 commands:

### `JOIN (address, port)`

When a node enters an existing DHT it fires this message to the known node (the one which has already joined the DHT). The message receives the ip address and port of the ingressing node.

The receiving node will evaluate if it is the node with the smallest difference between the ingressing node's ID and its own ID comparing against the next node, if not, the message will be copied and routed to the next node, which will repeat the process until a suitable node is found.

The suitable node then fires the `JOIN_ACK`, `TRANSFER` and `NEW_NODE` messages as we'll describe below.

### `JOIN_ACK (previousNode, nextNode)`

If the `JOIN` condition passes, then the receiving node will send a `JOIN_ACK` message to the ingressing node. This message will contain two arguments, which are objects with the below interface:

```js
{
  port: Number,
  ip: String,
  id: String
}
```

The ingressing node, upon receiving this message, will update its pointers to the newly received parameters.

### `TRANSFER (key, value, sender)`

This message is called on two occasions: when a node is leaving the network and when a node is joining the network. It means that a node is transfering its files responsibilities to another node.

On the latest, the ingressing node, after receiving the `JOIN_ACK` message, will receive one or more `TRANSFER` messages. This is done because a new node can have an ID of which the difference between its hash and the files from the known node is smaller than before, so we have to keep the consistency of the rule system.

When leaving the network, the node must always transfer all its files to the next node.

### `TRANSFER_ACK (key)`

When a transfer operation is successfuly performed, the node which received the transfer operation sends a `TRANSFER_ACK` message to the sending node indicating it can remove the files from its file list.

### `NEW_NODE (ip, port, id)`

After joining a DHT and sending the `JOIN` message to a known participant. This known participant sends a `NEW_NODE` message to its previous node, indicating that it is not the other's next node anymore. This message contains the IP, port and ID of the ingressing node.

Upon receving this message, the node will update its next node pointer to point to the ingressing node.

### `LEAVE (newPreviousNode)`

When a node is leaving the network it needs to tell its successor that it needs to update its predecessor. This message is the essence of this communication. It sends as a parameter, an Object with the node signature from before, telling its successor that the new predecessor will be the sender's predecessor.

Upon receing such message, a node will update its predecessor and send the `NODE_GONE` message

### `NODE_GONE (ip, port, id)`

When a node receives a `LEAVE` message, it will communicate its previous node (the one already updated by the received LEAVE message) that its next node does not exist anymore, sending, this message contains only the IP, port and ID of the node which is sending the message, which means that the node which receives it will update its next node pointer to point to the sender of this message.

### `STORE(key, value)`

When a node wants to store some data in the network, it needs to send a `STORE` message. This message will be sent to its successor, which will evaluate if it can store the data or not, according to the rules defined on the beginning of this document.

If it is able to store the data, it will update its fileList with the hash key and the base64 encoded contents of the file. If not, it will route the message to the next node, which will repeat the process.

### `RETRIEVE (key, saveLocation, sender)`

When a node wants to search and retrieve a file from the ring, it'll send a `RETRIEVE` message. This message contains the main data, which is the hashkey of what is being searched, and some metadata (saveLocation and sender) as helpers for the receiving node.

The sender node will route this message to its successor, which will evaluate if the file could be present in its file list or if another node is more likely to have it, again, by comparing the hash of the searched file with the ID of the current and next nodes.

> When the user issues this command on the input, it will lookup locally first

If the file is in the file list, the node will send a `FOUND` message directly to the sender node (that's why the sender as parameter), and the sender will receive this message and save the file (that's why we route the saveLocation). Otherwise it will route the message to the next node __if its hash is greater than its own__, if not, a `NOT_FOUND` message will be sent to the sender node.

### `FOUND (key, value, saveLocation)`

When a file is found, the node which has it will send a `FOUND` message back to the sender node. Since it is a stateless operation, the sender node will not know anymore about the file, so we need to send back the save location as well.

Upon receiving the data, the original node (which asked for the file), will parse the base64 encoded data and save the file to the save location.

### `NOT_FOUND ()`

When a node is suitable to have a file but it is not present, then this message will be sent back to the original sender.

Upon receiving, the sender will show a message to the user.

## Files

The folder structure looks like the following:

- __src__: Contains all the source files
  - __config__: Contains the message strings to all commands
  - __consoleCommands__: That is the client side implementation of all the interactive commands the user can issue at the terminal, in short, the files here are what should happen if you issue a valid command
  - __messages__: Contains the implementation of all messages from the __receiver__ perspective (aKa, what should happen if I receive such message)
  - __utils__: Utility wrappers
  - __node.js__: Main node file, contains all definitions of a node

## Commands

When the node connects you can type `help` into the terminal to get a list of all available commands along with their params.
