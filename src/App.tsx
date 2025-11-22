import { Suspense, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { LoadingScreen } from "./components/LoadingScreen";

const queryClient = new QueryClient();


const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Pantalla de Carga Global */}
      {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}

      {/* Global SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="liquid-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="1" result="warp" />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
          </filter>
        </defs>
      </svg>

      <Suspense fallback={<div className="bg-black h-screen w-screen" />}>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;
