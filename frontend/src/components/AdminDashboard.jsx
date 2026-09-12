import { useState, useEffect } from 'react';
import { Lock, Save, Trash2, Plus, Edit, X, LogOut, LayoutDashboard, FileText, Code, Award, MessageSquare, Share2, Check, ExternalLink, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { 
  FaGithub, FaLinkedin, FaYoutube, FaFacebook, FaXTwitter, FaInstagram,
  FaTelegram, FaWhatsapp, FaDiscord, FaTiktok, FaTwitch, FaReddit,
  FaMedium, FaThreads, FaSlack, FaGitlab, FaStackOverflow, FaGlobe, FaEnvelope, FaLink
} from 'react-icons/fa6';

const SOCIAL_PLATFORMS = [
  { name: 'Telegram', icon: 'FaTelegram', placeholder: 'https://t.me/username', color: '#229ED9' },
  { name: 'WhatsApp', icon: 'FaWhatsapp', placeholder: 'https://wa.me/1234567890', color: '#25D366' },
  { name: 'GitHub', icon: 'FaGithub', placeholder: 'https://github.com/username', color: '#111827' },
  { name: 'LinkedIn', icon: 'FaLinkedin', placeholder: 'https://linkedin.com/in/username', color: '#0a66c2' },
  { name: 'YouTube', icon: 'FaYoutube', placeholder: 'https://youtube.com/@channel', color: '#ef4444' },
  { name: 'Facebook', icon: 'FaFacebook', placeholder: 'https://facebook.com/username', color: '#2563eb' },
  { name: 'X (Twitter)', icon: 'FaXTwitter', placeholder: 'https://x.com/username', color: '#0f172a' },
  { name: 'Instagram', icon: 'FaInstagram', placeholder: 'https://instagram.com/username', color: '#e1306c' },
  { name: 'Discord', icon: 'FaDiscord', placeholder: 'https://discord.gg/invitecode', color: '#5865F2' },
  { name: 'TikTok', icon: 'FaTiktok', placeholder: 'https://tiktok.com/@username', color: '#000000' },
  { name: 'Twitch', icon: 'FaTwitch', placeholder: 'https://twitch.tv/username', color: '#9146FF' },
  { name: 'Reddit', icon: 'FaReddit', placeholder: 'https://reddit.com/user/username', color: '#FF4500' },
  { name: 'Medium', icon: 'FaMedium', placeholder: 'https://medium.com/@username', color: '#000000' },
  { name: 'Threads', icon: 'FaThreads', placeholder: 'https://threads.net/@username', color: '#000000' },
  { name: 'Slack', icon: 'FaSlack', placeholder: 'https://workspace.slack.com', color: '#4A154B' },
  { name: 'GitLab', icon: 'FaGitlab', placeholder: 'https://gitlab.com/username', color: '#FC6D26' },
  { name: 'Stack Overflow', icon: 'FaStackOverflow', placeholder: 'https://stackoverflow.com/users/...', color: '#F58025' },
  { name: 'Personal Website', icon: 'FaGlobe', placeholder: 'https://yourportfolio.com', color: '#0284c7' },
  { name: 'Email', icon: 'FaEnvelope', placeholder: 'mailto:your.email@example.com', color: '#ea4335' },
  { name: 'Custom / Other', icon: 'FaLink', placeholder: 'https://...', color: '#4b5563' },
];

const SOCIAL_ICON_MAP = {
  FaGithub, FaLinkedin, FaYoutube, FaFacebook, FaXTwitter, FaInstagram,
  FaTelegram, FaWhatsapp, FaDiscord, FaTiktok, FaTwitch, FaReddit,
  FaMedium, FaThreads, FaSlack, FaGitlab, FaStackOverflow, FaGlobe, FaEnvelope, FaLink
};

const AdminDashboard = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [activeTab, setActiveTab] = useState('bio');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Data states
  const [bio, setBio] = useState({ name: '', title: '', description: '', cv_link: '', image_url: '' });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', updated_at: '' });

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', github_link: '', image_url: ''
  });
  const [skillForm, setSkillForm] = useState({
    name: '',
    mainCategory: '',
    subCategory: '',
    proficiency: 3
  });
  const [socialLinkForm, setSocialLinkForm] = useState({ name: 'Telegram', url: '', icon: 'FaTelegram', hover_color: '#229ED9', display_order: 0 });
  const [editingSocialLinkId, setEditingSocialLinkId] = useState(null);
  const [selectedPlatformPreset, setSelectedPlatformPreset] = useState('Telegram');
  const [credentialsForm, setCredentialsForm] = useState({ email: '', password: '', currentPassword: '' });
  const [deletePassword, setDeletePassword] = useState('');

  // Skill categories hierarchy
  const skillCategories = {
    'Development': {
      'Frontend': ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Nuxt.js'],
      'Backend': ['Node.js', 'Python', 'Java', 'Go', 'PHP', 'Ruby', 'Express', 'Django', 'Spring Boot'],
      'Full Stack': ['MERN', 'MEAN', 'LAMP', 'PERN'],
      'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic'],
      'Desktop': ['Electron', 'Qt', '.NET', 'JavaFX']
    },
    'Specialized': {
      'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Jenkins', 'GitLab CI'],
      'Database': ['SQL', 'NoSQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'],
      'Cloud Computing': ['AWS', 'GCP', 'Azure', 'Cloudflare', 'Heroku', 'DigitalOcean'],
      'Machine Learning': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'OpenCV'],
      'Data Science': ['Python', 'R', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter']
    },
    'Other': {
      'Design': ['UI/UX', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'],
      'Testing': ['Jest', 'Cypress', 'Selenium', 'Playwright', 'Mocha', 'Chai'],
      'Security': ['OWASP', 'Penetration Testing', 'Cryptography', 'OAuth', 'JWT'],
      'Version Control': ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN'],
      'Project Management': ['Agile', 'Scrum', 'Jira', 'Trello', 'Asana']
    },
    'Soft Skills': {
      'Communication': ['Public Speaking', 'Writing', 'Presentation', 'Negotiation'],
      'Problem Solving': ['Critical Thinking', 'Analytical', 'Debugging', 'Troubleshooting'],
      'Team Collaboration': ['Teamwork', 'Leadership', 'Mentoring', 'Code Review'],
      'Time Management': ['Planning', 'Prioritization', 'Organization', 'Deadlines']
    }
  };

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const headers = { 'Authorization': `Bearer ${token}` };

      const [bioRes, projectsRes, skillsRes, contactsRes, socialLinksRes, credentialsRes] = await Promise.all([
        fetch(`${apiUrl}/api/bio`),
        fetch(`${apiUrl}/api/projects`),
        fetch(`${apiUrl}/api/skills`),
        fetch(`${apiUrl}/api/contact`, { headers }),
        fetch(`${apiUrl}/api/social-links`),
        fetch(`${apiUrl}/api/auth/credentials`, { headers })
      ]);

      const bioData = await bioRes.json();
      const projectsData = await projectsRes.json();
      const skillsData = await skillsRes.json();
      const contactsData = await contactsRes.json();
      const socialLinksData = await socialLinksRes.json();
      const credentialsData = await credentialsRes.json();

      if (bioData) setBio(bioData);
      setProjects(projectsData || []);
      setSkills(skillsData || []);
      setContacts(contactsData || []);
      setSocialLinks(socialLinksData || []);
      if (credentialsData) setAdminCredentials(credentialsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setErrors({});
  };

  const updateBio = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bio)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Bio updated successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update bio' });
    }
  };

  const addProject = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Project added successfully' });
        setProjectForm({
          title: '', description: '', github_link: '', image_url: ''
        });
        fetchAllData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add project' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add project' });
    }
  };

  const deleteProject = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Project deleted successfully' });
        fetchAllData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete project' });
    }
  };

  const addSkill = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: skillForm.name,
          category: `${skillForm.mainCategory} > ${skillForm.subCategory}`,
          proficiency: skillForm.proficiency
        })
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Skill added successfully' });
        setSkillForm({
          name: '',
          mainCategory: '',
          subCategory: '',
          proficiency: 3
        });
        fetchAllData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add skill' });
    }
  };

  const deleteSkill = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Skill deleted successfully' });
        fetchAllData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete skill' });
    }
  };

  const handleSelectPlatformPreset = (platformName) => {
    setSelectedPlatformPreset(platformName);
    const preset = SOCIAL_PLATFORMS.find(p => p.name === platformName);
    if (preset) {
      setSocialLinkForm(prev => ({
        ...prev,
        name: platformName === 'Custom / Other' ? '' : platformName,
        icon: preset.icon,
        hover_color: preset.color,
      }));
    }
  };

  const handleEditSocialLink = (link) => {
    setEditingSocialLinkId(link.id);
    setSocialLinkForm({
      name: link.name,
      url: link.url,
      icon: link.icon,
      hover_color: link.hover_color,
      display_order: link.display_order
    });
    const matched = SOCIAL_PLATFORMS.find(p => p.name.toLowerCase() === link.name.toLowerCase() || p.icon === link.icon);
    setSelectedPlatformPreset(matched ? matched.name : 'Custom / Other');
  };

  const handleCancelEditSocialLink = () => {
    setEditingSocialLinkId(null);
    setSocialLinkForm({ name: 'Telegram', url: '', icon: 'FaTelegram', hover_color: '#229ED9', display_order: 0 });
    setSelectedPlatformPreset('Telegram');
  };

  const addSocialLink = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/social-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(socialLinkForm)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Social link added successfully' });
        handleCancelEditSocialLink();
        fetchAllData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add social link' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add social link' });
    }
  };

  const updateSocialLink = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/social-links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(socialLinkForm)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Social link updated successfully' });
        handleCancelEditSocialLink();
        fetchAllData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update social link' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update social link' });
    }
  };

  const deleteSocialLink = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/social-links/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Social link deleted successfully' });
        fetchAllData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete social link' });
    }
  };

  const updateCredentials = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(credentialsForm)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Credentials updated successfully' });
        setCredentialsForm({ email: '', password: '', currentPassword: '' });
        fetchAllData();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update credentials' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update credentials' });
    }
  };

  const deleteCredentials = async () => {
    console.log('Delete credentials called with password:', deletePassword ? 'Yes' : 'No');
    console.log('Token exists:', token ? 'Yes' : 'No');

    if (!deletePassword) {
      setMessage({ type: 'error', text: 'Please enter your password to confirm deletion' });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/credentials`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response content-type:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log('Delete response data:', data);

        if (response.ok) {
          setMessage({ type: 'success', text: 'Admin credentials cleared successfully' });
          setDeletePassword('');
          handleLogout();
        } else {
          console.log('Delete error response:', data);
          setMessage({ type: 'error', text: data.error || 'Failed to delete credentials' });
        }
      } else {
        const text = await response.text();
        console.log('Delete response text:', text);
        setMessage({ type: 'error', text: `Server error: ${response.status} - ${text.substring(0, 100)}...` });
      }
    } catch (error) {
      console.error('Delete credentials error:', error);
      setMessage({ type: 'error', text: `Failed to delete credentials: ${error.message}` });
    }
  };

  const deleteContact = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Contact deleted successfully' });
        fetchAllData();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete contact' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
          </div>
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                placeholder="admin@example.com"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Return to portfolio site"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Site</span>
            </button>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
            <button onClick={() => setMessage(null)} className="float-right">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-1.5 sm:gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {[
            { id: 'bio', label: 'Bio', icon: FileText },
            { id: 'projects', label: 'Projects', icon: Code },
            { id: 'skills', label: 'Skills', icon: Award },
            { id: 'social-links', label: 'Social Links', icon: Share2 },
            { id: 'contacts', label: 'Contacts', icon: MessageSquare },
            { id: 'credentials', label: 'Credentials', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          {activeTab === 'bio' && (
            <div className="space-y-4 max-w-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Bio</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={bio.name}
                  onChange={(e) => setBio({ ...bio, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={bio.title}
                  onChange={(e) => setBio({ ...bio, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={bio.description}
                  onChange={(e) => setBio({ ...bio, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CV Link</label>
                <input
                  type="url"
                  value={bio.cv_link}
                  onChange={(e) => setBio({ ...bio, cv_link: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
                <input
                  type="url"
                  value={bio.image_url}
                  onChange={(e) => setBio({ ...bio, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
              <button
                onClick={updateBio}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Bio
              </button>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Projects</h2>
              <div className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-4 sm:p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Add New Project</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <textarea
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="url"
                  placeholder="GitHub Link"
                  value={projectForm.github_link}
                  onChange={(e) => setProjectForm({ ...projectForm, github_link: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={projectForm.image_url}
                  onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={addProject}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Existing Projects ({projects.length})</h3>
                {projects.map((project) => (
                  <div key={project.id} className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/60 rounded-lg gap-3">
                    <div className="flex-1 min-w-0 mr-2">
                      <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{project.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">{project.description}</p>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="shrink-0 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Skills</h2>
              <div className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-4 sm:p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Add New Skill</h3>
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Main Category</label>
                  <select
                    value={skillForm.mainCategory}
                    onChange={(e) => setSkillForm({ ...skillForm, mainCategory: e.target.value, subCategory: '' })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select Main Category</option>
                    {Object.keys(skillCategories).map((mainCat) => (
                      <option key={mainCat} value={mainCat}>{mainCat}</option>
                    ))}
                  </select>
                </div>
                {skillForm.mainCategory && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Sub Category</label>
                    <select
                      value={skillForm.subCategory}
                      onChange={(e) => setSkillForm({ ...skillForm, subCategory: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select Sub Category</option>
                      {Object.keys(skillCategories[skillForm.mainCategory] || {}).map((subCat) => (
                        <option key={subCat} value={subCat}>{subCat}</option>
                      ))}
                    </select>
                  </div>
                )}
                {skillForm.subCategory && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Specific Skill (Optional)</label>
                    <select
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Or type custom skill name</option>
                      {skillCategories[skillForm.mainCategory]?.[skillForm.subCategory]?.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Proficiency (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skillForm.proficiency}
                    onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <button
                  onClick={addSkill}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white text-center">Existing Skills</h3>

                {(() => {
                  // Group skills by main category
                  const groupedSkills = skills.reduce((acc, skill) => {
                    const categoryParts = skill.category.split(' > ');
                    const mainCategory = categoryParts[0] || skill.category;
                    if (!acc[mainCategory]) {
                      acc[mainCategory] = [];
                    }
                    acc[mainCategory].push(skill);
                    return acc;
                  }, {});

                  return Object.entries(groupedSkills).map(([mainCategory, categorySkills]) => (
                    <div key={mainCategory} className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                        {mainCategory}
                      </h4>
                      {categorySkills.map((skill) => {
                        const categoryParts = skill.category.split(' > ');
                        const subCategory = categoryParts[1] || '';

                        return (
                          <div key={skill.id} className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/60 rounded-lg gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{skill.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {subCategory && (
                                  <span className="text-[11px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 rounded-full font-medium truncate">
                                    {subCategory}
                                  </span>
                                )}
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                  {skill.proficiency}/5
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              className="shrink-0 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                              title="Delete skill"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {activeTab === 'social-links' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Social Links</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add any social media (Telegram, WhatsApp, Discord, TikTok, etc.) or custom links without limits.
                  </p>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {editingSocialLinkId ? (
                      <>
                        <Edit className="w-4 h-4 text-blue-500" />
                        <span>Edit Social Link</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-green-500" />
                        <span>Add New Social Media / Link</span>
                      </>
                    )}
                  </h3>
                  {editingSocialLinkId && (
                    <button
                      onClick={handleCancelEditSocialLink}
                      className="text-xs px-2.5 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* Quick Platform Preset Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Select Platform Preset
                  </label>
                  <select
                    value={selectedPlatformPreset}
                    onChange={(e) => handleSelectPlatformPreset(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform.name} value={platform.name}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Telegram, WhatsApp, Discord"
                      value={socialLinkForm.name}
                      onChange={(e) => setSocialLinkForm({ ...socialLinkForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                      Icon *
                    </label>
                    <select
                      value={socialLinkForm.icon}
                      onChange={(e) => setSocialLinkForm({ ...socialLinkForm, icon: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.keys(SOCIAL_ICON_MAP).map((iconKey) => (
                        <option key={iconKey} value={iconKey}>
                          {iconKey.replace('Fa', '')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Profile / Channel URL *
                  </label>
                  <input
                    type="url"
                    placeholder={
                      SOCIAL_PLATFORMS.find(p => p.name === selectedPlatformPreset)?.placeholder || 'https://...'
                    }
                    value={socialLinkForm.url}
                    onChange={(e) => setSocialLinkForm({ ...socialLinkForm, url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                      Hover / Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={socialLinkForm.hover_color?.startsWith('#') ? socialLinkForm.hover_color : '#2563eb'}
                        onChange={(e) => setSocialLinkForm({ ...socialLinkForm, hover_color: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer p-0.5 bg-white dark:bg-gray-800"
                      />
                      <input
                        type="text"
                        placeholder="Color (e.g. #229ED9)"
                        value={socialLinkForm.hover_color}
                        onChange={(e) => setSocialLinkForm({ ...socialLinkForm, hover_color: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                      Display Order
                    </label>
                    <input
                      type="number"
                      placeholder="Order (e.g., 1, 2, 3)"
                      value={socialLinkForm.display_order}
                      onChange={(e) => setSocialLinkForm({ ...socialLinkForm, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Live Preview Bar */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live Icon Preview:</span>
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-lg text-white shadow-sm flex items-center justify-center transition-colors"
                      style={{ backgroundColor: socialLinkForm.hover_color?.startsWith('#') ? socialLinkForm.hover_color : '#2563eb' }}
                    >
                      {(() => {
                        const PreviewIcon = SOCIAL_ICON_MAP[socialLinkForm.icon] || FaLink;
                        return <PreviewIcon className="w-5 h-5" />;
                      })()}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {socialLinkForm.name || 'Platform Name'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {editingSocialLinkId ? (
                    <>
                      <button
                        onClick={() => updateSocialLink(editingSocialLinkId)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Update Social Link
                      </button>
                      <button
                        onClick={handleCancelEditSocialLink}
                        className="px-5 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={addSocialLink}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Social Link
                    </button>
                  )}
                </div>
              </div>

              {/* List of existing links */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Active Social Links ({socialLinks.length})
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Ordered by display order
                  </span>
                </div>

                {socialLinks.map((socialLink) => {
                  const LinkIcon = SOCIAL_ICON_MAP[socialLink.icon] || FaLink;
                  const isEditing = editingSocialLinkId === socialLink.id;

                  return (
                    <div
                      key={socialLink.id}
                      className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                        isEditing 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500 shadow-md' 
                          : 'bg-gray-50 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-4">
                        <div
                          className="p-2.5 rounded-lg text-white shrink-0 shadow-sm"
                          style={{
                            backgroundColor: socialLink.hover_color?.startsWith('#') 
                              ? socialLink.hover_color 
                              : '#2563eb'
                          }}
                        >
                          <LinkIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {socialLink.name}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-mono">
                              #{socialLink.display_order}
                            </span>
                          </div>
                          <a
                            href={socialLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-sm mt-0.5"
                          >
                            {socialLink.url}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEditSocialLink(socialLink)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          title="Edit social link"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSocialLink(socialLink.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="Delete social link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {socialLinks.length === 0 && (
                  <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No social links added yet. Use the form above to add your first one!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Messages</h2>
              {contacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{contact.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
                    </div>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {contact.subject && <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{contact.subject}</p>}
                  <p className="text-gray-700 dark:text-gray-300">{contact.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{new Date(contact.created_at).toLocaleString()}</p>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">No messages yet</p>
              )}
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Admin Credentials</h2>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Current Credentials</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span> {adminCredentials.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Last Updated:</span> {adminCredentials.updated_at ? new Date(adminCredentials.updated_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Update Credentials</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Email</label>
                  <input
                    type="email"
                    value={credentialsForm.email}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="new.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    value={credentialsForm.password}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={credentialsForm.currentPassword}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter current password for verification"
                    required
                  />
                </div>

                <button
                  onClick={updateCredentials}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Update Credentials
                </button>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-4 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-900 dark:text-red-300">Danger Zone</h3>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Clearing admin credentials will remove your email and password from the database. The admin credentials table will remain, but you will need to reinitialize the database to restore access.
                </p>

                <div>
                  <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter password to confirm deletion"
                  />
                </div>

                <button
                  onClick={deleteCredentials}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Admin Credentials
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
