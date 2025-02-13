
# Recipe Hub

Recipe Hub is a modern web application that allows users to discover, save, and share recipes. Built with React, Express, and TypeScript, it offers a seamless experience for food enthusiasts to explore and manage their favorite recipes.

## Features

- 🔐 User authentication (login/register)
- 📱 Responsive design for all devices
- 🔍 Recipe search and filtering
- ⭐ Save favorite recipes
- 📝 Detailed recipe information including:
  - Preparation and cooking time
  - Serving size
  - Ingredients list
  - Step-by-step instructions
  - Dietary restrictions
  - Cuisine type

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - TanStack Query
  - Tailwind CSS
  - Shadcn UI Components
  - Wouter (for routing)

- **Backend**:
  - Express.js
  - TypeScript
  - Drizzle ORM
  - PostgreSQL
  - Passport.js (authentication)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://0.0.0.0:5000`

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Express backend server
├── shared/          # Shared TypeScript types and schemas
└── public/          # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
