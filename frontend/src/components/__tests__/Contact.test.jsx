import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Contact from '../Contact';

describe('Contact Component', () => {
  const mockSocialLinks = [
    { id: 1, name: 'GitHub', url: 'https://github.com/example', icon: 'FaGithub' },
    { id: 2, name: 'Telegram', url: 'https://t.me/example', icon: 'FaTelegram' }
  ];

  describe('Rendering', () => {
    it('should render contact headings and form inputs', () => {
      render(<Contact socialLinks={mockSocialLinks} />);
      expect(screen.getByText('Get In Touch')).toBeDefined();
      expect(screen.getByPlaceholderText('Your name')).toBeDefined();
      expect(screen.getByPlaceholderText('your.email@example.com')).toBeDefined();
      expect(screen.getByPlaceholderText('Your message...')).toBeDefined();
    });

    it('should render social media links', () => {
      render(<Contact socialLinks={mockSocialLinks} />);
      expect(screen.getByLabelText('GitHub')).toBeDefined();
      expect(screen.getByLabelText('Telegram')).toBeDefined();
    });
  });

  describe('Form Validation', () => {
    it('should show error when submitting empty required fields', async () => {
      render(<Contact socialLinks={mockSocialLinks} />);
      const submitButton = screen.getByRole('button', { name: /Send Message/i });
      fireEvent.click(submitButton);

      expect(await screen.findByText('Name is required')).toBeDefined();
      expect(await screen.findByText('Email is required')).toBeDefined();
      expect(await screen.findByText('Message is required')).toBeDefined();
    });

    it('should validate invalid email formats', async () => {
      render(<Contact socialLinks={mockSocialLinks} />);
      const nameInput = screen.getByPlaceholderText('Your name');
      const emailInput = screen.getByPlaceholderText('your.email@example.com');
      const messageInput = screen.getByPlaceholderText('Your message...');
      const submitButton = screen.getByRole('button', { name: /Send Message/i });

      fireEvent.change(nameInput, { target: { name: 'name', value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'not-an-email' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'This is a test message that is long enough.' } });
      fireEvent.click(submitButton);

      expect(await screen.findByText('Please enter a valid email address')).toBeDefined();
    });
  });
});
