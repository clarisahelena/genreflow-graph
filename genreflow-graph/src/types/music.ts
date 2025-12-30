export type Genre = 'Pop' | 'Rock' | 'Jazz' | 'Hip-Hop';

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  duration: number; // in seconds
}

export interface GraphNode {
  id: string;
  song: Song;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface PlaybackState {
  currentSongId: string | null;
  isPlaying: boolean;
  progress: number;
  queue: string[];
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: number;
  playback: PlaybackState;
  songAddedAt: Record<string, number>; // Track when each song was added to playlist
}

export const GENRE_COLORS: Record<Genre, string> = {
  'Pop': '#F94144',
  'Rock': '#577590',
  'Jazz': '#90BE6D',
  'Hip-Hop': '#F9C74F',
};

export const GENRE_LIST: Genre[] = ['Pop', 'Rock', 'Jazz', 'Hip-Hop'];

