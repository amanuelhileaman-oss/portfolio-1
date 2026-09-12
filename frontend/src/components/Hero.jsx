import { motion } from 'framer-motion';
import { Download, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
      {/* Dynamic ambient glowing background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.28, 0.15],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.24, 0.12],
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-gradient-to-tl from-indigo-500/35 via-blue-600/25 to-teal-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Subtle background decorative watermark */}
      <div className="absolute left-0 bottom-16 sm:bottom-32 -rotate-45 origin-bottom-left opacity-5 dark:opacity-10 pointer-events-none select-none">
        <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-widest text-foreground whitespace-nowrap">
          PORTFOLIO
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        {/* Available for work badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <Badge variant="outline" className="px-3.5 py-1 text-xs sm:text-sm gap-2 border-primary/30 bg-primary/5 dark:bg-primary/10 backdrop-blur-md rounded-full text-foreground shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Open to Opportunities & Collaborations</span>
          </Badge>
        </motion.div>

        {/* Profile Image with modern glowing ring */}
        {bio?.image_url && (
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
              <img
                src={bio.image_url}
                alt={bio.name || 'Profile'}
                className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </motion.div>
        )}

        {/* Floating tech orbital badges (movable smart interactive animation) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 mb-6"
        >
          {floatingBadges.map((badge, idx) => (
            <motion.div
              key={badge.name}
              animate={{ y: badge.y }}
              transition={{
                duration: 4 + idx * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: badge.delay,
              }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 text-xs font-semibold rounded-full border bg-gradient-to-r backdrop-blur-md shadow-sm cursor-pointer select-none transition-shadow hover:shadow-md ${badge.color}`}
            >
              {badge.name}
            </motion.div>
          ))}
        </motion.div>

        {/* Name with animated gradient text */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-5 tracking-tight"
        >
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            {bio?.name || 'Amanuel Hailie'}
          </span>
        </motion.h1>

        {/* Professional Title */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground mb-4 sm:mb-6"
        >
          {bio?.title || 'Full-Stack Developer (PERN Stack Specialist)'}
        </motion.p>

        {/* Description paragraph */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-foreground/80 mb-8 sm:mb-10 max-w-2xl mx-auto px-4 leading-relaxed"
        >
          {bio?.description || 'Computer Science graduate passionate about building modern web applications with PostgreSQL, Express, React, and Node.js.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center"
        >
          {bio?.cv_link && (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 rounded-xl font-medium"
            >
              <a
                href={bio.cv_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View CV</span>
              </a>
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={handleScrollToProjects}
            className="rounded-xl font-medium border-border/80 hover:bg-accent/80 transition-all duration-300 hover:scale-105 gap-2"
          >
            <span>Explore Work</span>
            <ArrowDown className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;