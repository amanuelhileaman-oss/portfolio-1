import express from 'express';
import { pool } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get bio information
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bio ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bio not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching bio:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update bio information (admin only)
router.put('/', verifyToken, async (req, res) => {
  try {
    const { name, title, description, cv_link, image_url } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required and must be a non-empty string' });
    }
    if (cv_link && typeof cv_link !== 'string') {
      return res.status(400).json({ error: 'CV link must be a string' });
    }
    if (cv_link && !cv_link.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ error: 'CV link must be a valid URL' });
    }
    if (image_url && typeof image_url !== 'string') {
      return res.status(400).json({ error: 'Image URL must be a string' });
    }
    if (image_url && !image_url.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ error: 'Image URL must be a valid URL' });
    }
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();
    const sanitizedCvLink = cv_link ? cv_link.trim() : null;
    const sanitizedImageUrl = image_url ? image_url.trim() : null;
    
    // First check if bio exists
    const existingBio = await pool.query('SELECT * FROM bio ORDER BY id DESC LIMIT 1');
    
    let result;
    if (existingBio.rows.length > 0) {
      // Update existing bio
      result = await pool.query(
        `UPDATE bio 
         SET name = $1, title = $2, description = $3, cv_link = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 RETURNING *`,
        [sanitizedName, sanitizedTitle, sanitizedDescription, sanitizedCvLink, sanitizedImageUrl, existingBio.rows[0].id]
      );
    } else {
      // Create new bio
      result = await pool.query(
        `INSERT INTO bio (name, title, description, cv_link, image_url)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [sanitizedName, sanitizedTitle, sanitizedDescription, sanitizedCvLink, sanitizedImageUrl]
      );
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;