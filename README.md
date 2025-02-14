# KiteSwap (Swap Token with KiteAI)

Swap Token Dapp is a decentralized application (dApp) built on the Kite AI chain using React Vite, Tailwind CSS, Ethers.js and AppKit (Web3Modal). It allows users to swap between KITE (native token) and USDT (ERC‑20 token) in a fast, user-friendly interface.

### App URL: https://kite-swap.vercel.app/

### Medium Article URL: https://medium.com/@bhalsodkhushal/swap-token-dapp-a-seamless-kite-to-usdt-swap-experience-on-kite-ai-chain-3105b81c1120

## Features

- **Swap Functionality**: Swap tokens from KITE → USDT and USDT → KITE at a fixed rate.
- **Swap Functionality**: Swap tokens from KITE → USDT and USDT → KITE at a fixed rate.
- **Kite AI Integration**: Seamlessly interacts with the Kite AI (Testnet) environment.
- **React & Vite**: A lightweight setup for rapid development and loading speeds.
- **Tailwind CSS**: A utility-first CSS framework for a clean, responsive UI.
- **Ethers.js**: For blockchain interactions and contract calls.
- **Reown AppKit (Web3Modal)**: A flexible multi-wallet connect solution, supporting MetaMask and other EIP-1193 providers.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Blockchain Integration**: Ethers.js
- **Wallet Connect**: Reown AppKit (Web3Modal)
- **Smart Contracts**: Solidity (NativeERC20Swap)
- **Block chain**: Kite AI (Testnet)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/bhalsodkhushal/kite-swap
   cd kite-swap
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

#### Connect Your Wallet via Reown AppKit:

- Open the dApp in your browser at http://localhost:3000 (or the port listed in your terminal).
- Click “Connect Wallet” - the Reown AppKit flow will prompt you to select or connect a wallet.
- Make sure to add the Kite AI Testnet to your wallet as a custom RPC if not already present.

#### Kite AI Testnet Details (for MetaMask or other wallets):

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

### Sample Performed Transactions:

You can view all transactions and contract interactions on [KiteScan](https://testnet.kitescan.ai/) by visiting the following address:

[https://testnet.kitescan.ai/address/0x990d66D4D00679c7201bA1EEC5265031358f16F8](https://testnet.kitescan.ai/address/0x990d66D4D00679c7201bA1EEC5265031358f16F8)
