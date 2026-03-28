import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-vt overflow-hidden relative flex flex-col items-center justify-center p-4 md:p-8">
      {/* CRT & Static Effects */}
      <div className="absolute inset-0 bg-static pointer-events-none z-0" />
      <div className="crt-overlay" />
      <div className="scanline" />

      {/* Header */}
      <header className="z-10 mb-8 text-center">
        <h1 
          className="text-4xl md:text-6xl font-pixel tracking-tighter text-white glitch-text uppercase"
          data-text="SYS_OVERRIDE"
        >
          SYS_OVERRIDE
        </h1>
        <p className="text-[#00FFFF] font-vt text-2xl mt-4 tracking-widest uppercase bg-black/80 inline-block px-4 py-1 border border-[#FF00FF]">
          [ PROTOCOL: GLITCH_SNAKE_AUDIO ]
        </p>
      </header>

      {/* Main Content */}
      <main className="z-10 flex flex-col xl:flex-row items-center justify-center gap-12 w-full max-w-6xl">
        {/* Game Area */}
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>

        {/* Player Area */}
        <div className="w-full xl:w-auto flex justify-center xl:justify-start">
          <MusicPlayer />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="z-10 mt-12 text-[#FF00FF] font-vt text-xl text-center bg-black/90 px-6 py-2 border-t-2 border-[#00FFFF]">
        <p>INPUT_REQUIRED: KEYBOARD_ARROWS // AUDIO_INTERFACE_ACTIVE</p>
        <p className="mt-1 opacity-70 animate-pulse">AWAITING_COMMAND...</p>
      </footer>
    </div>
  );
}
