import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkAdminCredentials() {
  try {
    const result = await pool.query('SELECT id, email, updated_at FROM admin_credentials ORDER BY id LIMIT 1');
    
    if (result.rows.length === 0) {
      console.log('❌ No admin credentials found in the database');
      console.log('Run "node init-db.js" to create admin credentials');
    } else {
      const admin = result.rows[0];
      console.log('✅ Admin credentials found:');
      console.log('   ID:', admin.id);
      console.log('   Email:', admin.email);
      console.log('   Last Updated:', admin.updated_at);
      console.log('\n💡 Use this email and the password from your Render ADMIN_PASSWORD environment variable to login');
    }
  } catch (error) {
    console.error('Error checking admin credentials:', error);
  } finally {
    await pool.end();
  }
}

checkAdminCredentials();
