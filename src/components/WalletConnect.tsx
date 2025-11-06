import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { switchToAmoy, AMOY_EXPLORER, checkNetwork, AMOY_CHAIN_ID_DECIMAL } from "@/lib/contract";

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  const updateChainId = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const chainId = await (window as any).ethereum.request({
          method: "eth_chainId",
        });
        setCurrentChainId(parseInt(chainId, 16));
      } catch (error) {
        console.error("Error getting chain ID:", error);
      }
    }
  };

  useEffect(() => {
    checkConnection();
    updateChainId();
    
    if (typeof (window as any).ethereum !== "undefined") {
      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
      (window as any).ethereum.on("chainChanged", () => {
        updateChainId();
        window.location.reload();
      });
    }

    return () => {
      if (typeof (window as any).ethereum !== "undefined") {
        (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
    } else {
      const newAddress = accounts[0];
      setAddress(newAddress);
      onConnect(newAddress);
    }
  };

  const checkConnection = async () => {
    if (typeof (window as any).ethereum === "undefined") return;

    try {
      const accounts = await (window as any).ethereum.request({ 
        method: "eth_accounts" 
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const connectWallet = async () => {
    if (typeof (window as any).ethereum === "undefined") {
      toast.error("MetaMask not detected", {
        description: "Please install MetaMask to play this game",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Switch to Amoy network
      await switchToAmoy();

      // Request accounts
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      setAddress(accounts[0]);
      onConnect(accounts[0]);
      
      toast.success("Wallet Connected!", {
        description: "You're ready to play on Polygon Amoy",
      });
    } catch (error: any) {
      console.error("Connection error:", error);
      toast.error("Connection Failed", {
        description: error.message || "Failed to connect wallet",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (address) {
    const isCorrectNetwork = currentChainId === AMOY_CHAIN_ID_DECIMAL;
    
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 rounded-lg bg-gradient-card backdrop-blur-xl border border-primary/30">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-game-success' : 'bg-red-500'} animate-pulse`} />
            <span className="font-mono text-sm">{formatAddress(address)}</span>
            {!isCorrectNetwork && (
              <span className="text-xs text-red-500 ml-2">Wrong Network</span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(`${AMOY_EXPLORER}/address/${address}`, "_blank")}
          className="hover:bg-primary/10"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};
