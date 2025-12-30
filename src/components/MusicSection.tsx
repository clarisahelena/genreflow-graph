import { Song } from '@/types/music';
import { MusicCard } from './MusicCard';

interface MusicSectionProps {
  title: string;
  songs: Song[];
}

export function MusicSection({ title, songs }: MusicSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {songs.map((song) => (
          <MusicCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
}
