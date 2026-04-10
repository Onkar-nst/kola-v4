import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "@/components/Navbar";
import Lenis from "@studio-freight/lenis";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectPage = lazy(() => import("./pages/ProjectsPage"));

import ScrollToTopWrapper from "@/components/ScrollToTopWrapper";
import ProjectPageLoader from "./components/Projectpageloader";

const queryClient = new QueryClient();

export let lenisInstance = null;

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <ScrollToTopWrapper>
            <SmoothScroll>
              <Navbar />

              <Suspense fallback={<ProjectPageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/project/:slug" element={<ProjectPage />} />
                </Routes>
              </Suspense>
            </SmoothScroll>
          </ScrollToTopWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
