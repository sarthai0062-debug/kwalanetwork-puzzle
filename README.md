# 🎮 Slide Bounty Quest

> Solve puzzles, earn crypto—a skill-based Web3 game on Polygon where every puzzle solved unlocks real rewards.

**[🎯 Play Now](https://kwalanetwork-puzzle.vercel.app/)** | **[📖 Game Mechanics](GAME_MECHANICS.md)** | **[⚡ Kwala Workflow](KWALA_WORKFLOW.md)**

---

## ✨ Features

- 🧩 **7 Progressive Levels** - Increasing difficulty from 3×3 to 5×5 grids
- 💰 **Automated Rewards** - POL rewards automatically delivered via Kwala
- 🎯 **Milestone System** - Claim rewards at levels 1, 3, 5, and 7
- 🔗 **On-Chain Progress** - All completions recorded on Polygon Amoy
- 🦊 **MetaMask Integration** - Seamless wallet connection
- ⚡ **Zero-Friction Claims** - No manual claiming needed (Kwala handles it!)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask wallet
- Polygon Amoy testnet POL ([Get from faucet](https://faucet.polygon.technology/))

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

Visit `http://localhost:8080` to play locally.

---

## 🎯 How to Play

1. **Connect Wallet** - Connect your MetaMask wallet
2. **Switch Network** - Ensure you're on Polygon Amoy testnet
3. **Solve Puzzles** - Complete 7 progressively difficult sliding puzzles
4. **Earn Rewards** - Receive POL automatically at milestones (1, 3, 5, 7)

**That's it!** Kwala automatically handles reward distribution—no manual claiming required.

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Blockchain**: Ethers.js v6
- **Network**: Polygon Amoy Testnet
- **Automation**: Kwala Workflow Editor
- **Deployment**: Vercel

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Deploy! (Auto-detects Vite configuration)

---

## 📝 Contract Details

- **Network**: Polygon Amoy Testnet
- **Chain ID**: `80002`
- **Contract**: `0xc6D3bBA40408ad9a706FdE69716C1adbDB7aeA75`
- **Explorer**: [View on PolygonScan](https://amoy.polygonscan.com/address/0xc6D3bBA40408ad9a706FdE69716C1adbDB7aeA75)

---

## 📚 Documentation

- **[Game Mechanics](GAME_MECHANICS.md)** - How the game works and smart contract integration
- **[Kwala Workflow](KWALA_WORKFLOW.md)** - Automated reward payout system

---

## 🎨 Project Structure

```
├── src/
│   ├── components/      # React components
│   │   ├── SlidePuzzle.tsx    # Puzzle game logic
│   │   ├── GameProgress.tsx   # Progress tracking
│   │   └── WalletConnect.tsx  # Wallet integration
│   ├── lib/
│   │   └── contract.ts        # Smart contract interactions
│   └── pages/
│       └── Index.tsx           # Main game page
├── vercel.json          # Vercel deployment config
└── README.md
```

---

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

MIT

---

## 🔗 Links

- **Live Game**: [kwalanetwork-puzzle.vercel.app](https://kwalanetwork-puzzle.vercel.app/)
- **Polygon Amoy Faucet**: [faucet.polygon.technology](https://faucet.polygon.technology/)
- **Contract Explorer**: [amoy.polygonscan.com](https://amoy.polygonscan.com/address/0xc6D3bBA40408ad9a706FdE69716C1adbDB7aeA75)

---

**Built with ❤️ using Kwala Workflow Editor for automated rewards**
