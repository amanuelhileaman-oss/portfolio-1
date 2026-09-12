import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Projects from '../Projects';

describe('Projects Component', () => {
  const mockProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured online store built with PERN stack.',
      github_link: 'https://github.com/example/ecommerce',
      image_url: 'https://example.com/img1.jpg'
    },
    {
      id: 2,
      title: 'Task Manager API',
      description: 'RESTful API with JWT authentication and PostgreSQL.',
      github_link: 'https://github.com/example/task-api',
      image_url: null
    }
  ];

  describe('Rendering', () => {
    it('should render section title and description', () => {
      render(<Projects projects={mockProjects} />);
      expect(screen.getByText('Featured Projects')).toBeDefined();
      expect(screen.getByText(/A showcase of full-stack web applications/i)).toBeDefined();
    });

    it('should render project titles and descriptions', () => {
      render(<Projects projects={mockProjects} />);
      expect(screen.getByText('E-Commerce Platform')).toBeDefined();
      expect(screen.getByText('A full-featured online store built with PERN stack.')).toBeDefined();
      expect(screen.getByText('Task Manager API')).toBeDefined();
    });

    it('should render github source code links when provided', () => {
      render(<Projects projects={mockProjects} />);
      const links = screen.getAllByText('View Source Code');
      expect(links.length).toBe(2);
    });

    it('should render empty state when no projects are available', () => {
      render(<Projects projects={[]} />);
      expect(screen.getByText('No projects yet. More coming soon!')).toBeDefined();
    });
  });

  describe('Data Validation', () => {
    it('should validate project structure', () => {
      mockProjects.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('title');
        expect(project).toHaveProperty('description');
        expect(typeof project.title).toBe('string');
        expect(typeof project.description).toBe('string');
      });
    });

    it('should handle project without github_link gracefully', () => {
      const projectWithoutLink = [
        {
          id: 3,
          title: 'Internal Tool',
          description: 'Proprietary internal dashboard.',
          github_link: null,
          image_url: null
        }
      ];
      render(<Projects projects={projectWithoutLink} />);
      expect(screen.getByText('Internal Tool')).toBeDefined();
      expect(screen.queryByText('View Source Code')).toBeNull();
    });
  });
});
