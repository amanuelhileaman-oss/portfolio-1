import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { IridescentSphere } from './ui/IridescentSphere';

const Hero = ({ bio }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleScrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const floatingBadges = [
    { name: 'React', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-500 dark:text-cyan-400', y: [-6, 6, -6], delay: 0 },
    { name: 'PostgreSQL', color: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30 text-blue-500 dark:text-blue-400', y: [6, -6, 6], delay: 1 },
    { name: 'Node.js', color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-500 dark:text-emerald-400', y: [-5, 5, -5], delay: 0.5 },
    { name: 'Express.js', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-500 dark:text-purple-400', y: [5, -5, 5], delay: 1.5 },
    { name: 'Tailwind CSS', color: 'from-sky-500/20 to-teal-500/20 border-sky-500/30 text-sky-500 dark:text-sky-400', y: [-4, 4, -4], delay: 0.8 },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
      
      {/* 3D Cinematic Interactive Background Sphere */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-background animate-pulse" />}>
          <IridescentSphere />
        </Suspense>
      </div>

      {/* Subtle background decorative watermark */}
      <div className="absolute left-0 bottom-16 sm:bottom-32 -rotate-45 origin-bottom-left opacity-5 dark:opacity-10 pointer-events-none select-none z-0">
        <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-widest text-foreground whitespace-nowrap">
          PORTFOLIO
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 pointer-events-none gap-8"
      >
        {/* LEFT COLUMN: Name and Title */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left pointer-events-auto">
          {/* Available for work badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <Badge variant="outline" className="px-3.5 py-1 text-xs sm:text-sm gap-2 border-primary/30 bg-primary/5 dark:bg-primary/10 backdrop-blur-md rounded-full text-foreground shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Open to Opportunities & Collaborations</span>
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4 tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent block">
              {bio?.name || 'Amanuel Hailie'}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl font-semibold text-muted-foreground mb-6"
          >
            {bio?.title || 'Full-Stack Developer (PERN Stack Specialist)'}
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-6"
          >
            {floatingBadges.map((badge, idx) => (
              <div
                key={badge.name}
                className={`px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full border bg-gradient-to-r backdrop-blur-md shadow-sm ${badge.color}`}
              >
                {badge.name}
              </div>
            ))}
          </motion.div>
        </div>

        {/* CENTER COLUMN: Spacer for the 3D Sphere so it's not covered by text */}
        <div className="hidden md:block w-full md:w-1/3 h-[400px]"></div>

        {/* RIGHT COLUMN: Description and Actions */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-end text-center md:text-right pointer-events-auto">
          {/* Profile Image (Smaller, stylized) */}
          {bio?.image_url && (
            <motion.div variants={itemVariants} className="mb-6">
              <div className="relative group inline-block">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full blur-lg opacity-50 transition duration-500 group-hover:opacity-100"></div>
                <img
                  src={bio.image_url}
                  alt={bio.name || 'Profile'}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-background shadow-xl"
                />
              </div>
            </motion.div>
          )}

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-foreground/80 mb-8 max-w-sm leading-relaxed"
          >
            {bio?.description || 'Computer Science graduate passionate about building modern web applications with PostgreSQL, Express, React, and Node.js.'}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 w-full justify-center md:justify-end"
          >
            {bio?.cv_link && (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 rounded-xl font-medium w-full sm:w-auto"
              >
                <a href={bio.cv_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>View CV</span>
                </a>
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={handleScrollToProjects}
              className="rounded-xl font-medium border-border/80 hover:bg-accent/80 transition-all duration-300 hover:scale-105 gap-2 w-full sm:w-auto"
            >
              <span>Explore Work</span>
              <ArrowDown className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;