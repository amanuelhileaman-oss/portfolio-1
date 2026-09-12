import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const isLocalDb = !process.env.DATABASE_URL || 
  process.env.DATABASE_URL.includes('localhost') || 
  process.env.DATABASE_URL.includes('127.0.0.1');

let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalDb ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
    max: 20
  });

  // Test database connection with auto-retry (handles serverless cold-starts)
  const testConnection = async (retries = 3, delay = 2500) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected successfully at:', res.rows[0].now);
        return;
      } catch (err) {
        const errorMessage = err.message || (err.errors ? err.errors.map(e => e.message).join('; ') : err.code) || 'Connection timeout';
        if (attempt < retries) {
          console.warn(`Database waking up / connecting (attempt ${attempt}/${retries}). Retrying in ${delay/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error('Database connection error (check DATABASE_URL in .env):', errorMessage);
        }
      }
    }
  };

  testConnection();

  pool.on('error', (err) => {
    const msg = err.message || err.code || 'Unknown pool error';
    console.error('Unexpected database pool error:', msg);
  });
} catch (err) {
  console.error('Failed to initialize PostgreSQL pool:', err.message);
  pool = new Pool();
}

// Export pool for routes
export { pool };

// Import routes
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import skillsRoutes from './routes/skills.js';
import contactRoutes from './routes/contact.js';
import bioRoutes from './routes/bio.js';
import socialLinksRoutes from './routes/socialLinks.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/bio', bioRoutes);
app.use('/api/social-links', socialLinksRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app };