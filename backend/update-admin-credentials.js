import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updateAdminCredentials() {
  const newEmail = process.argv[2]; // Get email from command line argument
  const newPassword = process.argv[3]; // Get password from command line argument
  
  if (!newEmail || !newPassword) {
    console.log('Usage: node update-admin-credentials.js <new-email> <new-password>');
    console.log('Example: node update-admin-credentials.js amanuelhailie12@gmail.com aman_1221');
    process.exit(1);
  }

  try {
    // Check if admin credentials exist
    const result = await pool.query('SELECT * FROM admin_credentials ORDER BY id LIMIT 1');
    
    if (result.rows.length === 0) {
      console.log('❌ No admin credentials found. Run "node init-db.js" first.');
      process.exit(1);
    }

    const admin = result.rows[0];
    
    // Update both email and password
    await pool.query(
      'UPDATE admin_credentials SET email = $1, password = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newEmail, newPassword, admin.id]
    );

    console.log('✅ Admin credentials updated successfully!');
    console.log('   New Email:', newEmail);
    console.log('   New Password:', newPassword);
    console.log('\n💡 You can now login with these credentials on any device.');
  } catch (error) {
    console.error('❌ Error updating credentials:', error);
  } finally {
    await pool.end();
  }
}

updateAdminCredentials();
