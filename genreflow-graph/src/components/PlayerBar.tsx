import { motion } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { GENRE_COLORS } from '@/types/music';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle,
  Repeat,
  Volume2,
  Music
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export function PlayerBar() {
  const { songs, playback, play, pause, next, previous, generateNewQueue } = useMusicStore();
  const [volume, setVolume] = useState(80);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  
  const currentSong = songs.find(s => s.id === playback.currentSongId);
  const currentIndex = playback.queue.indexOf(playback.currentSongId || '');
  const hasNext = currentIndex < playback.queue.length - 1;
  const hasPrevious = currentIndex > 0;

  const handleShuffle = () => {
    setIsShuffleActive(!isShuffleActive);
    generateNewQueue();
  };

  return (
    <div className="bg-background h-20 flex items-center justify-between px-4 border-t border-border/50">
      {/* Now Playing Info */}
      <div className="flex items-center gap-3 w-64">
        {currentSong ? (
          <>
            <motion.div 
              key={currentSong.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: GENRE_COLORS[currentSong.genre] }}
            >
              <Music className="w-6 h-6 text-background" />
            </motion.div>
            <div className="min-w-0">
              <motion.p 
                key={`title-${currentSong.id}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-foreground truncate"
              >
                {currentSong.title}
              </motion.p>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm">No song playing</p>
              <p className="text-xs">Select a song to play</p>
            </div>
          </div>
        )}
      </div>

      {/* Music Controller */}
      <div className="flex flex-col items-center flex-1 max-w-xl">
        {/* Player Buttons */}
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={handleShuffle}
            className={`transition-all duration-200 ${isShuffleActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          
          <button 
            onClick={previous}
            disabled={!hasPrevious}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all duration-200"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={playback.isPlaying ? pause : play}
            className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform"
          >
            {playback.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <button 
            onClick={next}
            disabled={!hasNext}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all duration-200"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsRepeatActive(!isRepeatActive)}
            className={`transition-all duration-200 ${isRepeatActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-10 text-right">0:00</span>
          <div className="flex-1 relative group">
            <Slider
              value={[playback.progress]}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
          <span className="text-[10px] text-muted-foreground w-10">
            {currentSong ? `${Math.floor(currentSong.duration / 60)}:${(currentSong.duration % 60).toString().padStart(2, '0')}` : '0:00'}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 w-32">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <Slider
          value={[volume]}
          onValueChange={(value) => setVolume(value[0])}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>
    </div>
  );
}
