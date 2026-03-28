import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { 
    id: 1, 
    title: "ERR_01_NEON", 
    artist: "SYS_ADMIN", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  { 
    id: 2, 
    title: "CORRUPT_WAVE", 
    artist: "UNKNOWN_ENTITY", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  { 
    id: 3, 
    title: "DATA_BREACH", 
    artist: "GHOST_IN_MACHINE", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#FF00FF] p-6 shadow-[-8px_8px_0px_#00FFFF] relative">
      <div className="absolute bottom-0 right-0 w-full h-1 bg-[#FF00FF] animate-pulse" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b-2 border-[#00FFFF] pb-2">
          <div className="flex items-center gap-2 text-[#00FFFF] font-vt text-xl">
            <span className={isPlaying ? "animate-pulse" : ""}>
              {isPlaying ? "> STREAMING" : "> OFFLINE"}
            </span>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-2 font-vt text-[#FF00FF] text-xl">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="hover:text-white transition-colors uppercase"
            >
              {isMuted || volume === 0 ? "[MUTED]" : "[VOL]"}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-20 h-2 bg-black border border-[#FF00FF] appearance-none cursor-pointer accent-[#00FFFF]"
            />
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-8 text-left">
          <h3 className="text-2xl font-pixel text-white mb-2 uppercase truncate">
            {currentTrack.title}
          </h3>
          <p className="text-[#00FFFF] font-vt text-2xl uppercase">
            SRC: {currentTrack.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div 
            className="h-4 bg-black border-2 border-[#00FFFF] cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-[#FF00FF]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 font-pixel text-sm">
          <button 
            onClick={playPrev}
            className="flex-1 py-3 bg-black text-[#00FFFF] border-2 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors uppercase"
          >
            &lt;&lt; PRV
          </button>
          
          <button 
            onClick={togglePlay}
            className="flex-1 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition-colors uppercase"
          >
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>
          
          <button 
            onClick={playNext}
            className="flex-1 py-3 bg-black text-[#FF00FF] border-2 border-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-colors uppercase"
          >
            NXT &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}
