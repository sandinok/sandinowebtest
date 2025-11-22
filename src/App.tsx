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
      {/* Pantalla de Carga (Se superpone a todo) */}
      <LoadingScreen onDone={() => setIsLoading(false)} />

      {/* Contenido Principal */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        className={`h-screen w-screen overflow-hidden transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        <Suspense fallback={<div className="bg-black h-full w-full" />}>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
};

export default App;
