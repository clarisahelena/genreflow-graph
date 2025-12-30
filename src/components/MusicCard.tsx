import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Song, GENRE_COLORS } from "@/types/music";
import { useMusicStore } from "@/store/musicStore";

interface MusicCardProps {
  song: Song;
}

export function MusicCard({ song }: MusicCardProps) {
  const { playback, setCurrentSong, play } = useMusicStore();
  const isPlaying = playback.currentSongId === song.id && playback.isPlaying;
  const isCurrent = playback.currentSongId === song.id;

  const handlePlay = () => {
    setCurrentSong(song.id);
    play();
  };

  return (
    <div
      onClick={handlePlay}
      className="
        music-card min-w-[10rem] w-40
        relative
        transition
      "
    >
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-xl
          opacity-0
          hover:opacity-100
          transition-opacity
          shadow-[0_0_20px_6px_rgba(255,255,255,0.12)]
        "
      />

      <div
        className="relative w-42 h-40 rounded-lg mb-3 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: GENRE_COLORS[song.genre] }}
      >
        <span className="text-4xl font-bold text-background/30 uppercase">
          {song.genre.slice(0, 2)}
        </span>

        <motion.button
          className="play-btn absolute bottom-2 right-2 text-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
        >
          <PlayCircle
            className="w-12 h-12 drop-shadow-lg"
            fill={isCurrent ? "hsl(var(--primary))" : "hsl(141 76% 48%)"}
            stroke="hsl(0 0% 0%)"
            strokeWidth={0.5}
          />
        </motion.button>
      </div>

      <h4
        className={`font-semibold text-sm truncate ${
          isCurrent ? "text-primary" : "text-foreground"
        }`}
      >
        {song.title}
      </h4>
      <p className="text-xs text-muted-foreground truncate mt-1">
        {song.artist} • {song.genre}
      </p>
    </div>
  );
}
