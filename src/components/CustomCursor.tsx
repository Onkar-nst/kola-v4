import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setVisible(true);
    };

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    const animate = () => {
      const speed = 0.06; // 👈 SUPER slow & smooth

      current.current.x += (mouse.current.x - current.current.x) * speed;
      current.current.y += +(mouse.current.y - current.current.y) * speed;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[50]
                 w-3 h-3 rounded-full
                 -translate-x-1/2 -translate-y-1/2
                 bg-black/70 backdrop-blur-[10px]"
    />
  );
};

export default CustomCursor;