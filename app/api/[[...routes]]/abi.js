export const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum BetGame.Choice",
          "name": "choice",
          "type": "uint8"
        }
      ],
      "name": "BetPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player1",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum BetGame.Choice",
          "name": "player1Choice",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "player2",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum BetGame.Choice",
          "name": "player2Choice",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256"
        }
      ],
      "name": "GameResultEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getAllPlayerBets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "player",
              "type": "address"
            },
            {
              "internalType": "enum BetGame.Choice",
              "name": "choice",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct BetGame.Bet[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getLastPlayerBet",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "player1",
              "type": "address"
            },
            {
              "internalType": "enum BetGame.Choice",
              "name": "player1Choice",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "player1Amount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "player2",
              "type": "address"
            },
            {
              "internalType": "enum BetGame.Choice",
              "name": "player2Choice",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "player2Amount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "winner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "reward",
              "type": "uint256"
            }
          ],
          "internalType": "struct BetGame.GameResult",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastBet",
      "outputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "enum BetGame.Choice",
          "name": "choice",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum BetGame.Choice",
          "name": "_choice",
          "type": "uint8"
        }
      ],
      "name": "placeBet",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "playerBets",
      "outputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "enum BetGame.Choice",
          "name": "choice",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "playerGameHistory",
      "outputs": [
        {
          "internalType": "address",
          "name": "player1",
          "type": "address"
        },
        {
          "internalType": "enum BetGame.Choice",
          "name": "player1Choice",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "player1Amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "player2",
          "type": "address"
        },
        {
          "internalType": "enum BetGame.Choice",
          "name": "player2Choice",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "player2Amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  
];