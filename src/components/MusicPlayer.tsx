import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Pulse (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Dreams (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Grid Runner (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TRACKS[currentTrackIndex].url);
      audioRef.current.loop = false;
      audioRef.current.volume = 0.5;
    } else {
      audioRef.current.src = TRACKS[currentTrackIndex].url;
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      handleSkip();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(e => console.log("Auto-play prevented", e));
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Play prevented", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-black/60 backdrop-blur-md border border-fuchsia-500/50 rounded-xl p-6 shadow-[0_0_30px_rgba(217,70,239,0.15)] flex flex-col items-center gap-4 relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-fuchsia-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-cyan-600/20 blur-3xl rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 z-10 w-full mb-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.5)] animate-[spin_10s_linear_infinite]"
             style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
          <div className="w-4 h-4 bg-black rounded-full" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-mono text-sm tracking-widest text-fuchsia-300 truncate">NOW PLAYING</h3>
          <p className="font-sans text-white font-medium truncate">{TRACKS[currentTrackIndex].title}</p>
        </div>
        <Volume2 className="w-5 h-5 text-cyan-400" />
      </div>

      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden z-10">
        <div 
          className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-6 z-10 mt-2">
        <button 
          onClick={handlePrev}
          className="p-2 text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-fuchsia-500/10 border border-fuchsia-500 flex items-center justify-center text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all focus:outline-none"
        >
          {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
        </button>
        
        <button 
          onClick={handleSkip}
          className="p-2 text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
