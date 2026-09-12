import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

describe('Hero Component', () => {
  const mockBio = {
    name: 'Amanuel Hailie',
    title: 'Full-Stack Developer (PERN Stack Specialist)',
    description: 'Computer Science graduate passionate about building modern web applications.',
    cv_link: 'https://example.com/cv.pdf',
    image_url: 'https://example.com/photo.jpg'
  };

  describe('Rendering', () => {
    it('should render bio name, title, and description correctly', () => {
      render(<Hero bio={mockBio} />);
      expect(screen.getByText('Amanuel Hailie')).toBeDefined();
      expect(screen.getByText('Full-Stack Developer (PERN Stack Specialist)')).toBeDefined();
      expect(screen.getByText(/Computer Science graduate passionate/i)).toBeDefined();
    });

    it('should render status badge and tech badges', () => {
      render(<Hero bio={mockBio} />);
      expect(screen.getByText('Open to Opportunities & Collaborations')).toBeDefined();
      expect(screen.getByText('React')).toBeDefined();
      expect(screen.getByText('PostgreSQL')).toBeDefined();
      expect(screen.getByText('Node.js')).toBeDefined();
    });

    it('should render CV button with link when provided', () => {
      render(<Hero bio={mockBio} />);
      const cvButton = screen.getByText('View CV');
      expect(cvButton).toBeDefined();
      const linkElement = cvButton.closest('a');
      expect(linkElement?.getAttribute('href')).toBe('https://example.com/cv.pdf');
    });

    it('should render fallback values when bio prop is not provided', () => {
      render(<Hero bio={null} />);
      expect(screen.getByText('Amanuel Hailie')).toBeDefined();
      expect(screen.getByText('Explore Work')).toBeDefined();
    });
  });
});
