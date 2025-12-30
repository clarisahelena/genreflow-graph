import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { PlayerBar } from '@/components/PlayerBar';
import { useMusicStore } from '@/store/musicStore';

const Index = () => {
  const generateNewQueue = useMusicStore((state) => state.generateNewQueue);
  const [activeTab, setActiveTab] = useState('browse');

  // Generate initial queue on mount
  useEffect(() => {
    generateNewQueue();
  }, [generateNewQueue]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar onSelectPlaylist={() => setActiveTab('playlists')} />
        
        {/* Main Content */}
        <MainContent activeTab={activeTab} onActiveTabChange={setActiveTab} />
      </div>

      {/* Player Bar */}
      <PlayerBar />
    </div>
  );
};

export default Index;
