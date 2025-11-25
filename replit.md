# RaaP React App - Modular Feasibility Tool

## Overview
This is a React + Vite application for analyzing modular construction feasibility. The app provides tools for:
- Building configuration and design planning
- Cost analysis comparing site-built vs modular construction
- Unit optimization and floor plan placement
- Portfolio and project management

## Project Structure
- **raap-react-app/**: Main React application directory
  - **src/**: Source code
    - **components/**: React components including tabs for different analysis views
    - **contexts/**: ProjectContext for global state management
    - **engines/**: Calculation engines for cost, floorplan, and optimization
    - **data/**: Constants and city data
    - **hooks/**: Custom React hooks
  - **public/**: Static assets and images
  - **index.html**: Entry HTML file
  - **vite.config.js**: Vite configuration (configured for Replit proxy)

## Technology Stack
- React 19.2.0
- Vite 7.2.2 (build tool and dev server)
- Node.js 20

## Development Setup
- Frontend runs on port 5000
- Vite dev server configured to bind to 0.0.0.0 for Replit compatibility
- HMR (Hot Module Replacement) enabled with WebSocket support

## Workflow
- **Start application**: Runs `npm run dev` in the raap-react-app directory
- Dev server starts on port 5000 with hot reloading

## Deployment
- Type: Static site deployment
- Build command: `npm run build --prefix raap-react-app`
- Output directory: `raap-react-app/dist`

## Recent Changes (November 21, 2025)
- Imported from GitHub and configured for Replit environment
- Updated Vite configuration to support Replit's proxy (0.0.0.0:5000, HMR settings)
- Installed all npm dependencies
- Created .gitignore for Node.js project
- Configured deployment settings for static site hosting
- Verified application runs successfully with all features working
