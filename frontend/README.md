# Portfolio Frontend

Modern React portfolio website with theme switching, hierarchical skills display, and admin dashboard management.

## Features

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Theme Switching**: Light, dark, and system theme options
- **Hierarchical Skills Display**: Skills organized by main categories and sub-categories
- **Interactive Skills Section**: Category filtering and expandable sections
- **Admin Dashboard**: Full CRUD operations for portfolio content
- **Authentication**: Secure admin login with JWT tokens
- **Component Testing**: Unit tests with Vitest and React Testing Library

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on port 5000

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (if needed):
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── AdminDashboard.jsx    # Admin panel for content management
│   ├── Skills.jsx             # Skills display with hierarchical categories
│   ├── ThemeToggle.jsx        # Theme switcher with dropdown
│   └── __tests__/             # Component unit tests
├── contexts/
│   ├── ThemeContext.jsx       # Theme management context
│   └── AuthContext.jsx        # Authentication context
├── pages/
│   ├── Home.jsx               # Landing page
│   ├── Login.jsx              # User login page
│   └── AdminDashboard.jsx     # Admin dashboard
└── App.jsx                    # Main application component
```

## Key Components

### ThemeToggle
- Dropdown with Light, Dark, and System theme options
- Persists theme preference in localStorage
- Available in both admin and public views

### Skills Component
- Hierarchical category display (Main > Sub > Skills)
- Interactive category filtering
- Expandable/collapsible sections
- Proficiency bars with color coding

### AdminDashboard
- Secure admin authentication
- CRUD operations for:
  - Skills with hierarchical categories
  - Projects
  - Bio information
  - Social links
  - Contact messages
- Theme switcher integration

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- Skills data processing and grouping
- Category hierarchy parsing
- Proficiency color logic
- Component rendering
- Data validation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm test` - Run test suite

## Theme System

The application supports three themes:
- **Light**: Light mode with light colors
- **Dark**: Dark mode with dark colors
- **System**: Follows system preference

Theme preference is persisted in localStorage and applied globally.

## Skills Categorization

Skills are organized hierarchically:
- **Main Categories**: Development, Specialized, Other, Soft Skills
- **Sub Categories**: Frontend, Backend, DevOps, Design, etc.
- **Format**: "Main Category > Sub Category"

Example: "Development > Frontend"

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (defaults to localhost:5000) |

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Deployment

The frontend can be deployed to:
- **Vercel** - Recommended for React apps
- **Netlify** - Alternative deployment platform
- **GitHub Pages** - Static hosting

For deployment, ensure the `VITE_API_URL` environment variable points to your production backend URL.

## License

ISC
