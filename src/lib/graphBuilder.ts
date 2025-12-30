import { Song, GraphNode, GraphEdge } from '@/types/music';

/**
 * Build graph nodes with circular layout
 */
export function buildNodes(songs: Song[]): GraphNode[] {
  const centerX = 400;
  const centerY = 300;
  const radius = Math.min(250, 80 + songs.length * 15);

  return songs.map((song, index) => {
    const angle = (2 * Math.PI * index) / songs.length - Math.PI / 2;
    return {
      id: song.id,
      song,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
    };
  });
}

/**
 * Build edges between songs of the same genre (conflict edges)
 */
export function buildEdges(songs: Song[]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  
  for (let i = 0; i < songs.length; i++) {
    for (let j = i + 1; j < songs.length; j++) {
      if (songs[i].genre === songs[j].genre) {
        edges.push({
          id: `${songs[i].id}-${songs[j].id}`,
          source: songs[i].id,
          target: songs[j].id,
        });
      }
    }
  }

  return edges;
}
