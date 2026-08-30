import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updateAdminPassword() {
  const newPassword = process.argv[2]; // Get password from command line argument
  
  if (!newPassword) {
    console.log('Usage: node update-admin-password.js <new-password>');
    console.log('Example: node update-admin-password.js MyNewPassword123');
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
    
    // Update the password
    await pool.query(
      'UPDATE admin_credentials SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPassword, admin.id]
    );

    console.log('✅ Password updated successfully!');
    console.log('   Email:', admin.email);
    console.log('   New Password:', newPassword);
    console.log('\n💡 You can now login with these credentials on any device.');
  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await pool.end();
  }
}

updateAdminPassword();
