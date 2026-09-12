import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { 
  FaGithub, 
  FaLinkedin, 
  FaYoutube, 
  FaFacebook, 
  FaXTwitter, 
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaDiscord,
  FaTiktok,
  FaTwitch,
  FaReddit,
  FaMedium,
  FaThreads,
  FaSlack,
  FaGitlab,
  FaStackOverflow,
  FaGlobe,
  FaEnvelope,
  FaLink
} from 'react-icons/fa6';

const Contact = ({ socialLinks = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    // Subject validation (optional but if provided, should be reasonable)
    if (formData.subject.trim() && formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters if provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        setSubmitStatus('error');
        if (data.error) {
          setErrors({ email: data.error });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section id="contact" className="flex-grow py-16 sm:py-24 px-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>Let's Connect</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Have a question, opportunity, or want to collaborate on a project? Feel free to send a message.
            </p>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-border/80 shadow-xl shadow-primary/5 bg-card/85 backdrop-blur-md overflow-hidden">
              <CardHeader className="p-6 sm:p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold">
                      Send me a message
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Fill out the form below and I'll respond as soon as possible.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 pt-2">
                {/* Status alerts */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        Message sent successfully! I'll get back to you soon.
                      </p>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                      <p className="text-sm font-medium text-destructive">
                        Failed to send message. Please try again later.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={errors.name ? 'border-destructive ring-destructive/30' : ''}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs font-medium text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-destructive ring-destructive/30' : ''}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs font-medium text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
                      Subject
                    </label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className={errors.subject ? 'border-destructive ring-destructive/30' : ''}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs font-medium text-destructive">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      className={errors.message ? 'border-destructive ring-destructive/30' : ''}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs font-medium text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all duration-300 rounded-xl hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
              Connect Across the Web
            </h3>
            <div className="flex gap-3 justify-center flex-wrap">
              {socialLinks.map((social) => {
                const iconComponents = {
                  FaGithub,
                  FaLinkedin,
                  FaYoutube,
                  FaFacebook,
                  FaXTwitter,
                  FaInstagram,
                  FaTelegram,
                  FaWhatsapp,
                  FaDiscord,
                  FaTiktok,
                  FaTwitch,
                  FaReddit,
                  FaMedium,
                  FaThreads,
                  FaSlack,
                  FaGitlab,
                  FaStackOverflow,
                  FaGlobe,
                  FaEnvelope,
                  FaLink,
                };

                const brandColors = {
                  GitHub: '#111827',
                  LinkedIn: '#0a66c2',
                  YouTube: '#ef4444',
                  Facebook: '#2563eb',
                  X: '#0f172a',
                  'X (Twitter)': '#0f172a',
                  Instagram: '#e1306c',
                  Telegram: '#229ED9',
                  WhatsApp: '#25D366',
                  Discord: '#5865F2',
                  TikTok: '#000000',
                  Twitch: '#9146FF',
                  Reddit: '#FF4500',
                  Medium: '#000000',
                  Threads: '#000000',
                  Slack: '#4A154B',
                  GitLab: '#FC6D26',
                  'Stack Overflow': '#F58025',
                  Website: '#0284c7',
                  Email: '#ea4335',
                };

                const IconComponent = iconComponents[social.icon] || FaLink;
                const hoverColor = brandColors[social.name] || (social.hover_color && !social.hover_color.startsWith('hover:') ? social.hover_color : '#2563eb');

                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl border border-border/80 bg-card hover:border-primary/50 text-foreground shadow-sm transition-colors duration-200 cursor-pointer flex items-center justify-center"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = hoverColor;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                    }}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-8 text-center w-full">
        <div className="max-w-4xl mx-auto px-4 space-y-1.5">
          <p className="text-sm font-medium text-foreground/80">
            {new Date().getFullYear()} Amanuel Hailie. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with PostgreSQL, Express, React, Node.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
