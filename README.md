# Slide Bounty Quest

A blockchain-based sliding puzzle game on Polygon Amoy testnet. Solve puzzles, complete milestones, and earn POL rewards!

## 🎮 Features

- **7 Progressive Levels**: Increasing difficulty from 3x3 to 5x5 grids
- **Milestone Rewards**: Claim POL at levels 1, 3, 5, and 7
- **On-Chain Progress**: All puzzle completions recorded on Polygon Amoy
- **Wallet Integration**: Connect MetaMask to play and claim rewards
- **Contract Funding**: Fund the contract directly from the UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask wallet
- Polygon Amoy testnet POL (get from [faucet](https://faucet.polygon.technology/))

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd slide-bounty-quest-main

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Tech Stack

- **Vite** - Build tool
- **React** + **TypeScript** - Frontend framework
- **Ethers.js** - Blockchain interactions
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Polygon Amoy** - Testnet blockchain

## 📦 Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect the Vite configuration
4. Deploy!

The `vercel.json` file is already configured for optimal deployment.

### Deploy to GitHub Pages

```bash
# Build the project
npm run build

# Deploy (requires gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

## 📝 Contract Details

- **Network**: Polygon Amoy Testnet (Chain ID: 80002)
- **Contract Address**: `0xc6D3bBA40408ad9a706FdE69716C1adbDB7aeA75`
- **Explorer**: [View on PolygonScan](https://amoy.polygonscan.com/address/0xc6D3bBA40408ad9a706FdE69716C1adbDB7aeA75)

## 🎯 How to Play

1. Connect your MetaMask wallet
2. Ensure you're on Polygon Amoy testnet
3. Solve sliding puzzles to progress through 7 levels
4. Complete milestones at levels 1, 3, 5, and 7
5. Claim your POL rewards!

## 📄 License

MIT
