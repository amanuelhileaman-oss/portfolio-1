# Portfolio Backend API

Backend server for the portfolio website with PostgreSQL database and REST API endpoints.

## Features

- User authentication with JWT tokens
- Admin dashboard management
- Skills CRUD operations with hierarchical categories
- Projects management
- Bio information management
- Social links management
- Contact form handling
- Unit testing with Jest

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://username:password@host:port/database_name
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

5. Initialize the database:
```bash
node init-db.js
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 5000).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/category/:category` - Get skills by category
- `POST /api/skills` - Create new skill (admin only)
- `PUT /api/skills/:id` - Update skill (admin only)
- `DELETE /api/skills/:id` - Delete skill (admin only)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Bio
- `GET /api/bio` - Get bio information
- `PUT /api/bio` - Update bio (admin only)

### Social Links
- `GET /api/social-links` - Get all social links
- `POST /api/social-links` - Create new social link (admin only)
- `PUT /api/social-links/:id` - Update social link (admin only)
- `DELETE /api/social-links/:id` - Delete social link (admin only)

### Contact
- `GET /api/contact` - Get all contact messages (admin only)
- `POST /api/contact` - Submit contact form
- `DELETE /api/contact/:id` - Delete contact message (admin only)

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- Skills validation logic
- Category format validation
- Proficiency validation
- Data structure validation

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User authentication and profiles
- `skills` - Skills with hierarchical categories
- `projects` - Portfolio projects
- `bio` - Personal bio information
- `social_links` - Social media links
- `contact_messages` - Contact form submissions
- `admin_credentials` - Admin login credentials

## Security

- JWT token authentication
- Password hashing with bcrypt
- Admin-only routes protected with middleware
- Environment variables for sensitive data
- SQL injection prevention with parameterized queries

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Server port number | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `ADMIN_EMAIL` | Admin email for login | Yes |
| `ADMIN_PASSWORD` | Admin password for login | Yes |

## License

ISC
