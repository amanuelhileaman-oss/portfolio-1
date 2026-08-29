import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../server.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Check credentials from database
    const result = await pool.query('SELECT * FROM admin_credentials ORDER BY id LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'No admin credentials found. Please initialize the database.' });
    }

    const admin = result.rows[0];
    
    // Check if credentials are cleared (empty)
    if (!admin.email || !admin.password) {
      return res.status(401).json({ error: 'Admin credentials have been cleared. Please reinitialize the database.' });
    }
    
    if (password === admin.password) {
      const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, role: 'admin' });
    }

    res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current admin credentials (admin only)
router.get('/credentials', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, updated_at FROM admin_credentials ORDER BY id LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No admin credentials found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching admin credentials:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update admin credentials (admin only)
router.put('/credentials', async (req, res) => {
  try {
    const { email, password, currentPassword } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate current password
    const currentResult = await pool.query('SELECT * FROM admin_credentials ORDER BY id LIMIT 1');
    
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'No admin credentials found' });
    }

    if (currentPassword !== currentResult.rows[0].password) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update credentials
    await pool.query(
      'UPDATE admin_credentials SET email = $1, password = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [email, password, currentResult.rows[0].id]
    );

    res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Error updating admin credentials:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete admin credentials (admin only)
router.delete('/credentials', async (req, res) => {
  console.log('Delete credentials request received:', req.body);
  try {
    const { password } = req.body;

    console.log('Password provided:', password ? 'Yes' : 'No');
    console.log('Password length:', password ? password.length : 0);

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Validate password before deletion
    const currentResult = await pool.query('SELECT * FROM admin_credentials ORDER BY id LIMIT 1');
    
    console.log('Current credentials found:', currentResult.rows.length);
    
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'No admin credentials found' });
    }

    console.log('Stored password:', currentResult.rows[0].password);
    console.log('Provided password:', password);
    console.log('Password comparison:', password === currentResult.rows[0].password ? 'Match' : 'No match');

    if (password !== currentResult.rows[0].password) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    // Clear credentials (set to empty strings instead of deleting the row)
    await pool.query(
      'UPDATE admin_credentials SET email = $1, password = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['', '', currentResult.rows[0].id]
    );

    console.log('Credentials cleared successfully');
    res.json({ message: 'Admin credentials cleared successfully' });
  } catch (error) {
    console.error('Error clearing admin credentials:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token middleware
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default router;