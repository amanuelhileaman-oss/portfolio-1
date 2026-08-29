const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkSocialLinks() {
  try {
    const result = await pool.query('SELECT name, hover_color FROM social_links ORDER BY display_order');
    console.log('Current social links hover colors:');
    result.rows.forEach(row => {
      console.log(`${row.name}: ${row.hover_color}`);
    });
  } catch (error) {
    console.error('Error checking social links:', error);
  } finally {
    await pool.end();
  }
}

checkSocialLinks();
