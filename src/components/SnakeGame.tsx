import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 70;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      const { x, y } = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      setDirection(directionRef.current);
    };

    const gameLoop = setInterval(moveSnake, SPEED);
    return () => clearInterval(gameLoop);
  }, [food, gameOver, isPaused, generateFood, highScore]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black rounded-none border-4 border-[#00FFFF] shadow-[8px_8px_0px_#FF00FF] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00FFFF] animate-pulse" />
      
      <div className="flex justify-between w-full mb-6 px-4 font-vt text-2xl">
        <div className="flex flex-col">
          <span className="text-[#FF00FF] uppercase tracking-widest">DATA_VOL</span>
          <span className="text-4xl font-bold text-[#00FFFF]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#00FFFF] uppercase tracking-widest">MAX_VOL</span>
          <span className="text-4xl font-bold text-[#FF00FF]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#FF00FF] overflow-hidden"
        style={{
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #00FFFF 1px, transparent 1px), linear-gradient(to bottom, #00FFFF 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-[#FF00FF] animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-[#FF00FF] z-10' : 'bg-[#00FFFF]'}`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                opacity: isHead ? 1 : Math.max(0.3, 1 - index / snake.length),
              }}
            />
          );
        })}

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#FF00FF]">
            {gameOver ? (
              <>
                <h2 className="text-4xl md:text-5xl font-pixel text-white mb-4 glitch-text text-center" data-text="TERMINATED">TERMINATED</h2>
                <p className="text-[#00FFFF] mb-8 font-vt text-2xl">FINAL_VOL: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-black text-[#FF00FF] border-2 border-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-colors font-pixel text-sm uppercase"
                >
                  [ REBOOT ]
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-pixel text-white mb-8 glitch-text text-center" data-text="SNAKE.EXE">SNAKE.EXE</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-4 bg-black text-[#00FFFF] border-2 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors font-pixel text-sm uppercase"
                >
                  [ EXECUTE ]
                </button>
                <p className="text-[#FF00FF] mt-8 font-vt text-xl">INPUT: ARROWS / WASD</p>
                <p className="text-[#FF00FF] mt-2 font-vt text-xl">PAUSE: SPACEBAR</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
