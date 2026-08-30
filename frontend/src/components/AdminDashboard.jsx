import { useState, useEffect } from 'react';
import { Lock, Save, Trash2, Plus, Edit, X, LogOut, LayoutDashboard, FileText, Code, Award, MessageSquare, Share2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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
  const [socialLinkForm, setSocialLinkForm] = useState({ name: '', url: '', icon: 'FaGithub', hover_color: 'hover:bg-gray-800 dark:hover:bg-gray-700', display_order: 0 });
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
        setSocialLinkForm({ name: '', url: '', icon: 'FaGithub', hover_color: 'hover:bg-gray-800 dark:hover:bg-gray-700', display_order: 0 });
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
        setSocialLinkForm({ name: '', url: '', icon: 'FaGithub', hover_color: 'hover:bg-gray-800 dark:hover:bg-gray-700', display_order: 0 });
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
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
            <button onClick={() => setMessage(null)} className="float-right">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          {activeTab === 'bio' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Bio</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={bio.name}
                  onChange={(e) => setBio({ ...bio, name: e.target.value })}
                  className="w-60 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={bio.title}
                  onChange={(e) => setBio({ ...bio, title: e.target.value })}
                  className="w-60 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={bio.description}
                  onChange={(e) => setBio({ ...bio, description: e.target.value })}
                  rows={4}
                  className="w-60 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CV Link</label>
                <input
                  type="url"
                  value={bio.cv_link}
                  onChange={(e) => setBio({ ...bio, cv_link: e.target.value })}
                  className="w-60 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
                <input
                  type="url"
                  value={bio.image_url}
                  onChange={(e) => setBio({ ...bio, image_url: e.target.value })}
                  className="w-60 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
              <button
                onClick={updateBio}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Bio
              </button>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Projects</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-10">
                <h3 className="font-semibold text-gray-900 dark:text-white">Add New Project</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <textarea
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={3}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="GitHub Link"
                  value={projectForm.github_link}
                  onChange={(e) => setProjectForm({ ...projectForm, github_link: e.target.value })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={projectForm.image_url}
                  onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={addProject}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-center">Existing Projects</h3>
                {projects.map((project) => (
                  <div key={project.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{project.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 w-auto">Manage Skills</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Add New Skill</h3>
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Category</label>
                  <select
                    value={skillForm.mainCategory}
                    onChange={(e) => setSkillForm({ ...skillForm, mainCategory: e.target.value, subCategory: '' })}
                    className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Main Category</option>
                    {Object.keys(skillCategories).map((mainCat) => (
                      <option key={mainCat} value={mainCat}>{mainCat}</option>
                    ))}
                  </select>
                </div>
                {skillForm.mainCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sub Category</label>
                    <select
                      value={skillForm.subCategory}
                      onChange={(e) => setSkillForm({ ...skillForm, subCategory: e.target.value })}
                      className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specific Skill (Optional)</label>
                    <select
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Or type custom skill name</option>
                      {skillCategories[skillForm.mainCategory]?.[skillForm.subCategory]?.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proficiency (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skillForm.proficiency}
                    onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })}
                    className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={addSkill}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
                          <div key={skill.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg w-auto">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{skill.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {subCategory && (
                                  <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                                    {subCategory}
                                  </span>
                                )}
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {skill.proficiency}/5
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Social Links</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Add New Social Link</h3>
                <input
                  type="text"
                  placeholder="Name (e.g., GitHub, LinkedIn)"
                  value={socialLinkForm.name}
                  onChange={(e) => setSocialLinkForm({ ...socialLinkForm, name: e.target.value })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="URL (e.g., https://github.com/username)"
                  value={socialLinkForm.url}
                  onChange={(e) => setSocialLinkForm({ ...socialLinkForm, url: e.target.value })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <select
                  value={socialLinkForm.icon}
                  onChange={(e) => setSocialLinkForm({ ...socialLinkForm, icon: e.target.value })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="FaGithub">GitHub</option>
                  <option value="FaLinkedin">LinkedIn</option>
                  <option value="FaYoutube">YouTube</option>
                  <option value="FaFacebook">Facebook</option>
                  <option value="FaXTwitter">X (Twitter)</option>
                  <option value="FaInstagram">Instagram</option>
                </select>
                <input
                  type="text"
                  placeholder="Hover Color (e.g., hover:bg-blue-600)"
                  value={socialLinkForm.hover_color}
                  onChange={(e) => setSocialLinkForm({ ...socialLinkForm, hover_color: e.target.value })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Display Order (e.g., 1, 2, 3)"
                  value={socialLinkForm.display_order}
                  onChange={(e) => setSocialLinkForm({ ...socialLinkForm, display_order: parseInt(e.target.value) })}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={addSocialLink}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Social Link
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-center">Existing Social Links</h3>
                {socialLinks.map((socialLink) => (
                  <div key={socialLink.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg w-auto">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white w-48">{socialLink.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{socialLink.url}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{socialLink.icon} - Order: {socialLink.display_order}</p>
                    </div>
                    <button
                      onClick={() => deleteSocialLink(socialLink.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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
