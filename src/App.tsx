import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden flex flex-col relative selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-900/20 blur-[150px] rounded-full mix-blend-screen" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Header */}
      <header className="w-full p-6 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse" />
          <h1 className="text-xl font-black tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Synapse_Link
          </h1>
        </div>
        <div className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
          Sys.Status: <span className="text-cyan-400 ml-1">Online</span>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 border-x border-white/5 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* Left Side - Music Player */}
        <div className="w-full lg:w-[400px] flex flex-col items-center justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              NEON <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">DRIFTER</span>
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto xl:mx-0">
              Engage the grid. Survive the latency. Let the synthetic rhythms guide your path.
            </p>
          </div>
          <MusicPlayer />
        </div>

        {/* Right Side - Snake Game */}
        <div className="flex-1 flex justify-center w-full">
          <div className="relative group">
            {/* Ambient glow behind the game */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative p-4 sm:p-8 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-[100vw] overflow-hidden">
              <SnakeGame />
            </div>
          </div>
        </div>

      </main>

      <footer className="w-full p-6 text-center text-xs font-mono text-zinc-600 relative z-10">
        © 2077 // ARTIFICIAL.INTELLIGENCE.CORPORATION // V.1.0.4
      </footer>
    </div>
  );
}
