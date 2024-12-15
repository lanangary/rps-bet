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
  1: 'rock',
  2: 'paper',
  3: 'scissors',
}

app.frame('/', (c) => {
   const { frameData , status } = c
   const buttonIndex = frameData?.buttonIndex as 1 | 2 | 3
   const buttonValue = BUTTON_LABELS[buttonIndex] || '...'
  
   return c.res({
    action: '/addaddress',
    image: ('https://i.ibb.co.com/CM9PC90/Play-the-Game-and-get-rewards.gif'),
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
  const theimg = buttonValue !== '...' ? buttonValue == 'rock' ? 'https://i.ibb.co.com/p4XTkbc/rock-anim.gif' : buttonValue == 'paper' ? 'https://i.ibb.co.com/S0B0Jht/paper-anim.gif' : 'https://i.ibb.co.com/JrD6KWw/scissors-anim.gif' : 'https://i.ibb.co.com/yhp24Tz/enter-wallet.jpg';

  return c.res({
    action: '/result',
    image: (theimg),
    intents: [
      <TextInput placeholder="Wallet Adress"/>,
      <Button>Check Result</Button>,
    ],
  });
});



app.frame('/result', async (c) => {
  const { frameData, status, inputText } = c;
  const playerAddress = inputText || '';
  const gameResult: GameResult = await fetchGameResult(CONTRACT_ADDRESS, playerAddress);
  const { player1, player1Choice, player2, player2Choice, winner, reward, error } = gameResult;

  if (winner == '') {
    return c.res({
      action: '/',
      image: 'https://i.ibb.co.com/D8JJN6y/Play-the-Game-and-get-rewards.jpg',
      intents: [<Button.Reset>Play Again</Button.Reset>],
    });
  }else{

    return c.res({
      action: '/',
      image: (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          textAlign: 'center',
          color: 'white',
          fontSize: 30,
          marginTop: 30,
          padding: '0 20px',
          whiteSpace: 'pre-wrap',
    }}>

        {status === 'response' ? (
          `Your Last Game Results:\n` +
          `Player 1: ${player1} chose ${player1Choice}\n` +
          `Player 2: ${player2} chose ${player2Choice}\n` +
          `Winner: ${winner}\n` +
          `Reward: ${reward} ETH`
        ) : 'Waiting for game results...'}

    </div>
      ),
      intents: [<Button.Reset>Play Again</Button.Reset>],
    });
  }

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
