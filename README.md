# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

## Deployment to Render

This application is configured to deploy on Render with a PostgreSQL database.

### Prerequisites

1. A Render account
2. GitHub repository connected to Render
3. An existing PostgreSQL database on Render

### Deployment Steps

1. **Create a new Web Service on Render:**

   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

2. **Environment Variables:**

   - `DATABASE_URL` - Set this manually to your existing database connection string
     - Go to your existing database on Render dashboard
     - Copy the "External Database URL" or "Internal Database URL"
     - Add this as an environment variable in your web service
   - `NODE_ENV` - Set to "production" (already configured in render.yaml)

3. **Get Your Database Connection String:**

   - In your Render dashboard, go to your existing database
   - Copy the connection string from the "Connections" section
   - Use the "External Database URL" for connecting from your web service

4. **Database:**

   - Your existing database will be used
   - Migrations will run automatically on each deployment via the start script

5. **Manual Deployment:**
   If you prefer manual deployment without render.yaml:
   - Create a Web Service with Docker runtime
   - Set the DATABASE_URL environment variable to your existing database URL
   - Deploy

### Notes

- Make sure your existing database is accessible from your web service
- Database migrations run automatically before the app starts
- The Dockerfile handles all build steps including Prisma client generation
- If you need to run migrations manually, you can use the Render shell to run `npx prisma migrate deploy`

---

Built with ❤️ using React Router.
