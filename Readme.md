# E-LearninGs

Monorepo with a Node/Express backend and a React + Vite frontend.

## Repository layout
- server/ — Express backend
  - server.js — app entry
  - config/db.js — DB pool
  - controllers/, routes/, middleware/
  - generate-hash.js — helper to create bcrypt hashes
  - uploads/ — uploaded files
  - package.json, .env (store DB and PORT)
- vite-project/ — React (Vite) frontend
  - src/ — components, pages, services
  - src/services/api.js — API_BASE and axios helpers
  - index.html, package.json
- elearning_db.sql — database schema and sample data

## Requirements
- Node.js 18+ (recommended)
- npm or yarn
- MySQL (or configured DB matching server/config/db.js)

## Quick start (local)
1. Prepare DB
   - Create DB and run elearning_db.sql.
   - Put DB credentials in server/.env (or adjust server/config/db.js).

2. Run backend
   ```powershell
   cd server
   npm install
   npm run dev    # or: node server.js
   ```
   Default API base: http://localhost:5000/api (check server/.env)

3. Run frontend
   ```powershell
   cd vite-project
   npm install
   npm run dev
   ```
   Open URL printed by Vite (usually http://localhost:5173).

## Important files & notes
- API base used by frontend: vite-project/src/services/api.js — update when backend port changes.
- Uploads handled by server/middleware/uploadMiddleware.js; static files served from server (see server.js).
- Protect routes with server/middleware/authMiddleware.js and role checks in server/middleware/roleMiddleware.js.

## Common commands
- Backend dev: cd server && npm run dev
- Frontend dev: cd vite-project && npm run dev
- Generate password hash (example): node server/generate-hash.js

## Development tips
- Run frontend and backend in separate terminals.
- Keep controllers in server/controllers/ and frontend pages in vite-project/src/pages/.
- If adding environment variables, document them in server/.env.example.

## Contributing
- Follow existing code structure and conventions.
- Add tests when modifying core logic.

## License
Add license information here.