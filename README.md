# Smart Energy Management System

## Project Overview
This is a smart energy management system for residential solar-plus-battery setups using real-world data.
The project consists of a React Native mobile frontend and a Node.js Express backend.

## Development Information

### Project Structure

- **Frontend**:
  - Uses React Native with Expo
  - Navigation is handled by Expo Router with a tab-based structure
  - User flow:
    1. User starts on landing page where they select a site (stored in context)
    2. User is then brought to the index/home page with tabs navigation
  - Component hierarchy:
    - Each tab fetches data from the backend and passes it to its components
    - Components receive data via props and don't access the backend directly
    - This design reduces backend calls and maintains a clear hierarchy

- **Backend**:
  - Uses Express.js for the server
  - Uses Neon for PostgreSQL database access
  - API endpoints:
    - `/api/site/:siteId`: Get information about a specific site
    - `/api/finReport`: Financial report routes
    - `/api/weather`: Weather data routes

### Code Style and Practices

- **Frontend**:
  - Uses TypeScript for type safety
  - React functional components with hooks for state management
  - Uses absolute imports with the @ prefix (e.g., `@/components/SystemDiagram`)

- **Backend**:
  - Uses ES modules (type: "module" in package.json)
  - Structured with routes and controllers
  - SQL queries are executed using template literals with the Neon client

### Scaling Approach

- Home/index and Financial report tabs are built for easy scaling and will grow as the database grows
- Model comparison page will only grow upon request
- Dynamic information should come from the database (call made in tab and passed to component)
- Constant information should be hard-coded in components

## Deployment Information

- Backend is currently hosted on Render
- Frontend is a mobile application built with React Native and Expo
