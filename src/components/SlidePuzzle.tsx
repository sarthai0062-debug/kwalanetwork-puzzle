import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shuffle, Trophy } from "lucide-react";
import { toast } from "sonner";

interface SlidePuzzleProps {
  gridSize: number;
  onComplete: () => void;
  level: number;
}

export const SlidePuzzle = ({ gridSize, onComplete, level }: SlidePuzzleProps) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState(gridSize * gridSize - 1);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const initializePuzzle = () => {
    const size = gridSize * gridSize;
    const solved = Array.from({ length: size }, (_, i) => i);
    let shuffled = [...solved];
    
    // Shuffle with solvable configuration
    for (let i = 0; i < 100; i++) {
      const emptyPos = shuffled.indexOf(size - 1);
      const validMoves = getValidMoves(emptyPos, gridSize);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      [shuffled[emptyPos], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyPos]];
    }
    
    setTiles(shuffled);
    setEmptyIndex(shuffled.indexOf(size - 1));
    setMoves(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initializePuzzle();
  }, [gridSize, level]);

  const getValidMoves = (emptyPos: number, size: number) => {
    const moves = [];
    const row = Math.floor(emptyPos / size);
    const col = emptyPos % size;

    if (row > 0) moves.push(emptyPos - size); // up
    if (row < size - 1) moves.push(emptyPos + size); // down
    if (col > 0) moves.push(emptyPos - 1); // left
    if (col < size - 1) moves.push(emptyPos + 1); // right

    return moves;
  };

  const handleTileClick = (index: number) => {
    if (isComplete) return;

    const validMoves = getValidMoves(emptyIndex, gridSize);
    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      
      setTiles(newTiles);
      setEmptyIndex(index);
      setMoves(moves + 1);

      // Check if solved
      const isSolved = newTiles.every((tile, i) => tile === i);
      if (isSolved) {
        setIsComplete(true);
        toast.success(`Level ${level} Complete! 🎉`, {
          description: `Completed in ${moves + 1} moves`,
        });
        setTimeout(() => onComplete(), 1500);
      }
    }
  };

  const getDifficultyColor = () => {
    if (gridSize === 3) return "from-game-success to-game-primary";
    if (gridSize === 4) return "from-game-primary to-game-secondary";
    return "from-game-secondary to-game-accent";
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-xl border-border/50 shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Level {level}
            </h3>
            <p className="text-muted-foreground text-sm">
              {gridSize === 3 ? "Beginner" : gridSize === 4 ? "Intermediate" : "Advanced"} • {moves} moves
            </p>
          </div>
          <Button
            onClick={initializePuzzle}
            variant="outline"
            size="icon"
            className="border-primary/50 hover:bg-primary/10"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>

        <div 
          className="grid gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: gridSize === 3 ? "300px" : gridSize === 4 ? "360px" : "400px",
          }}
        >
          {tiles.map((tile, index) => {
            const isEmpty = tile === gridSize * gridSize - 1;
            return (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                disabled={isEmpty || isComplete}
                className={`
                  aspect-square rounded-lg font-bold text-lg sm:text-xl
                  transition-all duration-200 transform
                  ${isEmpty 
                    ? "bg-transparent cursor-default" 
                    : `bg-gradient-to-br ${getDifficultyColor()} 
                       hover:scale-105 active:scale-95 
                       shadow-lg hover:shadow-glow
                       cursor-pointer`
                  }
                  ${isComplete ? "animate-pulse-glow" : ""}
                `}
                style={{
                  order: index,
                }}
              >
                {!isEmpty && tile + 1}
              </button>
            );
          })}
        </div>

        {isComplete && (
          <div className="flex items-center justify-center gap-2 text-game-success animate-slide-up">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold">Puzzle Solved!</span>
          </div>
        )}
      </div>
    </Card>
  );
};
