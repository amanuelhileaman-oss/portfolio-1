import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [bio, setBio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const [bioRes, projectsRes, skillsRes, socialLinksRes] = await Promise.all([
        fetch(`${apiUrl}/api/bio`),
        fetch(`${apiUrl}/api/projects`),
        fetch(`${apiUrl}/api/skills`),
        fetch(`${apiUrl}/api/social-links`)
      ]);

      console.log('Bio response status:', bioRes.status);
      const bioData = await bioRes.json();
      console.log('Bio data received:', bioData);
      
      const projectsData = await projectsRes.json();
      const skillsData = await skillsRes.json();
      const socialLinksData = await socialLinksRes.json();

      setBio(bioData);
      setProjects(projectsData || []);
      setSkills(skillsData || []);
      setSocialLinks(socialLinksData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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
      {currentSection === 'admin' ? (
        <AdminDashboard onNavigate={setCurrentSection} />
      ) : (
        <div className="min-h-screen">
          <Navigation onNavigate={setCurrentSection} currentSection={currentSection} />
          <main className="pt-16">
            {error ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Error: {error}</div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="min-h-screen">
                {renderContent()}
              </div>
            )}
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
