import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import { MouseSpotlight } from './components/ui/spotlight';
import { 
  DEFAULT_BIO, 
  DEFAULT_PROJECTS, 
  DEFAULT_SKILLS, 
  DEFAULT_SOCIAL_LINKS 
} from './data/defaults';
import './index.css';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  // Instant hydration from cache or defaults (0ms initial load time)
  const [bio, setBio] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_cache_bio');
      return cached ? JSON.parse(cached) : DEFAULT_BIO;
    } catch {
      return DEFAULT_BIO;
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_cache_projects');
      return cached ? JSON.parse(cached) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  const [skills, setSkills] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_cache_skills');
      return cached ? JSON.parse(cached) : DEFAULT_SKILLS;
    } catch {
      return DEFAULT_SKILLS;
    }
  });

  const [socialLinks, setSocialLinks] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_cache_social_links');
      return cached ? JSON.parse(cached) : DEFAULT_SOCIAL_LINKS;
    } catch {
      return DEFAULT_SOCIAL_LINKS;
    }
  });

  // Never block the user with a full-screen loading spinner on refresh
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      setIsSyncing(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const [bioRes, projectsRes, skillsRes, socialLinksRes] = await Promise.all([
        fetch(`${apiUrl}/api/bio`, { signal: controller.signal }),
        fetch(`${apiUrl}/api/projects`, { signal: controller.signal }),
        fetch(`${apiUrl}/api/skills`, { signal: controller.signal }),
        fetch(`${apiUrl}/api/social-links`, { signal: controller.signal }),
      ]);

      if (bioRes.ok) {
        const bioData = await bioRes.json();
        if (bioData && bioData.name) {
          setBio(bioData);
          localStorage.setItem('portfolio_cache_bio', JSON.stringify(bioData));
        }
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
          localStorage.setItem('portfolio_cache_projects', JSON.stringify(projectsData));
        }
      }

      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        if (Array.isArray(skillsData)) {
          setSkills(skillsData);
          localStorage.setItem('portfolio_cache_skills', JSON.stringify(skillsData));
        }
      }

      if (socialLinksRes.ok) {
        const socialLinksData = await socialLinksRes.json();
        if (Array.isArray(socialLinksData)) {
          setSocialLinks(socialLinksData);
          localStorage.setItem('portfolio_cache_social_links', JSON.stringify(socialLinksData));
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Background sync note (using cached/default content):', err.message);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsSyncing(false);
    }
  };

  const renderContent = () => {
    if (currentSection === 'admin') {
      return <AdminDashboard onNavigate={setCurrentSection} />;
    }

    if (currentSection === 'home') {
      return <Hero bio={bio} />;
    }

    if (currentSection === 'projects') {
      return <Projects projects={projects} />;
    }

    if (currentSection === 'skills') {
      return <Skills skills={skills} />;
    }

    if (currentSection === 'contact') {
      return <Contact socialLinks={socialLinks} />;
    }

    return null;
  };

  return (
    <ThemeProvider>
      {/* Interactive mouse-tracking ambient spotlight */}
      <MouseSpotlight />

      {currentSection === 'admin' ? (
        <AdminDashboard onNavigate={setCurrentSection} />
      ) : (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col relative">
          <Navigation onNavigate={setCurrentSection} currentSection={currentSection} />

          <main className="pt-16 flex-grow relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="min-h-[calc(100vh-4rem)]"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
