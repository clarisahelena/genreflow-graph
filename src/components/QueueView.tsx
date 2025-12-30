import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { GENRE_COLORS } from '@/types/music';
import { Music } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function QueueView() {
  const { songs, playback, setCurrentSong, play } = useMusicStore();
  
  const queueSongs = playback.queue
    .map(id => songs.find(s => s.id === id))
    .filter(Boolean);

  const currentIndex = playback.queue.indexOf(playback.currentSongId || '');

  const handleSongClick = (songId: string) => {
    setCurrentSong(songId);
    play();
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Queue</h2>
          <p className="text-sm text-muted-foreground">
            {queueSongs.length} songs • No consecutive same genre
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {queueSongs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <Music className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No songs in queue</p>
                <p className="text-xs">Add songs to a playlist to create a queue</p>
              </motion.div>
            ) : (
              queueSongs.map((song, index) => {
                if (!song) return null;
                const isCurrent = song.id === playback.currentSongId;
                const isPast = index < currentIndex;

                return (
                  <motion.div
                    key={song.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    onClick={() => handleSongClick(song.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer
                      transition-all duration-200
                      ${isCurrent 
                        ? 'bg-accent border border-primary/40' 
                        : isPast 
                        ? 'bg-secondary/50 opacity-50' 
                        : 'hover:bg-accent'
                      }
                    `}
                  >
                    <span className={`
                      w-6 text-center text-sm font-medium
                      ${isCurrent ? 'text-primary' : 'text-muted-foreground'}
                    `}>
                      {index + 1}
                    </span>

                    <div 
                      className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: GENRE_COLORS[song.genre] }}
                    >
                      <Music className="w-5 h-5 text-background" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {song.artist}
                      </p>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
