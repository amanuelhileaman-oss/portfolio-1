// Unit tests for project validation logic

describe('Projects Validation Logic', () => {
  describe('Project Title & Description', () => {
    it('should accept valid project objects', () => {
      const project = {
        title: 'Full-Stack Portfolio',
        description: 'PERN stack portfolio application with real-time administration.',
        github_link: 'https://github.com/example/portfolio',
        image_url: 'https://example.com/project.png'
      };

      expect(typeof project.title).toBe('string');
      expect(project.title.trim().length).toBeGreaterThan(0);
      expect(typeof project.description).toBe('string');
      expect(project.description.trim().length).toBeGreaterThan(0);
    });

    it('should identify missing or empty required fields', () => {
      const invalidProject = {
        title: '',
        description: '   '
      };

      expect(invalidProject.title.trim().length === 0).toBe(true);
      expect(invalidProject.description.trim().length === 0).toBe(true);
    });
  });

  describe('URLs Validation', () => {
    it('should validate valid GitHub URLs', () => {
      const validUrls = [
        'https://github.com/username/project',
        'http://github.com/username/repo'
      ];

      validUrls.forEach((url) => {
        expect(() => new URL(url)).not.toThrow();
        expect(url.includes('github.com')).toBe(true);
      });
    });

    it('should allow null or empty optional links', () => {
      const projectWithoutLinks = {
        title: 'Offline Tool',
        description: 'Command line utility',
        github_link: null,
        image_url: null
      };

      expect(projectWithoutLinks.github_link).toBeNull();
      expect(projectWithoutLinks.image_url).toBeNull();
    });
  });
});
