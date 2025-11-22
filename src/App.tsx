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

      <div onContextMenu={(e) => e.preventDefault()} className="h-screen w-screen overflow-hidden">
        <Suspense fallback={<div className="bg-black h-screen w-screen" />}>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
};

export default App;
