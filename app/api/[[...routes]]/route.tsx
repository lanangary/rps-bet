/** @jsxImportSource frog/jsx */
import mockGameResult from './mock-game-result.json'; // Adjust path as needed

import { Button, Frog, TextInput, parseEther } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import {abi} from './abi.js'
import { ethers } from 'ethers'; // Add ethers.js
import { env } from 'process';


const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'Frame RPS Bet',
})

const CONTRACT_ADDRESS = '0x54310319A12986cb7e988087f3cF1D68eB6Df94C'; // the smarct contract address?
const CHAIN_ID = 'eip155:84532'; // the chain id of the network Base Sepolia?
const infuraApiKey = env.INFURA_KEY // Get Infura API key from environment variable
const network = "base-sepolia"; // Or "sepolia", "mainnet", etc.

const BUTTON_LABELS = {
  1: 'Rock',
  2: 'Paper',
  3: 'Scissors',
}


app.frame('/', (c) => {
   const { frameData , status } = c
   const buttonIndex = frameData?.buttonIndex as 1 | 2 | 3
   const buttonValue = BUTTON_LABELS[buttonIndex] || '...'
  
   return c.res({
    action: '/addaddress',
    image: (
      <div
        style={{
          alignItems: 'center',
          background: status === 'response' 
            ? 'linear-gradient(to right, #432889, #17101F)' 
            : 'black',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 50,
            marginTop: 30,
            padding: '0 20px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response' ? `You chose ${buttonValue}. Please wait for an opponent...` : 'Welcome to Rock, Paper, Scissors!'}
        </div>
      </div>
    ),
    intents: [
      <Button.Transaction target="/bet/rock?choice=Rock">Rock</Button.Transaction>,
      <Button.Transaction target="/bet/paper?choice=Paper">Paper</Button.Transaction>,
      <Button.Transaction target="/bet/scissors?choice=Scissors">Scissors</Button.Transaction>,
      <Button>Check Result</Button>,
    ],
  })
})

type GameResult = {
  player1: string;
  player1Choice: string;
  player2: string;
  player2Choice: string;
  winner: string;
  reward: string;
  error?: string;
};

async function fetchGameResult(contractAddress: string, playerAddress: string): Promise<GameResult> {
  const provider = new ethers.InfuraProvider(network, infuraApiKey);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    const gameResult = await contract.getLastPlayerBet(playerAddress);
    const choices = ["Rock", "Paper", "Scissors"];
    return {
      player1: gameResult.player1,
      player1Choice: choices[gameResult.player1Choice],
      player2: gameResult.player2,
      player2Choice: choices[gameResult.player2Choice],
      winner: gameResult.winner,
      reward: gameResult && gameResult.reward ? ethers.formatEther(gameResult.reward) : '0', // Convert wei to ETH
    };
  } catch (error) {
    console.error("Error fetching game results:", error);
    // Always return a consistent JSON structure, even on error
    return {
      player1: '',
      player1Choice: '',
      player2: '',
      player2Choice: '',
      winner: '',
      reward: '0',
      error: (error instanceof Error) ? error.message : String(error),
    };
  }
}

app.frame('/addaddress', (c) => {
  const { frameData , status } = c
  const buttonIndex = frameData?.buttonIndex as 1 | 2 | 3
  const buttonValue = BUTTON_LABELS[buttonIndex] || '...'

  return c.res({
    action: '/result',
    image: (
      <div
      style={{
        alignItems: 'center',
        background: status === 'response' 
          ? 'linear-gradient(to right, #432889, #17101F)' 
          : 'black',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <div style={{             
        color: 'white',
        fontSize: 40,
        marginTop: 30,
        padding: '0 20px',
        whiteSpace: 'pre-wrap', }}>
          {status === 'response' ? `You chose ${buttonValue}. Like and Recast this Frame to get faster opponent...` : 'Like and Recast this Frame to get faster opponent'}
       </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Wallet Adress"/>,
      <Button>Check Result</Button>,
    ],
  });
});



app.frame('/result', async (c) => {
  const { frameData , status, inputText } = c
  const playerAddress = inputText || ''; // Ensure playerAddress is always a string
  const gameResult: GameResult = await fetchGameResult(CONTRACT_ADDRESS, playerAddress);
  const { player1, player1Choice, player2, player2Choice, winner, reward, error } = gameResult;

  return c.res({ 
    image: (
      <div style={{             
        color: 'white',
        fontSize: 30,
        marginTop: 30,
        padding: '0 20px',
        whiteSpace: 'pre-wrap', }}>

        {status === 'response' ? (
          `Your Last Game Results:\n` +
          `Player 1: ${player1} chose ${player1Choice}\n` +
          `Player 2: ${player2} chose ${player2Choice}\n` +
          `Winner: ${winner}\n` +
          `Reward: ${reward} ETH`
        ) : 'Waiting for game results...'}
    </div>
    ),  
    intents: [
      <Button.Reset>Play Again</Button.Reset>,
    ],
   }); 
});


// 🪨 Transaction for Rock
app.transaction('/bet/rock', (c) => {
  return c.contract({
    abi,
    chainId: CHAIN_ID,// base sepolia chain id
    functionName: 'placeBet',
    args: [0], // 0 = Rock (as per smart contract Choice enum)
    to: CONTRACT_ADDRESS,
    value: parseEther('0.0001') // 0.001 ETH
  })
})

// 📄 Transaction for Paper
app.transaction('/bet/paper', (c) => {
  return c.contract({
    abi,
    chainId: CHAIN_ID,// base sepolia chain id
    functionName: 'placeBet',
    args: [1], // 1 = Paper
    to: CONTRACT_ADDRESS,
    value: parseEther('0.0001') // 0.001 ETH
  })
})

// ✂️ Transaction for Scissors
app.transaction('/bet/scissors', (c) => {
  return c.contract({
    abi,
    chainId: CHAIN_ID,// base sepolia chain id
    functionName: 'placeBet',
    args: [2], // 2 = Scissors
    to: CONTRACT_ADDRESS,
    value: parseEther('0.0001') // 0.001 ETH
  })
})


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
