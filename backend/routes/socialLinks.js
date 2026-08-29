import express from 'express';
import { pool } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all social links
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM social_links ORDER BY display_order ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching social links:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add social link (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, url, icon, hover_color, display_order } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ error: 'URL is required and must be a non-empty string' });
    }
    if (!icon || typeof icon !== 'string' || icon.trim().length === 0) {
      return res.status(400).json({ error: 'Icon is required and must be a non-empty string' });
    }
    if (!hover_color || typeof hover_color !== 'string' || hover_color.trim().length === 0) {
      return res.status(400).json({ error: 'Hover color is required and must be a non-empty string' });
    }
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedUrl = url.trim();
    const sanitizedIcon = icon.trim();
    const sanitizedHoverColor = hover_color.trim();
    const sanitizedDisplayOrder = display_order ? parseInt(display_order) : 0;
    
    const result = await pool.query(
      `INSERT INTO social_links (name, url, icon, hover_color, display_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [sanitizedName, sanitizedUrl, sanitizedIcon, sanitizedHoverColor, sanitizedDisplayOrder]
    );
    
    res.status(201).json({ message: 'Social link added successfully', socialLink: result.rows[0] });
  } catch (error) {
    console.error('Error adding social link:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update social link (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, icon, hover_color, display_order } = req.body;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid social link ID is required' });
    }
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ error: 'URL is required and must be a non-empty string' });
    }
    if (!icon || typeof icon !== 'string' || icon.trim().length === 0) {
      return res.status(400).json({ error: 'Icon is required and must be a non-empty string' });
    }
    if (!hover_color || typeof hover_color !== 'string' || hover_color.trim().length === 0) {
      return res.status(400).json({ error: 'Hover color is required and must be a non-empty string' });
    }
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedUrl = url.trim();
    const sanitizedIcon = icon.trim();
    const sanitizedHoverColor = hover_color.trim();
    const sanitizedDisplayOrder = display_order ? parseInt(display_order) : 0;
    
    const result = await pool.query(
      `UPDATE social_links 
       SET name = $1, url = $2, icon = $3, hover_color = $4, display_order = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [sanitizedName, sanitizedUrl, sanitizedIcon, sanitizedHoverColor, sanitizedDisplayOrder, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Social link not found' });
    }
    
    res.json({ message: 'Social link updated successfully', socialLink: result.rows[0] });
  } catch (error) {
    console.error('Error updating social link:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete social link (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid social link ID is required' });
    }
    
    const result = await pool.query('DELETE FROM social_links WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Social link not found' });
    }
    
    res.json({ message: 'Social link deleted successfully' });
  } catch (error) {
    console.error('Error deleting social link:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
