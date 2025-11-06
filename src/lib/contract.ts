import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0xc6d3bba40408ad9a706fde69716c1adbdb7aea75";

export const CONTRACT_ABI = [
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
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "BountyPaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "GameCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "milestone",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "rewardsClaimed",
        "type": "uint8"
      }
    ],
    "name": "MilestoneReached",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "payoutLast",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "performSlide",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "totalCompleted",
        "type": "uint8"
      }
    ],
    "name": "PuzzleCompleted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "setBounty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "SlidePerformed",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "bountyAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
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
        "name": "user",
        "type": "address"
      }
    ],
    "name": "hasFinishedGame",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastPayoutTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastUser",
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
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "nextRewardMilestone",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "milestone",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "available",
        "type": "bool"
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
    "inputs": [],
    "name": "payoutCooldown",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
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
      }
    ],
    "name": "puzzlesCompleted",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
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
      }
    ],
    "name": "rewardsClaimedCount",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const AMOY_CHAIN_ID = "0x13882"; // 80002 in hex (Polygon Amoy Testnet)
export const AMOY_CHAIN_ID_DECIMAL = 80002;
export const AMOY_CHAIN_NAME = "Polygon Amoy Testnet";
export const AMOY_RPC_URL = "https://rpc-amoy.polygon.technology/";
export const AMOY_EXPLORER = "https://amoy.polygonscan.com";

export const getProvider = () => {
  if (typeof (window as any).ethereum !== "undefined") {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  return null;
};

export const checkNetwork = async (): Promise<boolean> => {
  if (typeof (window as any).ethereum === "undefined") {
    return false;
  }

  try {
    const chainId = await (window as any).ethereum.request({
      method: "eth_chainId",
    });
    
    // Check if chainId matches Amoy (0x13882 or 80002)
    return chainId === AMOY_CHAIN_ID || parseInt(chainId, 16) === AMOY_CHAIN_ID_DECIMAL;
  } catch (error) {
    console.error("Error checking network:", error);
    return false;
  }
};

export const ensureAmoyNetwork = async () => {
  const isCorrectNetwork = await checkNetwork();
  if (!isCorrectNetwork) {
    await switchToAmoy();
    // Wait a bit for the network switch to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Verify we're on the correct network now
    const verified = await checkNetwork();
    if (!verified) {
      throw new Error("Failed to switch to Polygon Amoy network. Please switch manually in your wallet.");
    }
  }
};

export const getContract = async () => {
  const provider = getProvider();
  if (!provider) throw new Error("No Web3 provider found");
  
  // Ensure we're on the correct network before getting the contract
  await ensureAmoyNetwork();
  
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const switchToAmoy = async () => {
  if (typeof (window as any).ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }

  try {
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: AMOY_CHAIN_ID }],
    });
  } catch (error: any) {
    // Chain not added, add it
    if (error.code === 4902) {
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: AMOY_CHAIN_ID,
            chainName: AMOY_CHAIN_NAME,
            nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: [AMOY_RPC_URL],
            blockExplorerUrls: [AMOY_EXPLORER],
          },
        ],
      });
    } else {
      throw error;
    }
  }
};

export const fundContract = async (amount: string) => {
  const provider = getProvider();
  if (!provider) throw new Error("No Web3 provider found");
  
  await ensureAmoyNetwork();
  
  const signer = await provider.getSigner();
  
  // Convert amount to wei (POL/MATIC has 18 decimals)
  const amountWei = ethers.parseEther(amount);
  
  // Send transaction to contract address
  const tx = await signer.sendTransaction({
    to: CONTRACT_ADDRESS,
    value: amountWei,
  });
  
  return tx;
};
