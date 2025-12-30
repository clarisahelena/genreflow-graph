import React, { useState } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Search, AlertCircle, Music } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GENRE_COLORS } from '@/types/music';

function formatDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function PlaylistView() {
  const { playlists, songs, currentPlaylistId, createPlaylist, deletePlaylist, selectPlaylist, addSongToPlaylist, removeSongFromPlaylist, searchSongs } = useMusicStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [genreWarning, setGenreWarning] = useState<{ songId: string; message: string } | null>(null);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
    }
  };

  const handleAddSong = (songId: string) => {
    if (!currentPlaylist) return;
    
    // Add the song first
    addSongToPlaylist(currentPlaylist.id, songId);
    
    // Then check for genre warning
    const lastSongId = currentPlaylist.playback.queue[currentPlaylist.playback.queue.length - 1];
    const songToAdd = songs.find(s => s.id === songId);
    const lastSong = lastSongId ? songs.find(s => s.id === lastSongId) : null;
    
    // Show warning if same genre as last song
    if (lastSong && songToAdd && lastSong.genre === songToAdd.genre) {
      setGenreWarning({
        songId,
        message: `This song is ${songToAdd.genre}. The last song in your queue is also ${lastSong.genre}. This sosecutive same genre.`,
      });
    } else {
      // Clear warning if genres are different
      setGenreWarning(null);
    }
  };

  const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
  const currentPlaylistSongs = currentPlaylist?.playback.queue
    .map(id => songs.find(s => s.id === id))
    .filter(Boolean) || [];

  const searchResults = searchQuery.trim() ? searchSongs(searchQuery) : [];
  const recommendedSongs = songs.filter(
    s => !currentPlaylist?.playback.queue.includes(s.id)
  ).slice(0, 5);

  const displaySongs = searchQuery.trim() ? searchResults : recommendedSongs;

  return (
    <div className="p-6 space-y-6">
      {/* No Playlist Selected */}
      {!currentPlaylist ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Playlist Selected</h2>
          <p className="text-muted-foreground max-w-md">
            Please select a playlist from the left sidebar to view and manage its songs.
          </p>
        </div>
      ) : (
        <>
          {/* Selected Playlist Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">{currentPlaylist.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {currentPlaylistSongs.length} song{currentPlaylistSongs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Songs in Playlist Table - Appears at Top */}
          {currentPlaylistSongs.length > 0 && (
            <div className="space-y-3 border border-border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-secondary/50 border-b border-border grid grid-cols-[40px_1fr_200px_120px_80px] gap-4 px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0">
                <div>#</div>
                <div>Title</div>
                <div>Date Added</div>
                <div>Artist</div>
                <div className="text-right">Duration</div>
              </div>

              {/* Table Body */}
              <ScrollArea className="h-[400px]">
                <div>
                  {currentPlaylistSongs.map((song, index) => (
                    <div
                      key={song.id}
                      className="grid grid-cols-[40px_1fr_200px_120px_80px] gap-4 px-4 py-3 border-b border-border hover:bg-accent/50 transition-colors group items-center"
                    >
                      <div className="text-sm text-muted-foreground">
                        {index + 1}
                      </div>
                      
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: GENRE_COLORS[song.genre] }}
                        >
                          <span className="text-xs font-bold text-background">
                            {song.genre.slice(0, 1)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {song.title}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {currentPlaylist.songAddedAt[song.id]
                          ? formatDate(currentPlaylist.songAddedAt[song.id])
                          : 'Unknown'}
                      </div>

                      <div className="text-xs text-muted-foreground truncate">
                        {song.artist}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(song.duration)}
                        </span>
                        <button
                          onClick={() => removeSongFromPlaylist(currentPlaylist.id, song.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded text-destructive transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Empty State */}
          {currentPlaylistSongs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">This playlist is empty</p>
              <p className="text-xs mt-1">Add songs using the search section below</p>
            </div>
          )}

          {/* Search and Add Songs Section */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search songs or artists to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Genre Warning */}
              {genreWarning && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-700 font-medium">Genre Warning</p>
                    <p className="text-xs text-amber-600 mt-1">{genreWarning.message}</p>
                  </div>
                  <button
                    onClick={() => setGenreWarning(null)}
                    className="text-amber-600 hover:text-amber-700 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Recommended Songs Header */}
              {!searchQuery.trim() && (
                <h4 className="text-sm font-semibold text-foreground mt-4">
                  Recommended Songs For You
                </h4>
              )}
            </div>

            {/* Songs to Add */}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 pr-4">
                {displaySongs.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    {searchQuery.trim() ? 'No songs found' : 'All songs are in the playlist!'}
                  </div>
                ) : (
                  displaySongs.map((song) => {
                    const isInPlaylist = currentPlaylist.playback.queue.includes(song.id);
                    return (
                      <div
                        key={song.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: GENRE_COLORS[song.genre] }}
                        >
                          <span className="text-xs font-bold text-background">
                            {song.genre.slice(0, 1)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {song.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {song.artist}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            if (isInPlaylist) {
                              removeSongFromPlaylist(currentPlaylist.id, song.id);
                            } else {
                              handleAddSong(song.id);
                            }
                          }}
                          variant={isInPlaylist ? 'destructive' : 'default'}
                          size="sm"
                          className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {isInPlaylist ? (
                            <>
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
