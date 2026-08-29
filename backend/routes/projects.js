import express from 'express';
import { pool } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new project (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, github_link, image_url } = req.body;
    
    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required and must be a non-empty string' });
    }
    if (github_link && typeof github_link !== 'string') {
      return res.status(400).json({ error: 'GitHub link must be a string' });
    }
    if (github_link && !github_link.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ error: 'GitHub link must be a valid URL' });
    }
    if (image_url && typeof image_url !== 'string') {
      return res.status(400).json({ error: 'Image URL must be a string' });
    }
    if (image_url && !image_url.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ error: 'Image URL must be a valid URL' });
    }
    
    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();
    const sanitizedGithubLink = github_link ? github_link.trim() : null;
    const sanitizedImageUrl = image_url ? image_url.trim() : null;
    
    const result = await pool.query(
      `INSERT INTO projects (title, description, github_link, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [sanitizedTitle, sanitizedDescription, sanitizedGithubLink, sanitizedImageUrl]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update project (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github_link, image_url } = req.body;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid project ID is required' });
    }
    
    // Validation
    if (title && (typeof title !== 'string' || title.trim().length === 0)) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    if (description && (typeof description !== 'string' || description.trim().length === 0)) {
      return res.status(400).json({ error: 'Description must be a non-empty string' });
    }
    if (github_link && typeof github_link !== 'string') {
      return res.status(400).json({ error: 'GitHub link must be a string' });
    }
    if (github_link && !github_link.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ error: 'GitHub link must be a valid URL' });
    }
    if (image_url && typeof image_url !== 'string') {
      return res.status(400).json({ error: 'Image URL must be a string' });
    }
    if (image_url && !image_url.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ error: 'Image URL must be a valid URL' });
    }
    
    // Sanitize inputs
    const sanitizedTitle = title ? title.trim() : undefined;
    const sanitizedDescription = description ? description.trim() : undefined;
    const sanitizedGithubLink = github_link ? github_link.trim() : null;
    const sanitizedImageUrl = image_url ? image_url.trim() : null;
    
    const result = await pool.query(
      `UPDATE projects 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           github_link = COALESCE($3, github_link), 
           image_url = COALESCE($4, image_url), 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [sanitizedTitle, sanitizedDescription, sanitizedGithubLink, sanitizedImageUrl, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete project (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;