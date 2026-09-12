import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const MouseSpotlight = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useSpring(-500, { stiffness: 250, damping: 30 });
  const mouseY = useSpring(-500, { stiffness: 250, damping: 30 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden transition duration-300">
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/5 blur-3xl opacity-80 dark:opacity-60 pointer-events-none"
      />
    </div>
  );
};
