// Fallback defaults for 0ms instant loading on page refresh and deployment cold-starts
export const DEFAULT_BIO = {
  name: 'Amanuel Hailie',
  title: 'Full-Stack Developer (PERN Stack Specialist)',
  description: 'Computer Science graduate passionate about building modern web applications with PostgreSQL, Express, React, and Node.js.',
  cv_link: '',
  image_url: ''
};

export const DEFAULT_PROJECTS = [];

export const DEFAULT_SKILLS = [
  { id: 1, name: 'PostgreSQL', category: 'Backend', proficiency: 5 },
  { id: 2, name: 'Express.js', category: 'Backend', proficiency: 4 },
  { id: 3, name: 'React', category: 'Frontend', proficiency: 5 },
  { id: 4, name: 'Node.js', category: 'Backend', proficiency: 4 },
  { id: 5, name: 'JavaScript', category: 'Frontend', proficiency: 5 },
  { id: 6, name: 'Tailwind CSS', category: 'Frontend', proficiency: 5 },
  { id: 7, name: 'REST APIs', category: 'Backend', proficiency: 4 },
  { id: 8, name: 'Git', category: 'Tools', proficiency: 4 }
];

export const DEFAULT_SOCIAL_LINKS = [
  { id: 1, name: 'GitHub', url: 'https://github.com/amanuelhileaman-oss', icon: 'FaGithub', hover_color: '#111827', display_order: 1 },
  { id: 2, name: 'LinkedIn', url: 'https://www.linkedin.com/in/aman12tafir', icon: 'FaLinkedin', hover_color: '#0a66c2', display_order: 2 },
  { id: 3, name: 'YouTube', url: 'https://www.youtube.com/@Amanuel12_Hai', icon: 'FaYoutube', hover_color: '#ef4444', display_order: 3 },
  { id: 4, name: 'Facebook', url: 'https://facebook.com/amanuel.hailie', icon: 'FaFacebook', hover_color: '#2563eb', display_order: 4 },
  { id: 5, name: 'X', url: 'https://x.com/AmanHailie', icon: 'FaXTwitter', hover_color: '#0f172a', display_order: 5 },
  { id: 6, name: 'Instagram', url: 'https://instagram.com/amanuel_hailie', icon: 'FaInstagram', hover_color: '#e1306c', display_order: 6 }
];
