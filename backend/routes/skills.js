import express from 'express';
import { pool } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY category, proficiency DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get skills by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query('SELECT * FROM skills WHERE category = $1 ORDER BY proficiency DESC', [category]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching skills by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new skill (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, category, proficiency, icon } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ error: 'Category is required and must be a non-empty string' });
    }
    if (proficiency === undefined || proficiency === null) {
      return res.status(400).json({ error: 'Proficiency is required' });
    }
    if (typeof proficiency !== 'number' || !Number.isInteger(proficiency)) {
      return res.status(400).json({ error: 'Proficiency must be an integer' });
    }
    if (proficiency < 1 || proficiency > 5) {
      return res.status(400).json({ error: 'Proficiency must be between 1 and 5' });
    }
    if (icon && typeof icon !== 'string') {
      return res.status(400).json({ error: 'Icon must be a string' });
    }
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedCategory = category.trim();
    const sanitizedIcon = icon ? icon.trim() : null;
    
    const result = await pool.query(
      `INSERT INTO skills (name, category, proficiency, icon)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [sanitizedName, sanitizedCategory, proficiency, sanitizedIcon]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skill (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency, icon } = req.body;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid skill ID is required' });
    }
    
    // Validation
    if (name && (typeof name !== 'string' || name.trim().length === 0)) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }
    if (category && (typeof category !== 'string' || category.trim().length === 0)) {
      return res.status(400).json({ error: 'Category must be a non-empty string' });
    }
    if (proficiency !== undefined && proficiency !== null) {
      if (typeof proficiency !== 'number' || !Number.isInteger(proficiency)) {
        return res.status(400).json({ error: 'Proficiency must be an integer' });
      }
      if (proficiency < 1 || proficiency > 5) {
        return res.status(400).json({ error: 'Proficiency must be between 1 and 5' });
      }
    }
    if (icon && typeof icon !== 'string') {
      return res.status(400).json({ error: 'Icon must be a string' });
    }
    
    // Sanitize inputs
    const sanitizedName = name ? name.trim() : undefined;
    const sanitizedCategory = category ? category.trim() : undefined;
    const sanitizedIcon = icon ? icon.trim() : null;
    
    const result = await pool.query(
      `UPDATE skills 
       SET name = COALESCE($1, name), 
           category = COALESCE($2, category), 
           proficiency = COALESCE($3, proficiency), 
           icon = COALESCE($4, icon)
       WHERE id = $5 RETURNING *`,
      [sanitizedName, sanitizedCategory, proficiency, sanitizedIcon, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete skill (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
