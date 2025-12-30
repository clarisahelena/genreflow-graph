import { create } from 'zustand';
import { Song, PlaybackState, Genre, Playlist } from '@/types/music';
import { seedSongs } from '@/data/seedSongs';
import { generateQueue, getCandidateSongs } from '@/lib/scheduler';

interface MusicStore {
  songs: Song[];
  playback: PlaybackState;
  playlists: Playlist[];
  currentPlaylistId: string | null;
  warning: string | null;
  suggestions: string[];
  
  // Actions
  addSong: (song: Omit<Song, 'id'>) => void;
  removeSong: (id: string) => void;
  generateNewQueue: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setCurrentSong: (id: string) => void;
  getCandidates: () => Song[];
  clearWarning: () => void;
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  selectPlaylist: (id: string) => void;
  savePlaylist: () => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  searchSongs: (query: string) => Song[];
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  songs: seedSongs,
  playback: {
    currentSongId: null,
    isPlaying: false,
    progress: 0,
    queue: [],
  },
  playlists: [],
  currentPlaylistId: null,
  warning: null,
  suggestions: [],

  addSong: (songData) => {
    const newSong: Song = {
      ...songData,
      id: Date.now().toString(),
    };
    set((state) => ({
      songs: [...state.songs, newSong],
    }));
    get().generateNewQueue();
  },

  removeSong: (id) => {
    set((state) => ({
      songs: state.songs.filter(s => s.id !== id),
    }));
    get().generateNewQueue();
  },

  generateNewQueue: () => {
    const { songs } = get();
    const result = generateQueue(songs);
    
    if (result.success) {
      set({
        playback: {
          ...get().playback,
          queue: result.queue,
          currentSongId: result.queue[0] || null,
        },
        warning: null,
        suggestions: [],
      });
    } else {
      set({
        warning: result.message || 'Unable to generate queue',
        suggestions: result.suggestions || [],
        playback: {
          ...get().playback,
          queue: [],
          currentSongId: null,
        },
      });
    }
  },

  play: () => {
    const { playback, songs } = get();
    if (!playback.currentSongId && songs.length > 0) {
      get().generateNewQueue();
    }
    set((state) => ({
      playback: { ...state.playback, isPlaying: true },
    }));
  },

  pause: () => {
    set((state) => ({
      playback: { ...state.playback, isPlaying: false },
    }));
  },

  next: () => {
    const { playback, songs } = get();
    const currentIndex = playback.queue.indexOf(playback.currentSongId || '');
    const currentSong = songs.find(s => s.id === playback.currentSongId);
    
    // Find the next valid song (skip consecutive same genres)
    let nextIndex = currentIndex + 1;
    while (nextIndex < playback.queue.length) {
      const nextSongId = playback.queue[nextIndex];
      const nextSong = songs.find(s => s.id === nextSongId);
      
      // Check if next song has different genre
      if (nextSong && currentSong && nextSong.genre !== currentSong.genre) {
        break;
      }
      nextIndex++;
    }
    
    if (nextIndex < playback.queue.length) {
      set({
        playback: {
          ...playback,
          currentSongId: playback.queue[nextIndex],
          progress: 0,
        },
      });
    } else {
      set({
        playback: {
          ...playback,
          isPlaying: false,
          progress: 0,
        },
      });
    }
  },

  previous: () => {
    const { playback, songs } = get();
    const currentIndex = playback.queue.indexOf(playback.currentSongId || '');
    const currentSong = songs.find(s => s.id === playback.currentSongId);
    
    // Find the previous valid song (skip consecutive same genres)
    let prevIndex = currentIndex - 1;
    while (prevIndex >= 0) {
      const prevSongId = playback.queue[prevIndex];
      const prevSong = songs.find(s => s.id === prevSongId);
      
      // Check if previous song has different genre
      if (prevSong && currentSong && prevSong.genre !== currentSong.genre) {
        break;
      }
      prevIndex--;
    }
    
    if (prevIndex >= 0) {
      set({
        playback: {
          ...playback,
          currentSongId: playback.queue[prevIndex],
          progress: 0,
        },
      });
    }
  },

  setCurrentSong: (id) => {
    set((state) => ({
      playback: {
        ...state.playback,
        currentSongId: id,
        progress: 0,
      },
    }));
  },

  getCandidates: () => {
    const { songs, playback } = get();
    return getCandidateSongs(songs, playback.currentSongId);
  },

  clearWarning: () => {
    set({ warning: null, suggestions: [] });
  },

  createPlaylist: (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      playback: {
        currentSongId: null,
        isPlaying: false,
        progress: 0,
        queue: [],
      },
      songAddedAt: {},
    };
    set((state) => ({
      playlists: [...state.playlists, newPlaylist],
      currentPlaylistId: newPlaylist.id,
      playback: newPlaylist.playback,
    }));
  },

  deletePlaylist: (id: string) => {
    set((state) => {
      const updated = state.playlists.filter(p => p.id !== id);
      return {
        playlists: updated,
        currentPlaylistId: state.currentPlaylistId === id ? (updated[0]?.id || null) : state.currentPlaylistId,
      };
    });
  },

  selectPlaylist: (id: string) => {
    const { playlists } = get();
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      set({
        currentPlaylistId: id,
        playback: playlist.playback,
      });
    }
  },

  savePlaylist: () => {
    const { currentPlaylistId, playback, playlists } = get();
    if (currentPlaylistId) {
      const updatedPlaylists = playlists.map(p =>
        p.id === currentPlaylistId ? { ...p, playback } : p
      );
      set({ playlists: updatedPlaylists });
    }
  },

  addSongToPlaylist: (playlistId: string, songId: string) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map(p => {
        if (p.id === playlistId) {
          // Add song to queue if not already there
          const newQueue = p.playback.queue.includes(songId)
            ? p.playback.queue
            : [...p.playback.queue, songId];
          
          // Track when the song was added
          const newSongAddedAt = { ...p.songAddedAt };
          if (!p.playback.queue.includes(songId)) {
            newSongAddedAt[songId] = Date.now();
          }
          
          return {
            ...p,
            playback: {
              ...p.playback,
              queue: newQueue,
              currentSongId: p.playback.currentSongId || newQueue[0] || null,
            },
            songAddedAt: newSongAddedAt,
          };
        }
        return p;
      });
      
      // Update current playback if this is the active playlist
      if (state.currentPlaylistId === playlistId) {
        const updatedPlaylist = updatedPlaylists.find(p => p.id === playlistId);
        if (updatedPlaylist) {
          return { playlists: updatedPlaylists, playback: updatedPlaylist.playback };
        }
      }
      
      return { playlists: updatedPlaylists };
    });
  },

  removeSongFromPlaylist: (playlistId: string, songId: string) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map(p => {
        if (p.id === playlistId) {
          const newQueue = p.playback.queue.filter(id => id !== songId);
          const nextCurrentId = p.playback.currentSongId === songId
            ? newQueue[0] || null
            : p.playback.currentSongId;
          
          // Remove the song's addition timestamp
          const newSongAddedAt = { ...p.songAddedAt };
          delete newSongAddedAt[songId];
          
          return {
            ...p,
            playback: {
              ...p.playback,
              queue: newQueue,
              currentSongId: nextCurrentId,
            },
            songAddedAt: newSongAddedAt,
          };
        }
        return p;
      });
      
      if (state.currentPlaylistId === playlistId) {
        const updatedPlaylist = updatedPlaylists.find(p => p.id === playlistId);
        if (updatedPlaylist) {
          return { playlists: updatedPlaylists, playback: updatedPlaylist.playback };
        }
      }
      
      return { playlists: updatedPlaylists };
    });
  },

  searchSongs: (query: string) => {
    const { songs } = get();
    const lowerQuery = query.toLowerCase();
    return songs.filter(song =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.genre.toLowerCase().includes(lowerQuery)
    );
  },
}));

