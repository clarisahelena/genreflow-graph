import { motion } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { GENRE_COLORS } from '@/types/music';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle,
  Volume2,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function PlaybackControls() {
  const { songs, playback, play, pause, next, previous, generateNewQueue } = useMusicStore();
  
  const currentSong = songs.find(s => s.id === playback.currentSongId);
  const currentIndex = playback.queue.indexOf(playback.currentSongId || '');
  const hasNext = currentIndex < playback.queue.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel border-t border-border p-4"
    >
      <div className="max-w-6xl mx-auto flex items-center gap-6">
        {/* Current Song Info */}
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
                <Music className="w-7 h-7 text-background" />
              </motion.div>
              <div className="min-w-0">
                <motion.p 
                  key={`title-${currentSong.id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-semibold text-foreground truncate"
                >
                  {currentSong.title}
                </motion.p>
                <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
                <p 
                  className="text-[10px] font-medium"
                  style={{ color: GENRE_COLORS[currentSong.genre] }}
                >
                  {currentSong.genre}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                <Music className="w-7 h-7" />
              </div>
              <p className="text-sm">No song selected</p>
            </div>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={generateNewQueue}
              className="text-muted-foreground hover:text-foreground"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={previous}
              disabled={!hasPrevious}
              className="text-foreground disabled:opacity-30"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button 
              size="icon"
              onClick={playback.isPlaying ? pause : play}
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {playback.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={next}
              disabled={!hasNext}
              className="text-foreground disabled:opacity-30"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={generateNewQueue}
              className="ml-2 text-xs"
            >
              Generate Queue
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-10 text-right">0:00</span>
            <Slider
              value={[playback.progress]}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {currentSong ? `${Math.floor(currentSong.duration / 60)}:${(currentSong.duration % 60).toString().padStart(2, '0')}` : '0:00'}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            defaultValue={[80]}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>
    </motion.div>
  );
}
