import { useState } from 'react';
import { Library, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicStore } from '@/store/musicStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SidebarProps {
  onSelectPlaylist?: () => void;
}

export function Sidebar({ onSelectPlaylist }: SidebarProps) {
  const { playlists, currentPlaylistId, createPlaylist, deletePlaylist, selectPlaylist } = useMusicStore();
  const [playlistName, setPlaylistName] = useState('');
  const [open, setOpen] = useState(false);

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      createPlaylist(playlistName);
      setPlaylistName('');
      setOpen(false);
    }
  };

  const handleSelectPlaylist = (id: string) => {
    selectPlaylist(id);
    onSelectPlaylist?.();
  };

  return (
    <aside className="w-[27%] h-full bg-card rounded-lg flex flex-col">
      {/* Library Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Library className="w-6 h-6" />
          <span className="font-semibold">Your Library</span>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="icon-btn-circle bg-muted hover:bg-accent">
              <Plus className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Playlist name..."
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                autoFocus
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={handleCreatePlaylist}
                disabled={!playlistName.trim()}
                className="w-full"
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Playlists List */}
      <div className="flex-1 px-2 space-y-2 overflow-y-auto hide-scrollbar">
        {playlists.length === 0 ? (
          <div className="bg-secondary rounded-lg p-4 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              No playlists yet
            </p>
            <p className="text-xs text-muted-foreground">
              Click the + button to create one
            </p>
          </div>
        ) : (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`group p-3 rounded-lg cursor-pointer transition-all ${
                currentPlaylistId === playlist.id
                  ? 'bg-primary/20 border border-primary'
                  : 'bg-secondary hover:bg-accent'
              }`}
              onClick={() => handleSelectPlaylist(playlist.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate text-sm">
                    {playlist.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {playlist.playback.queue.length} songs
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(playlist.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Browse Podcasts Box */}
      <div className="px-2 pb-4">
        <div className="bg-secondary rounded-lg p-4">
          <h4 className="font-bold text-foreground text-sm mb-1">
            Let's find some podcast to follow
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            We'll keep you updated on new updates
          </p>
          <Button 
            className="bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-full px-4 py-2 h-8 text-xs transition-transform hover:scale-105"
          >
            Browse podcasts
          </Button>
        </div>
      </div>
    </aside>
  );
}
