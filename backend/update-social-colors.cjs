const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updateSocialLinks() {
  try {
    await pool.query('UPDATE social_links SET hover_color = $1 WHERE name = $2', ['hover:bg-gray-900 hover:text-white', 'GitHub']);
    await pool.query('UPDATE social_links SET hover_color = $1 WHERE name = $2', ['hover:bg-blue-700 hover:text-white', 'LinkedIn']);
    await pool.query('UPDATE social_links SET hover_color = $1 WHERE name = $2', ['hover:bg-red-600 hover:text-white', 'YouTube']);
    await pool.query('UPDATE social_links SET hover_color = $1 WHERE name = $2', ['hover:bg-blue-600 hover:text-white', 'Facebook']);
    await pool.query('UPDATE social_links SET hover_color = $1 WHERE name = $2', ['hover:bg-black hover:text-white', 'X']);
    await pool.query('UPDATE social_links SET hover_color = $1 WHERE name = $2', ['hover:bg-pink-600 hover:text-white', 'Instagram']);
    console.log('Social links hover colors updated successfully!');
  } catch (error) {
    console.error('Error updating social links:', error);
  } finally {
    await pool.end();
  }
}

updateSocialLinks();
