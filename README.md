# Swap Token + KiteAI

Swap Token Dapp is a decentralized application (dApp) built on the Kite AI chain using React Vite, Tailwind CSS, and Ethers.js. It allows users to swap between KITE (native token) and USDT (ERC‑20 token) in a fast, user-friendly interface.

## Features

- **Swap Functionality**: Swap tokens from KITE → USDT and USDT → KITE at a fixed rate.
- **Swap Functionality**: Swap tokens from KITE → USDT and USDT → KITE at a fixed rate.
- **Kite AI Integration**: Seamlessly interacts with the Kite AI (Testnet) environment.
- **React & Vite**: A lightweight setup for rapid development and loading speeds.
- **Tailwind CSS**: A utility-first CSS framework for a clean, responsive UI.
- **Ethers.js**: For blockchain interactions, contract calls, and wallet connectivity.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Blockchain Integration**: Ethers.js
- **Smart Contracts**: Solidity (NativeERC20Swap)
- **Block chain**: Kite AI (Testnet)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/bhalsodkhushal/swipe-token-dapp
   cd swipe-token-dapp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

#### Connect Your Wallet:

- Use MetaMask or a compatible wallet.
- Add the Kite AI Testnet as a custom RPC in MetaMask.

```sh
Chain name: KiteAI Testnet

Default RPC URL - https://rpc-testnet.gokite.ai/

Chain ID: 2368

Token: KITE

Block Explorer URL - https://testnet.kitescan.ai/
```

#### Acquire Test Tokens (Faucet):

- Visit the KiteAI Faucet platform (https://faucet.gokite.ai/).
- Follow the instructions to obtain KITE and USDT tokens.

#### Run the DApp:

- Open your browser at http://localhost:3000 (or the port listed in your terminal).
- Click “Connect Wallet” to connect your Kite AI wallet.

#### Swapping KITE → USDT:

- Enter the amount of KITE you want to swap.
- Click “Swap”.
- Approve the transaction in MetaMask, paying gas fees in KITE.

#### Swapping USDT → KITE:

- Enter the amount of USDT to swap.
- Click “Approve”. (DApp to spend your USDT)
- After success of Approve, Click “Swap”.
- Confirm the transaction in MetaMask.

#### Check Balances:

- The UI will display your current KITE and USDT balances.
- After each swap, your wallet balance updates automatically.
