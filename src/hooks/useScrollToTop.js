import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenisInstance } from "@/App";

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true }); 
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
};

export default useScrollToTop;