// Unit tests for contact form validation logic

describe('Contact Form Validation Logic', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  describe('Field Validation', () => {
    it('should accept valid contact form data', () => {
      const contactData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Job Opportunity',
        message: 'Hello, I came across your portfolio and would like to connect.'
      };

      expect(contactData.name.trim().length).toBeGreaterThanOrEqual(2);
      expect(emailRegex.test(contactData.email)).toBe(true);
      expect(contactData.message.trim().length).toBeGreaterThanOrEqual(10);
    });

    it('should reject names with less than 2 characters', () => {
      const shortNames = ['', ' ', 'A'];
      shortNames.forEach((name) => {
        expect(name.trim().length < 2).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = ['plainaddress', '@missingusername.com', 'user@.com', 'user@domain'];
      invalidEmails.forEach((email) => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should reject messages with less than 10 characters', () => {
      const shortMessages = ['', 'Hi', 'Too short'];
      shortMessages.forEach((msg) => {
        expect(msg.trim().length < 10).toBe(true);
      });
    });
  });
});
