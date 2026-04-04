import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "@/components/Navbar";

/* 🔥 LENIS */
import Lenis from "@studio-freight/lenis";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

/* 🔥 LENIS WRAPPER COMPONENT */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>

        {/* ✅ SMOOTH SCROLL WRAP */}
        <SmoothScroll>

          {/* NAVBAR */}
          <Navbar />

          {/* ROUTES */}
          <Suspense
            fallback={
              <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

        </SmoothScroll>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;