/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import {abi} from './abi.js'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'Frame RPS Bet',
})

const CONTRACT_ADDRESS = '0x54310319A12986cb7e988087f3cF1D68eB6Df94C'; // the smarct contract address?
const CHAIN_ID = 'eip155:84532'; // the chain id of the network Base Sepolia?

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
      <Button.Link href="https://google.com">Google</Button.Link>,
    ],
  })
})


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
