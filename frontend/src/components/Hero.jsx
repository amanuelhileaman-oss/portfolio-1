import { Download } from 'lucide-react';
import { FaGithub, FaLinkedin, FaYoutube, FaFacebook, FaXTwitter, FaInstagram } from 'react-icons/fa6';

const iconMap = {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaXTwitter,
  FaInstagram
};

const Hero = ({ bio }) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-20 relative overflow-hidden">
      <div className="absolute left-0 bottom-20 sm:bottom-40 -rotate-45 origin-bottom-left opacity-10 pointer-events-none">
        <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
          PORTFOLIO
        </h1>
      </div>
      <div className="max-w-4xl mx-auto text-center cursor-pointer relative z-10 animate-fade-in" onClick={() => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }}>
        {bio?.image_url && (
          <div className="mb-6 sm:mb-8 flex justify-center">
            <img
              src={bio.image_url}
              alt={bio.name || 'Profile'}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-600 dark:border-blue-400 shadow-lg animate-scale-in"
            />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-slide-up">
          {bio?.name || 'Amanuel Hailie'}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {bio?.title || 'Full-Stack Developer (PERN Stack Specialist)'}
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {bio?.description || 'Computer Science graduate passionate about building modern web applications with PostgreSQL, Express, React, and Node.js.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {bio?.cv_link && (
            <a
              href={bio.cv_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:scale-105 font-medium text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              View CV
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;