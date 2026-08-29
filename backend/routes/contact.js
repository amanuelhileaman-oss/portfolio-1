import express from 'express';
import { pool } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ error: 'Email is required and must be a non-empty string' });
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Email must be a valid email address' });
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }
    if (subject && typeof subject !== 'string') {
      return res.status(400).json({ error: 'Subject must be a string' });
    }
    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message must be less than 5000 characters' });
    }
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedSubject = subject ? subject.trim() : null;
    const sanitizedMessage = message.trim();
    
    // Check if email already exists
    const existingContact = await pool.query(
      'SELECT * FROM contacts WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
      [sanitizedEmail]
    );
    
    if (existingContact.rows.length > 0) {
      return res.status(409).json({ error: 'This email has already submitted a message. Please use a different email or contact us directly.' });
    }
    
    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage]
    );
    
    res.status(201).json({ message: 'Message sent successfully', contact: result.rows[0] });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all contacts (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete contact (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid contact ID is required' });
    }
    
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;