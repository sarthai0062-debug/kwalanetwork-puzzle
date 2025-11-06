import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Coins, Lock } from "lucide-react";
import { ethers } from "ethers";

interface GameProgressProps {
  puzzlesCompleted: number;
  rewardsClaimed: number;
  bountyAmount: string;
  contractBalance: string;
  nextMilestone: { milestone: number; available: boolean };
  onClaimReward: () => void;
  isClaiming: boolean;
}

const MILESTONES = [1, 3, 5, 7];

export const GameProgress = ({
  puzzlesCompleted,
  rewardsClaimed,
  bountyAmount,
  contractBalance,
  nextMilestone,
  onClaimReward,
  isClaiming,
}: GameProgressProps) => {
  const formatEther = (wei: string) => {
    try {
      return parseFloat(ethers.formatEther(wei)).toFixed(4);
    } catch {
      return "0.0000";
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-card backdrop-blur-xl border-border/50">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {puzzlesCompleted}/7
            </div>
            <div className="text-sm text-muted-foreground mt-1">Puzzles Completed</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card backdrop-blur-xl border-border/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-game-success">
              {rewardsClaimed}/4
            </div>
            <div className="text-sm text-muted-foreground mt-1">Rewards Claimed</div>
          </div>
        </Card>
      </div>

      {/* Contract Info */}
      <Card className="p-4 bg-gradient-card backdrop-blur-xl border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Reward per Milestone</div>
            <div className="text-lg font-semibold text-game-primary flex items-center gap-1 mt-1">
              <Coins className="h-4 w-4" />
              {formatEther(bountyAmount)} MATIC
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Contract Balance</div>
            <div className="text-lg font-semibold mt-1">
              {formatEther(contractBalance)} MATIC
            </div>
          </div>
        </div>
      </Card>

      {/* Milestones */}
      <Card className="p-4 bg-gradient-card backdrop-blur-xl border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-game-accent" />
          Milestone Rewards
        </h3>
        
        <div className="space-y-2">
          {MILESTONES.map((milestone, index) => {
            const isCompleted = puzzlesCompleted >= milestone;
            const isClaimed = rewardsClaimed > index;
            const isClaimable = isCompleted && !isClaimed && nextMilestone.available && nextMilestone.milestone === milestone;

            return (
              <div
                key={milestone}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  border transition-all duration-300
                  ${isCompleted 
                    ? "border-game-primary/50 bg-game-primary/5" 
                    : "border-border/50 bg-muted/20"
                  }
                  ${isClaimable ? "animate-pulse-glow" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${isClaimed 
                        ? "bg-game-success text-white" 
                        : isCompleted
                        ? "bg-gradient-primary text-white"
                        : "bg-muted text-muted-foreground"
                      }
                    `}
                  >
                    {isClaimed ? "✓" : milestone}
                  </div>
                  <div>
                    <div className="font-medium">
                      Level {milestone} Milestone
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatEther(bountyAmount)} MATIC
                    </div>
                  </div>
                </div>

                {isClaimed ? (
                  <span className="text-game-success text-sm font-medium">Claimed</span>
                ) : isClaimable ? (
                  <Button
                    onClick={onClaimReward}
                    disabled={isClaiming}
                    size="sm"
                    className="bg-gradient-primary hover:shadow-glow"
                  >
                    {isClaiming ? "Claiming..." : "Claim"}
                  </Button>
                ) : !isCompleted ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : null}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
