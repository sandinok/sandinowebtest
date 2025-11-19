import { Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import { LoadingScreen } from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Pantalla de Carga Global */}
        {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}

        <BrowserRouter>
          <Suspense fallback={<div className="bg-black h-screen w-screen" />}>
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </Suspense>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
