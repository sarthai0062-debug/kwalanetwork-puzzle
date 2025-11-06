import { useState, useEffect } from "react";
import { SlidePuzzle } from "@/components/SlidePuzzle";
import { WalletConnect } from "@/components/WalletConnect";
import { GameProgress } from "@/components/GameProgress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getContract, CONTRACT_ADDRESS, fundContract, AMOY_EXPLORER } from "@/lib/contract";
import { Sparkles, ExternalLink, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [puzzlesCompleted, setPuzzlesCompleted] = useState(0);
  const [rewardsClaimed, setRewardsClaimed] = useState(0);
  const [bountyAmount, setBountyAmount] = useState("0");
  const [contractBalance, setContractBalance] = useState("0");
  const [nextMilestone, setNextMilestone] = useState({ milestone: 0, available: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [fundAmount, setFundAmount] = useState("1");
  const [isFunding, setIsFunding] = useState(false);

  const getGridSize = (level: number) => {
    if (level <= 2) return 3; // Levels 1-2: Easy (3x3)
    if (level <= 4) return 4; // Levels 3-4: Medium (4x4)
    return 5; // Levels 5-7: Hard (5x5)
  };

  const loadContractData = async () => {
    if (!walletAddress) return;

    try {
      const contract = await getContract();
      
      const [completed, claimed, bounty, balance, milestone, finished] = await Promise.all([
        contract.puzzlesCompleted(walletAddress),
        contract.rewardsClaimedCount(walletAddress),
        contract.bountyAmount(),
        contract.getBalance(),
        contract.nextRewardMilestone(walletAddress),
        contract.hasFinishedGame(walletAddress),
      ]);

      setPuzzlesCompleted(Number(completed));
      setRewardsClaimed(Number(claimed));
      setBountyAmount(bounty.toString());
      setContractBalance(balance.toString());
      setNextMilestone({
        milestone: Number(milestone[0]),
        available: milestone[1],
      });
      setGameComplete(finished);
      
      // Set current level based on puzzles completed
      if (Number(completed) < 7) {
        setCurrentLevel(Number(completed) + 1);
      }
    } catch (error) {
      console.error("Error loading contract data:", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      loadContractData();
    }
  }, [walletAddress]);

  const handlePuzzleComplete = async () => {
    if (!walletAddress) return;

    setIsSubmitting(true);
    try {
      const contract = await getContract();
      
      toast.info("Submitting to blockchain...", {
        description: "Please confirm the transaction",
      });

      const tx = await contract.performSlide();
      
      toast.info("Transaction submitted", {
        description: "Waiting for confirmation...",
      });

      await tx.wait();
      
      toast.success("Puzzle recorded on-chain! 🎉", {
        description: "Your progress has been saved",
      });

      // Reload contract data
      await loadContractData();

      // Move to next level if not complete
      if (currentLevel < 7) {
        setCurrentLevel(currentLevel + 1);
      } else {
        setGameComplete(true);
      }
    } catch (error: any) {
      console.error("Error submitting puzzle:", error);
      toast.error("Transaction failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimReward = async () => {
    if (!walletAddress) return;

    setIsClaiming(true);
    try {
      const contract = await getContract();
      
      // Pre-flight checks before attempting to claim
      const [balance, milestone, lastUser, lastPayoutTime, payoutCooldown] = await Promise.all([
        contract.getBalance(),
        contract.nextRewardMilestone(walletAddress),
        contract.lastUser(),
        contract.lastPayoutTime(),
        contract.payoutCooldown(),
      ]);

      const contractBalance = balance.toString();
      const isEligible = milestone[1]; // available flag
      const isLastUser = lastUser.toLowerCase() === walletAddress.toLowerCase();
      const currentTime = Math.floor(Date.now() / 1000);
      const timeSinceLastPayout = currentTime - Number(lastPayoutTime);
      const cooldown = Number(payoutCooldown);

      console.log("Claim validation:", {
        contractBalance,
        isEligible,
        isLastUser,
        timeSinceLastPayout,
        cooldown,
        milestone: milestone[0].toString(),
      });

      // Check if contract has balance
      if (contractBalance === "0") {
        toast.error("Claim failed", {
          description: "Contract has no balance. The contract needs to be funded with MATIC.",
        });
        setIsClaiming(false);
        return;
      }

      // Check if user is eligible
      if (!isEligible) {
        toast.error("Claim failed", {
          description: `You are not eligible to claim yet. Complete milestone ${milestone[0]} first.`,
        });
        setIsClaiming(false);
        return;
      }

      // Check if user is the last user who performed a slide
      if (!isLastUser) {
        toast.error("Claim failed", {
          description: "You are not the last user to complete a puzzle. Only the most recent player can claim.",
        });
        setIsClaiming(false);
        return;
      }

      // Check cooldown period
      if (timeSinceLastPayout < cooldown) {
        const remainingTime = cooldown - timeSinceLastPayout;
        const minutes = Math.floor(remainingTime / 60);
        toast.error("Claim failed", {
          description: `Cooldown period active. Please wait ${minutes} more minute(s) before claiming again.`,
        });
        setIsClaiming(false);
        return;
      }
      
      toast.info("Claiming reward...", {
        description: "Please confirm the transaction",
      });

      const tx = await contract.payoutLast();
      
      toast.info("Transaction submitted", {
        description: "Processing your reward...",
      });

      await tx.wait();
      
      toast.success("Reward claimed! 🎁", {
        description: "MATIC has been sent to your wallet",
      });

      // Reload contract data
      await loadContractData();
    } catch (error: any) {
      console.error("Error claiming reward:", error);
      
      // Provide more specific error messages
      let errorMessage = error.message || "Please try again";
      
      if (error.message?.includes("Insufficient balance") || error.reason === "Insufficient balance") {
        errorMessage = "Contract has insufficient balance. The contract may need to be funded, or you may not be eligible to claim yet.";
      } else if (error.message?.includes("network") || error.message?.includes("chain")) {
        errorMessage = "Wrong network detected. Please ensure you're connected to Polygon Amoy Testnet.";
      } else if (error.code === "CALL_EXCEPTION" || error.reason) {
        errorMessage = error.reason || error.message || "Transaction failed. Please check your network connection and try again.";
      }
      
      toast.error("Claim failed", {
        description: errorMessage,
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleFundContract = async () => {
    if (!walletAddress || !fundAmount || parseFloat(fundAmount) <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount to fund the contract",
      });
      return;
    }

    setIsFunding(true);
    try {
      toast.info("Funding contract...", {
        description: "Please confirm the transaction",
      });

      const tx = await fundContract(fundAmount);
      
      toast.info("Transaction submitted", {
        description: "Waiting for confirmation...",
      });

      await tx.wait();
      
      toast.success("Contract funded! 💰", {
        description: `${fundAmount} POL has been sent to the contract`,
      });

      // Reload contract data
      await loadContractData();
      setFundAmount("1");
    } catch (error: any) {
      console.error("Error funding contract:", error);
      toast.error("Funding failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_50%)]" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-card/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Slide Bounty
                  </h1>
                  <p className="text-xs text-muted-foreground">Polygon Amoy Testnet</p>
                </div>
              </div>
              
              <WalletConnect onConnect={handleWalletConnect} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {!walletAddress ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <Card className="p-12 bg-gradient-card backdrop-blur-xl border-border/50 shadow-card">
                <Sparkles className="h-16 w-16 mx-auto mb-6 text-game-primary animate-pulse-glow" />
                <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                  Welcome to Slide Bounty
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Solve sliding puzzles and earn MATIC rewards on-chain! Complete milestones at levels 1, 3, 5, and 7 to claim your bounties.
                </p>
                <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
                  <h3 className="font-semibold mb-3 text-game-primary">How to Play:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                    <li>• Connect your wallet to get started</li>
                    <li>• Solve 7 increasingly difficult sliding puzzles</li>
                    <li>• Each completion is recorded on the blockchain</li>
                    <li>• Claim MATIC rewards at milestones (1, 3, 5, 7)</li>
                    <li>• Difficulty increases: 3x3 → 4x4 → 5x5 grids</li>
                  </ul>
                </div>
              </Card>
            </div>
          ) : gameComplete ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <Card className="p-12 bg-gradient-card backdrop-blur-xl border-border/50 shadow-card animate-slide-up">
                <div className="text-6xl mb-6">🏆</div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                  Congratulations!
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  You've completed all 7 levels! There's nothing more to achieve in this game.
                </p>
                <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
                  <div className="text-3xl font-bold text-game-success mb-2">
                    7/7 Puzzles Completed
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {rewardsClaimed}/4 Rewards Claimed
                  </div>
                  {rewardsClaimed < 4 && (
                    <p className="text-sm text-game-primary mt-4">
                      Don't forget to claim any remaining rewards!
                    </p>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr,400px] gap-6 max-w-7xl mx-auto">
              {/* Game Area */}
              <div className="space-y-4">
                <SlidePuzzle
                  gridSize={getGridSize(currentLevel)}
                  onComplete={handlePuzzleComplete}
                  level={currentLevel}
                />
                
                {isSubmitting && (
                  <Card className="p-4 bg-gradient-card backdrop-blur-xl border-border/50 text-center">
                    <div className="animate-pulse text-game-primary font-medium">
                      Recording your achievement on the blockchain...
                    </div>
                  </Card>
                )}
              </div>

              {/* Progress Panel */}
              <div className="space-y-4">
                <GameProgress
                  puzzlesCompleted={puzzlesCompleted}
                  rewardsClaimed={rewardsClaimed}
                  bountyAmount={bountyAmount}
                  contractBalance={contractBalance}
                  nextMilestone={nextMilestone}
                  onClaimReward={handleClaimReward}
                  isClaiming={isClaiming}
                />
                
                {/* Fund Contract Section */}
                <Card className="p-4 bg-gradient-card backdrop-blur-xl border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="h-5 w-5 text-game-primary" />
                    <h3 className="text-lg font-semibold">Fund Contract</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send POL (MATIC) to the contract address to enable reward payouts.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Amount (POL)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        placeholder="1.0"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                      <div className="font-mono break-all">
                        Contract: {CONTRACT_ADDRESS}
                      </div>
                    </div>
                    <Button
                      onClick={handleFundContract}
                      disabled={isFunding || !walletAddress}
                      className="w-full bg-gradient-primary hover:shadow-glow"
                    >
                      {isFunding ? "Funding..." : "Fund Contract"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`${AMOY_EXPLORER}/address/${CONTRACT_ADDRESS}`, "_blank")}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
