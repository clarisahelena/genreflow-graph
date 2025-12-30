import { useState } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { MusicSection } from './MusicSection';
import { GraphCanvas } from './GraphCanvas';
import { QueueView } from './QueueView';
import { PlaylistView } from './PlaylistView';
import { WarningBanner } from './WarningBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MainContentProps {
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

export function MainContent({ activeTab, onActiveTabChange }: MainContentProps) {
  const songs = useMusicStore((state) => state.songs);

  // Split songs into sections for display
  const popSongs = songs.filter(s => s.genre === 'Pop');
  const rockSongs = songs.filter(s => s.genre === 'Rock');
  const jazzSongs = songs.filter(s => s.genre === 'Jazz');
  const hiphopSongs = songs.filter(s => s.genre === 'Hip-Hop');

  return (
    <main className="flex-1 bg-card rounded-lg overflow-y-auto hide-scrollbar">
      <WarningBanner />
      
      <Tabs value={activeTab} onValueChange={onActiveTabChange} className="w-full">
        <TabsList className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 w-full justify-start gap-2 rounded-none h-auto">
          <TabsTrigger 
            value="browse" 
            className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-full px-4 py-2"
          >
            Browse
          </TabsTrigger>
          <TabsTrigger 
            value="playlists" 
            className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-full px-4 py-2"
          >
            Playlists
          </TabsTrigger>
          <TabsTrigger 
            value="graph" 
            className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-full px-4 py-2"
          >
            Graph View
          </TabsTrigger>
          <TabsTrigger 
            value="queue" 
            className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-full px-4 py-2"
          >
            Queue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="p-6 mt-0">
          <MusicSection title="Popular Songs" songs={songs} />
          {popSongs.length > 0 && <MusicSection title="Pop" songs={popSongs} />}
          {rockSongs.length > 0 && <MusicSection title="Rock" songs={rockSongs} />}
          {jazzSongs.length > 0 && <MusicSection title="Jazz" songs={jazzSongs} />}
          {hiphopSongs.length > 0 && <MusicSection title="Hip-Hop" songs={hiphopSongs} />}
        </TabsContent>

        <TabsContent value="playlists" className="mt-0">
          <PlaylistView />
        </TabsContent>

        <TabsContent value="graph" className="mt-0 h-[calc(100vh-16rem)]">
          <div className="h-full p-4">
            <GraphCanvas />
          </div>
        </TabsContent>

        <TabsContent value="queue" className="mt-0">
          <QueueView />
        </TabsContent>
      </Tabs>
    </main>
  );
}
