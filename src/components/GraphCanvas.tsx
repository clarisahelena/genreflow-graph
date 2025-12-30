import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { GENRE_COLORS } from '@/types/music';

// --- Graph Topology Definition ---
// Based on graph coloring algorithm where edges only exist between different genres
// Song IDs: 1=Rock, 2,3,4,5=Pop, 6,7=Jazz, 8,9,10=Hip-Hop
// Edges: only between different genres (no Rock-Rock, Pop-Pop, Jazz-Jazz, Hip-Hop-Hip-Hop connections)
const GRAPH_LAYOUT: Record<string, { x: number; y: number; edges: string[] }> = {
  '1': { x: -280, y: 150, edges: ['2', '3', '4', '5', '6', '7', '8', '9', '10'] },  // Rock: connects to all (all different genre)
  '2': { x: -80, y: -200, edges: ['1', '6', '7', '8', '9', '10'] },                 // Pop: connects to Rock, Jazz, Hip-Hop (not 3,4,5)
  '3': { x: 80, y: 120, edges: ['1', '6', '7', '8', '9', '10'] },                   // Pop: connects to Rock, Jazz, Hip-Hop (not 2,4,5)
  '4': { x: 320, y: -200, edges: ['1', '6', '7', '8', '9', '10'] },                 // Pop: connects to Rock, Jazz, Hip-Hop (not 2,3,5)
  '5': { x: 320, y: 80, edges: ['1', '6', '7', '8', '9', '10'] },                   // Pop: connects to Rock, Jazz, Hip-Hop (not 2,3,4)
  '6': { x: -180, y: -20, edges: ['1', '2', '3', '4', '5', '8', '9', '10'] },       // Jazz: connects to Rock, Pop, Hip-Hop (not 7)
  '7': { x: 280, y: 150, edges: ['1', '2', '3', '4', '5', '8', '9', '10'] },        // Jazz: connects to Rock, Pop, Hip-Hop (not 6)
  '8': { x: 0, y: 0, edges: ['1', '2', '3', '4', '5', '6', '7'] },                  // Hip-Hop: connects to Rock, Pop, Jazz (not 9,10)
  '9': { x: 180, y: -80, edges: ['1', '2', '3', '4', '5', '6', '7'] },              // Hip-Hop: connects to Rock, Pop, Jazz (not 8,10)
  '10': { x: -280, y: -200, edges: ['1', '2', '3', '4', '5', '6', '7'] },           // Hip-Hop: connects to Rock, Pop, Jazz (not 8,9)
};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;

interface Point { x: number; y: number; }

export function GraphCanvas() {
  const { songs, playback, setCurrentSong, play } = useMusicStore();
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [neighborGlow, setNeighborGlow] = useState<Set<string>>(new Set());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<Point>({ x: 0, y: 0 });

  // Prepare nodes with fixed layout
  const graphNodes = useMemo(() => {
    return songs.map(song => {
      const layout = GRAPH_LAYOUT[song.id];
      return {
        ...song,
        x: CENTER_X + (layout?.x ?? 0),
        y: CENTER_Y + (layout?.y ?? 0),
        edges: layout?.edges ?? []
      };
    });
  }, [songs]);

  // Prepare structural edges
  const structuralEdges = useMemo(() => {
    const edges: { id: string; x1: number; y1: number; x2: number; y2: number; source: string; target: string }[] = [];
    const processed = new Set<string>();

    graphNodes.forEach(source => {
      source.edges.forEach(targetId => {
        const key = [source.id, targetId].sort().join('-');
        if (processed.has(key)) return;
        processed.add(key);

        const target = graphNodes.find(n => n.id === targetId);
        if (target) {
          edges.push({
            id: key,
            x1: source.x,
            y1: source.y,
            x2: target.x,
            y2: target.y,
            source: source.id,
            target: target.id
          });
        }
      });
    });
    return edges;
  }, [graphNodes]);

  // Played sequence - only includes songs that would actually be played (skipping invalid same-genre consecutives)
  const playedSequence = useMemo(() => {
    if (!playback.currentSongId) return [];
    const currentIndex = playback.queue.indexOf(playback.currentSongId);
    if (currentIndex === -1) return [];
    
    const fullQueue = playback.queue.slice(0, currentIndex + 1);
    
    // Filter to only valid consecutive plays (different genres)
    const validSequence = [fullQueue[0]]; // Always include first song
    for (let i = 1; i < fullQueue.length; i++) {
      const currentSongId = fullQueue[i];
      const currentSong = songs.find(s => s.id === currentSongId);
      const previousValidSongId = validSequence[validSequence.length - 1];
      const previousSong = songs.find(s => s.id === previousValidSongId);
      
      // Only add if it has a different genre than the previous valid song
      if (currentSong && previousSong && currentSong.genre !== previousSong.genre) {
        validSequence.push(currentSongId);
      }
    }
    
    return validSequence;
  }, [playback.queue, playback.currentSongId, songs]);

  const activeNodeIds = useMemo(() => new Set(playedSequence), [playedSequence]);
  
  // Get neighbors of current song
  const currentNeighbors = useMemo(() => {
    if (!playback.currentSongId) return new Set<string>();
    const currentNode = graphNodes.find(n => n.id === playback.currentSongId);
    return new Set(currentNode?.edges || []);
  }, [playback.currentSongId, graphNodes]);

  // Trigger neighbor glow effect for a brief moment
  useEffect(() => {
    setNeighborGlow(currentNeighbors);
    const timer = setTimeout(() => {
      setNeighborGlow(new Set());
    }, 600); // Brief moment of glow
    return () => clearTimeout(timer);
  }, [playback.currentSongId]);

  // Event handlers
  const handleWheel = (e: React.WheelEvent) => {
    const zoomSensitivity = 0.001;
    const newScale = Math.max(0.4, Math.min(3, transform.scale - e.deltaY * zoomSensitivity));
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-interactive')) return;
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleNodeClick = (songId: string) => {
    setCurrentSong(songId);
    play();
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-canvas-bg overflow-hidden rounded-xl border border-border cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* SVG Canvas Layer */}
      <svg
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute overflow-visible pointer-events-none"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          transition: 'transform 0s'
        }}
      >
        {/* 1. Structural Edges */}
        {structuralEdges.map(edge => (
          <line
            key={edge.id}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.15"
            strokeWidth="2"
          />
        ))}

        {/* 2. Active Path Edges (Persistent) */}
        {playedSequence.map((sourceId, i) => {
          if (i === playedSequence.length - 1) return null;
          const targetId = playedSequence[i + 1];
          
          const sourceNode = graphNodes.find(n => n.id === sourceId);
          const targetNode = graphNodes.find(n => n.id === targetId);
          if (!sourceNode || !targetNode) return null;

          return (
            <motion.line
              key={`active-${sourceId}-${targetId}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="hsl(var(--primary))"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          );
        })}

        {/* 3. Neighbor Edges (Brief glow effect) */}
        {Array.from(neighborGlow).map(neighborId => {
          const currentNode = graphNodes.find(n => n.id === playback.currentSongId);
          const neighborNode = graphNodes.find(n => n.id === neighborId);
          
          if (!currentNode || !neighborNode || activeNodeIds.has(neighborId)) return null;

          return (
            <motion.line
              key={`neighbor-${currentNode.id}-${neighborId}`}
              x1={currentNode.x}
              y1={currentNode.y}
              x2={neighborNode.x}
              y2={neighborNode.y}
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          );
        })}
      </svg>

      {/* Nodes Layer */}
      <div className="absolute inset-0 pointer-events-none" style={{
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        transformOrigin: '0 0',
        transition: 'transform 0s'
      }}>
        {graphNodes.map((node) => {
          const isActive = activeNodeIds.has(node.id);
          const isCurrent = node.id === playback.currentSongId;
          const isNeighbor = neighborGlow.has(node.id);
          const genreColor = GENRE_COLORS[node.genre];

          return (
            <motion.div
              key={node.id}
              className="node-interactive absolute pointer-events-auto flex flex-col items-center justify-center cursor-pointer"
              style={{ 
                left: node.x, 
                top: node.y,
                width: 64,
                height: 64,
                marginLeft: -32,
                marginTop: -32,
                zIndex: isActive ? 20 : isNeighbor ? 15 : 10
              }}
              onClick={() => handleNodeClick(node.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-lg"
                style={{
                  backgroundColor: isActive ? genreColor : isNeighbor ? genreColor : 'hsl(var(--muted))',
                  borderColor: isCurrent ? 'white' : isActive ? genreColor : isNeighbor ? genreColor : 'hsl(var(--border))',
                  opacity: isActive ? 1 : isNeighbor ? 0.9 : 0.5,
                  boxShadow: isCurrent ? `0 0 20px ${genreColor}` : isNeighbor ? `0 0 15px ${genreColor}80` : 'none'
                }}
                animate={{
                  scale: isCurrent ? [1, 1.05, 1] : isNeighbor ? [1, 1.08, 1] : 1,
                }}
                transition={{
                  scale: { 
                    repeat: isCurrent ? Infinity : isNeighbor ? 1 : 0,
                    duration: isCurrent ? 2 : 0.6
                  }
                }}
              >
                <span className="text-xs font-bold text-white drop-shadow-md">
                  {node.genre.slice(0, 1)}
                </span>
              </motion.div>

              {/* Label */}
              <div 
                className={`absolute top-full mt-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-opacity duration-300 pointer-events-none ${isActive ? 'bg-background/80 text-foreground opacity-100' : 'bg-background/40 text-muted-foreground opacity-50'}`}
              >
                {node.title}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-none">
        <div className="glass-panel p-2 rounded-lg text-[10px] text-muted-foreground">
          Scroll to Zoom • Drag to Pan
        </div>
      </div>
    </div>
  );
}
