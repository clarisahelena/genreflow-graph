import { Song, Genre, GENRE_LIST } from '@/types/music';

interface SchedulerResult {
  success: boolean;
  queue: string[];
  message?: string;
  suggestions?: string[];
}

/**
 * Check if it's impossible to create a valid queue
 * Impossibility: maxGenreCount > total - maxGenreCount + 1
 */
export function checkImpossibility(songs: Song[]): { impossible: boolean; dominantGenre?: Genre; count?: number } {
  if (songs.length === 0) return { impossible: true };
  if (songs.length === 1) return { impossible: false };

  const genreCounts = getGenreCounts(songs);
  const maxCount = Math.max(...Object.values(genreCounts));
  const total = songs.length;

  // If maxGenreCount > total - maxGenreCount + 1, impossible
  // Rearranged: maxGenreCount > (total + 1) / 2
  if (maxCount > total - maxCount + 1) {
    const dominantGenre = Object.entries(genreCounts).find(([, count]) => count === maxCount)?.[0] as Genre;
    return { impossible: true, dominantGenre, count: maxCount };
  }

  return { impossible: false };
}

function getGenreCounts(songs: Song[]): Record<Genre, number> {
  const counts: Record<Genre, number> = {
    'Pop': 0,
    'Rock': 0,
    'Jazz': 0,
    'Hip-Hop': 0,
  };
  songs.forEach(song => counts[song.genre]++);
  return counts;
}

/**
 * Generate a valid queue using backtracking with heuristics
 * Heuristic: Pick from genre with highest remaining count, skip last genre
 */
export function generateQueue(songs: Song[]): SchedulerResult {
  if (songs.length === 0) {
    return { success: false, queue: [], message: 'No songs to schedule' };
  }

  if (songs.length === 1) {
    return { success: true, queue: [songs[0].id] };
  }

  const impossibility = checkImpossibility(songs);
  if (impossibility.impossible) {
    const suggestions = getSuggestions(songs, impossibility.dominantGenre);
    return {
      success: false,
      queue: [],
      message: `Unable to separate genres: ${impossibility.dominantGenre} has ${impossibility.count} songs which is too many for a ${songs.length}-song playlist`,
      suggestions,
    };
  }

  // Group songs by genre
  const songsByGenre: Record<Genre, Song[]> = {
    'Pop': [],
    'Rock': [],
    'Jazz': [],
    'Hip-Hop': [],
  };
  songs.forEach(song => songsByGenre[song.genre].push(song));

  // Create available songs map (id -> song)
  const availableSongs = new Map(songs.map(s => [s.id, s]));
  
  const result = backtrack([], null, availableSongs, songsByGenre, songs.length);
  
  if (result) {
    return { success: true, queue: result };
  }

  // Fallback: shouldn't happen if impossibility check is correct
  return {
    success: false,
    queue: [],
    message: 'Unable to find valid arrangement',
    suggestions: ['Try removing some songs from the dominant genre'],
  };
}

function backtrack(
  queue: string[],
  lastGenre: Genre | null,
  availableSongs: Map<string, Song>,
  songsByGenre: Record<Genre, Song[]>,
  totalNeeded: number
): string[] | null {
  if (queue.length === totalNeeded) {
    return queue;
  }

  // Get genres sorted by remaining count (highest first) - this is the heuristic
  const genresWithCounts = GENRE_LIST
    .map(genre => ({
      genre,
      count: songsByGenre[genre].filter(s => availableSongs.has(s.id)).length,
    }))
    .filter(g => g.count > 0 && g.genre !== lastGenre)
    .sort((a, b) => {
      // Deterministic tie-break: if counts are equal, sort alphabetically
      if (b.count === a.count) {
        return a.genre.localeCompare(b.genre);
      }
      return b.count - a.count;
    });

  for (const { genre } of genresWithCounts) {
    const candidateSongs = songsByGenre[genre]
      .filter(s => availableSongs.has(s.id))
      .sort((a, b) => a.id.localeCompare(b.id)); // Deterministic order

    for (const song of candidateSongs) {
      // Try this song
      queue.push(song.id);
      availableSongs.delete(song.id);

      const result = backtrack(queue, genre, availableSongs, songsByGenre, totalNeeded);
      if (result) return result;

      // Backtrack
      queue.pop();
      availableSongs.set(song.id, song);
    }
  }

  return null;
}

function getSuggestions(songs: Song[], dominantGenre?: Genre): string[] {
  const suggestions: string[] = [];
  
  if (dominantGenre) {
    const otherGenres = GENRE_LIST.filter(g => g !== dominantGenre);
    suggestions.push(`Add more ${otherGenres.join(' or ')} songs to balance the playlist`);
    suggestions.push(`Remove some ${dominantGenre} songs`);
  }

  return suggestions;
}

/**
 * Get candidate songs that can follow the current song
 */
export function getCandidateSongs(songs: Song[], currentSongId: string | null): Song[] {
  if (!currentSongId) return songs;
  
  const currentSong = songs.find(s => s.id === currentSongId);
  if (!currentSong) return songs;

  return songs.filter(s => s.genre !== currentSong.genre);
}

/**
 * Advance to the next song in the queue
 */
export function getNextSong(queue: string[], currentIndex: number): { nextId: string | null; nextIndex: number } {
  const nextIndex = currentIndex + 1;
  if (nextIndex >= queue.length) {
    return { nextId: null, nextIndex: -1 };
  }
  return { nextId: queue[nextIndex], nextIndex };
}
