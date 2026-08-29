import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  try {
    // Create bio table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bio (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cv_link VARCHAR(500),
        image_url VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        github_link VARCHAR(500),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create skills table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        proficiency INTEGER CHECK (proficiency >= 1 AND proficiency <= 5),
        icon VARCHAR(100)
      )
    `);

    // Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create social_links table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        url VARCHAR(500) NOT NULL,
        icon VARCHAR(100) NOT NULL,
        hover_color VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin_credentials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default bio if table is empty
    const bioExists = await pool.query('SELECT COUNT(*) FROM bio');
    if (parseInt(bioExists.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO bio (name, title, description, cv_link)
        VALUES ($1, $2, $3, $4)
      `, ['Amanuel Hailie', 'Full-Stack Developer (PERN Stack Specialist)', 'Computer Science graduate passionate about building modern web applications with PostgreSQL, Express, React, and Node.js.', '']);
    }

    // Insert default skills if table is empty
    const skillsExists = await pool.query('SELECT COUNT(*) FROM skills');
    if (parseInt(skillsExists.rows[0].count) === 0) {
      const defaultSkills = [
        { name: 'PostgreSQL', category: 'Backend', proficiency: 4 },
        { name: 'Express.js', category: 'Backend', proficiency: 4 },
        { name: 'React', category: 'Frontend', proficiency: 4 },
        { name: 'Node.js', category: 'Backend', proficiency: 4 },
        { name: 'JavaScript', category: 'Frontend', proficiency: 5 },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 4 },
        { name: 'REST APIs', category: 'Backend', proficiency: 4 },
        { name: 'Git', category: 'Tools', proficiency: 4 }
      ];

      for (const skill of defaultSkills) {
        await pool.query(`
          INSERT INTO skills (name, category, proficiency)
          VALUES ($1, $2, $3)
        `, [skill.name, skill.category, skill.proficiency]);
      }
    }

    // Insert default social links if table is empty
    const socialLinksExists = await pool.query('SELECT COUNT(*) FROM social_links');
    if (parseInt(socialLinksExists.rows[0].count) === 0) {
      const defaultSocialLinks = [
        { name: 'GitHub', url: 'https://github.com/amanuelhileaman-oss', icon: 'FaGithub', hover_color: 'hover:bg-gray-800 hover:text-white dark:hover:bg-gray-700', display_order: 1 },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aman12tafir', icon: 'FaLinkedin', hover_color: 'hover:bg-blue-600 hover:text-white', display_order: 2 },
        { name: 'YouTube', url: 'https://www.youtube.com/@Amanuel12_Hai', icon: 'FaYoutube', hover_color: 'hover:bg-red-600 hover:text-white', display_order: 3 },
        { name: 'Facebook', url: 'https://facebook.com/amanuel.hailie', icon: 'FaFacebook', hover_color: 'hover:bg-blue-500 hover:text-white', display_order: 4 },
        { name: 'X', url: 'https://x.com/AmanHailie', icon: 'FaXTwitter', hover_color: 'hover:bg-black hover:text-white dark:hover:bg-gray-600', display_order: 5 },
        { name: 'Instagram', url: 'https://instagram.com/amanuel_hailie', icon: 'FaInstagram', hover_color: 'hover:bg-pink-600 hover:text-white', display_order: 6 }
      ];

      for (const socialLink of defaultSocialLinks) {
        await pool.query(`
          INSERT INTO social_links (name, url, icon, hover_color, display_order)
          VALUES ($1, $2, $3, $4, $5)
        `, [socialLink.name, socialLink.url, socialLink.icon, socialLink.hover_color, socialLink.display_order]);
      }
    }

    // Insert default admin credentials if table is empty
    const adminExists = await pool.query('SELECT COUNT(*) FROM admin_credentials');
    if (parseInt(adminExists.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO admin_credentials (email, password)
        VALUES ($1, $2)
      `, [process.env.ADMIN_EMAIL || 'amanuelhailie12@gmail.com', process.env.ADMIN_PASSWORD || 'admin123']);
    }

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();