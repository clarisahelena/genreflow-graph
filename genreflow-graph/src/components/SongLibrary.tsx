import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { GENRE_COLORS, GENRE_LIST, Genre } from '@/types/music';
import { Plus, Music, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function SongLibrary() {
  const { songs, addSong, removeSong } = useMusicStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState<Genre>('Pop');
  const [duration, setDuration] = useState('180');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    addSong({
      title: title.trim(),
      artist: artist.trim(),
      genre,
      duration: parseInt(duration) || 180,
    });

    setTitle('');
    setArtist('');
    setGenre('Pop');
    setDuration('180');
    setIsOpen(false);
  };

  // Group songs by genre
  const songsByGenre = GENRE_LIST.reduce((acc, g) => {
    acc[g] = songs.filter(s => s.genre === g);
    return acc;
  }, {} as Record<Genre, typeof songs>);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Library</h2>
          <p className="text-sm text-muted-foreground">{songs.length} songs</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Add Song
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Song</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Song title"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Artist name"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select value={genre} onValueChange={(v) => setGenre(v as Genre)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRE_LIST.map((g) => (
                      <SelectItem key={g} value={g}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: GENRE_COLORS[g] }}
                          />
                          {g}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="180"
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full">
                Add to Library
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {GENRE_LIST.map((g) => (
            <div key={g}>
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: GENRE_COLORS[g] }}
                />
                <h3 className="text-sm font-semibold text-foreground">{g}</h3>
                <span className="text-xs text-muted-foreground">({songsByGenre[g].length})</span>
              </div>
              
              <AnimatePresence mode="popLayout">
                {songsByGenre[g].length === 0 ? (
                  <p className="text-xs text-muted-foreground pl-5">No songs</p>
                ) : (
                  <div className="space-y-1">
                    {songsByGenre[g].map((song) => (
                      <motion.div
                        key={song.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-card hover:bg-accent transition-colors group"
                      >
                        <div 
                          className="w-8 h-8 rounded flex items-center justify-center"
                          style={{ backgroundColor: `${GENRE_COLORS[g]}30` }}
                        >
                          <Music className="w-4 h-4" style={{ color: GENRE_COLORS[g] }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeSong(song.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
