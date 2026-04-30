import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400; // 20 cells * 20px
const TICK_RATE = 150; // ms per frame

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Direction ref to prevent rapid multiple key presses causing instant self-collision
  const dirRef = useRef(direction);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Make sure food is not on snake
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnFood([{ x: 10, y: 10 }]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dirRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dirRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dirRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dirRef.current !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check wall collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          spawnFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail if not eating
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, spawnFood]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * (CANVAS_SIZE / GRID_SIZE), 0);
        ctx.lineTo(i * (CANVAS_SIZE / GRID_SIZE), CANVAS_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * (CANVAS_SIZE / GRID_SIZE));
        ctx.lineTo(CANVAS_SIZE, i * (CANVAS_SIZE / GRID_SIZE));
        ctx.stroke();
    }

    // Draw food (Neon Pink/Fuchsia)
    const foodCellSize = CANVAS_SIZE / GRID_SIZE;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d946ef';
    ctx.fillStyle = '#d946ef';
    ctx.fillRect(food.x * foodCellSize + 2, food.y * foodCellSize + 2, foodCellSize - 4, foodCellSize - 4);
    
    // Draw snake (Neon Cyan)
    ctx.shadowColor = '#06b6d4';
    ctx.fillStyle = '#06b6d4';
    snake.forEach((segment, index) => {
        // Head gets a slightly different glow/color maybe, or just solid
        if (index === 0) {
            ctx.fillStyle = '#22d3ee'; // lighter cyan for head
            ctx.shadowBlur = 20;
        } else {
            ctx.fillStyle = '#0891b2'; // darker cyan for body
            ctx.shadowBlur = 10;
        }
        ctx.fillRect(segment.x * foodCellSize + 1, segment.y * foodCellSize + 1, foodCellSize - 2, foodCellSize - 2);
    });

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[400px] mb-4 text-cyan-400 font-mono tracking-widest text-lg px-2">
        <div>SCORE: <span className="text-white">{score}</span></div>
        <div className="text-fuchsia-400">SNAKE_OS</div>
      </div>

      <div className="relative border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-xl overflow-hidden bg-black/80 backdrop-blur">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE} 
          className="block max-w-full h-auto aspect-square"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center border-t-2 border-fuchsia-500/50">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-2 font-mono tracking-tighter">SYSTEM FAILURE</h2>
            <p className="text-gray-400 mb-6 font-mono text-sm uppercase tracking-widest">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] focus:outline-none"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
             <h2 className="text-3xl font-bold text-cyan-400 tracking-[0.3em] font-mono animate-pulse">PAUSED</h2>
          </div>
        )}
      </div>

      <div className="w-full max-w-[400px] mt-6 flex justify-between text-xs font-mono text-gray-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded border border-gray-700">W</kbd><kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded border border-gray-700">A</kbd><kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded border border-gray-700">S</kbd><kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded border border-gray-700">D</kbd> or Arrows to move</span>
        </div>
        <span><kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded border border-gray-700">SPACE</kbd> to pause</span>
      </div>
    </div>
  );
}
