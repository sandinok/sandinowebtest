import React, { Suspense } from 'react';
import { OceanBackground } from '../components/OceanBackground';
import { MainTitle } from '../components/MainTitle';
import { GlassDock } from '../components/GlassDock';
import { WindowManager } from '../components/WindowManager';
import { MusicPlayer } from '../components/MusicPlayer';
import { LoadingScreen } from '../components/LoadingScreen';
import { WindowProvider } from '../context/WindowContext';
import { SoundProvider } from '../context/SoundContext';

const Fallback: React.FC = () => <div className="fixed inset-0" aria-hidden />;

const Index: React.FC = () => {
  return (
    <SoundProvider>
      <WindowProvider>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-emerald-900">
          {/* Non-blocking loading overlay (auto-dismiss ≤800ms or on first interaction) */}
          <LoadingScreen maxDurationMs={800} />

          {/* Background and main UI render immediately to avoid delaying LCP */}
          <OceanBackground />
          <main id="main-content" role="main" className="relative min-h-screen">
            <Suspense fallback={<Fallback />}>
              <MainTitle />
              <GlassDock />
              <WindowManager />
              <MusicPlayer />
            </Suspense>
          </main>
        </div>
      </WindowProvider>
    </SoundProvider>
  );
};

export default Index;
