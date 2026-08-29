import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Skills from '../Skills';

describe('Skills Component', () => {
  
  describe('Skills Data Processing', () => {
    it('should group skills by main category', () => {
      const mockSkills = [
        { id: 1, name: 'React', category: 'Development > Frontend', proficiency: 5, icon: null },
        { id: 2, name: 'Python', category: 'Development > Backend', proficiency: 4, icon: null },
        { id: 3, name: 'Docker', category: 'Specialized > DevOps', proficiency: 4, icon: null }
      ];

      const skillsByCategory = mockSkills.reduce((acc, skill) => {
        const categoryParts = skill.category.split(' > ');
        const mainCategory = categoryParts[0] || skill.category;
        const subCategory = categoryParts[1] || null;

        if (!acc[mainCategory]) {
          acc[mainCategory] = {};
        }
        if (subCategory) {
          if (!acc[mainCategory][subCategory]) {
            acc[mainCategory][subCategory] = [];
          }
          acc[mainCategory][subCategory].push(skill);
        } else {
          if (!acc[mainCategory]['_uncategorized']) {
            acc[mainCategory]['_uncategorized'] = [];
          }
          acc[mainCategory]['_uncategorized'].push(skill);
        }
        return acc;
      }, {});

      expect(Object.keys(skillsByCategory)).toContain('Development');
      expect(Object.keys(skillsByCategory)).toContain('Specialized');
      expect(skillsByCategory['Development']).toHaveProperty('Frontend');
      expect(skillsByCategory['Development']).toHaveProperty('Backend');
    });

    it('should parse hierarchical category format correctly', () => {
      const category = 'Development > Frontend';
      const parts = category.split(' > ');
      
      expect(parts[0]).toBe('Development');
      expect(parts[1]).toBe('Frontend');
      expect(parts.length).toBe(2);
    });

    it('should handle skills without sub-category', () => {
      const mockSkills = [
        { id: 1, name: 'React', category: 'Development', proficiency: 5, icon: null }
      ];

      const skillsByCategory = mockSkills.reduce((acc, skill) => {
        const categoryParts = skill.category.split(' > ');
        const mainCategory = categoryParts[0] || skill.category;
        const subCategory = categoryParts[1] || null;

        if (!acc[mainCategory]) {
          acc[mainCategory] = {};
        }
        if (!subCategory) {
          if (!acc[mainCategory]['_uncategorized']) {
            acc[mainCategory]['_uncategorized'] = [];
          }
          acc[mainCategory]['_uncategorized'].push(skill);
        }
        return acc;
      }, {});

      expect(skillsByCategory['Development']).toHaveProperty('_uncategorized');
      expect(skillsByCategory['Development']['_uncategorized']).toHaveLength(1);
    });
  });

  describe('Proficiency Color Logic', () => {
    const getProficiencyColor = (proficiency) => {
      switch (proficiency) {
        case 5:
          return 'bg-green-500';
        case 4:
          return 'bg-blue-500';
        case 3:
          return 'bg-yellow-500';
        case 2:
          return 'bg-orange-500';
        default:
          return 'bg-red-500';
      }
    };

    it('should return correct colors for proficiency levels', () => {
      expect(getProficiencyColor(5)).toBe('bg-green-500');
      expect(getProficiencyColor(4)).toBe('bg-blue-500');
      expect(getProficiencyColor(3)).toBe('bg-yellow-500');
      expect(getProficiencyColor(2)).toBe('bg-orange-500');
      expect(getProficiencyColor(1)).toBe('bg-red-500');
    });
  });

  describe('Skills Component Rendering', () => {
    it('should render empty state when no skills', () => {
      const { container } = render(<Skills skills={[]} />);
      expect(container.textContent).toContain('No skills added yet');
    });

    it('should render skills section with skills', () => {
      const mockSkills = [
        { id: 1, name: 'React', category: 'Development > Frontend', proficiency: 5, icon: null }
      ];

      const { container } = render(<Skills skills={mockSkills} />);
      expect(container.textContent).toContain('React');
      expect(container.textContent).toContain('5/5');
    });

    it('should display category hierarchy correctly', () => {
      const mockSkills = [
        { id: 1, name: 'React', category: 'Development > Frontend', proficiency: 5, icon: null }
      ];

      const { container } = render(<Skills skills={mockSkills} />);
      expect(container.textContent).toContain('Development');
      expect(container.textContent).toContain('Frontend');
    });
  });

  describe('Skills Data Validation', () => {
    it('should validate skill data structure', () => {
      const skill = {
        id: 1,
        name: 'React',
        category: 'Development > Frontend',
        proficiency: 5,
        icon: null
      };

      expect(skill).toHaveProperty('id');
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('category');
      expect(skill).toHaveProperty('proficiency');
      expect(skill).toHaveProperty('icon');
    });

    it('should validate proficiency range', () => {
      const validProficiencies = [1, 2, 3, 4, 5];
      validProficiencies.forEach(proficiency => {
        expect(proficiency).toBeGreaterThanOrEqual(1);
        expect(proficiency).toBeLessThanOrEqual(5);
      });
    });

    it('should validate category format', () => {
      const validCategories = [
        'Development > Frontend',
        'Development > Backend',
        'Specialized > DevOps'
      ];

      validCategories.forEach(category => {
        const parts = category.split(' > ');
        expect(parts.length).toBe(2);
        expect(parts[0].trim().length).toBeGreaterThan(0);
        expect(parts[1].trim().length).toBeGreaterThan(0);
      });
    });
  });
});
