import { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import { LoadingScreen } from "./components/LoadingScreen";
import { TooltipProvider } from "@/components/ui/tooltip"; // Asegúrate que esta ruta sea correcta según tu config

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Pantalla de Carga (Se superpone a todo) */}
        <LoadingScreen onDone={() => setIsLoading(false)} />

        {/* Contenido Principal */}
        <div className={`h-screen w-screen overflow-hidden transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <BrowserRouter>
            <Suspense fallback={<div className="bg-black h-full w-full" />}>
              <Routes>
                <Route path="/" element={<Index />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;