# Cargo Logistics Monorepo

Multilingual cargo logistics platform connecting **shippers** and **carriers**. Monorepo contains a Next.js frontend and Express + PostgreSQL backend using Sequelize.

## Structure
- `backend/` – Express API, Sequelize models, JWT auth, seed and test scripts.
- `frontend/` – Next.js + Tailwind + react-i18next UI with multilingual forms.

## Quickstart
1. Clone/open the repo.
2. Install backend deps and configure environment:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit DATABASE_URL + JWT_SECRET
   npm run dev
   ```
3. Install frontend deps:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

Backend runs on port `5000` by default; frontend points to the API via `NEXT_PUBLIC_API_URL`.

## Fast Preview (seed + run both apps)
You can populate demo data and view the UI with the seeded accounts:

```bash
# Terminal 1: start backend (after configuring .env)
cd backend
npm install
node seed.js
npm run dev

# Terminal 2: start frontend (uses seeded API URL)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000 and login with either seeded account:
- Shipper: `shipper@demo` / `1234`
- Carrier: `carrier@demo` / `1234`

These accounts already have one shipment and offer so you can immediately preview dashboards and details.

## Database + Seeding
Ensure PostgreSQL is running and the database from `DATABASE_URL` exists. Run the seed script to create demo users and data:
```bash
cd backend
node seed.js
```
Seeds:
- Shipper: `shipper@demo` / `1234`
- Carrier: `carrier@demo` / `1234`
- One shipment and one offer are created with multilingual fields.

## API Endpoints
- `POST /api/auth/register` – register user `{ name, email, password, role, preferred_language? }`
- `POST /api/auth/login` – login, returns `{ token }`
- `POST /api/shipments` – create shipment (shipper only)
- `GET /api/shipments` – list shipments (filters: origin, destination, status)
- `GET /api/shipments/:id` – shipment details + offers
- `PUT /api/shipments/:id` – update (owner shipper)
- `DELETE /api/shipments/:id` – delete (owner shipper)
- `POST /api/shipments/:shipmentId/offers` – create offer (carrier)
- `GET /api/shipments/:shipmentId/offers` – list offers (owner shipper)
- `PUT /api/offers/:id` – update status (shipper accepts/rejects)

## Multilingual UI
Translations live in `frontend/locales/*.json` for English, Mongolian, Chinese (Simplified), and Russian. Language is persisted via localStorage using the LangSwitcher component.

## Test Flow Script
`backend/scripts/testFlow.js` runs a quick API walkthrough (requires servers + DB running). Start backend first then execute:
```bash
cd backend
node scripts/testFlow.js
```

## Development Tips
- Backend uses CommonJS (`require`) for compatibility without transpilation.
- Frontend uses React hooks and axios wrapper in `frontend/lib/api.js` to add JWT token headers.
- Update Tailwind styles in `frontend/styles/globals.css`.

## Deployment Notes (high level)
- Frontend: deploy to Vercel; set `NEXT_PUBLIC_API_URL` to deployed backend URL.
- Backend: deploy to Railway/Render; configure `DATABASE_URL` and `JWT_SECRET`; enable CORS origins.
- Database: use managed Postgres such as Neon or Supabase.
