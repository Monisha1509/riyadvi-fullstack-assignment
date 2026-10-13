# Riyadvi Software Technologies — Full Stack Interview Assignment

A responsive multi-page corporate website concept built with React, Vite, React Three Fiber, Three.js, Drei, GSAP/ScrollTrigger, Express and MongoDB. The visual direction uses black and gold, reusable data-driven service/portfolio/blog/career routes, lead forms and a protected admin summary dashboard.

> **Important:** This is an interview-assignment concept, not a claim that Riyadvi has approved the design or that sample portfolio/career content represents real client work or vacancies. Verify all company facts, test locally and in deployment, and be prepared to explain the code.

## Features

- Multi-page routing: Home, Services and service details, Portfolio and case studies, About, Blog and articles, Careers and job detail, Contact, Consultation, Business Health Checkup and Project Planning Guide.
- Interactive animated 3D gold sphere using Three.js, React Three Fiber, Drei, `OrbitControls`, `Float` and `MeshDistortMaterial`.
- GSAP entrance animations and ScrollTrigger reveal animations.
- Express API endpoints for contact, consultation, health-checkup, lead magnet and applications; Mongoose stores lead records in MongoDB.
- Basic request validation, Helmet, CORS allow-list, rate limiting and environment-based configuration.
- Admin dashboard at `/admin`, protected API request using the backend `ADMIN_TOKEN`, lead summary and recent submissions, CSV export.
- Route-level lazy loading for Home, content pages and admin dashboard.
- Responsive CSS and reduced-motion support.

## Requirements

- Node.js 20+ recommended
- npm
- MongoDB Atlas or a local MongoDB instance

## Run locally

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` from `.env.example` and set your own values:

```env
PORT=5000
MONGODB_URI=your-private-mongodb-connection-string
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
ADMIN_TOKEN=use-a-long-random-private-token
```

Never commit `.env` or share real credentials. Use a database user with only the permissions this application needs.

```bash
npm run dev
```

API default: `http://localhost:5000`  
Health check: `GET http://localhost:5000/api/health`

### Frontend (in another terminal)

```bash
cd frontend
npm install
```

Optional `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Then run:

```bash
npm run dev
```

Open `http://localhost:5173`. Admin dashboard: `http://localhost:5173/admin`.

## API endpoints

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| GET | `/api/health` | Service and database status | Public |
| POST | `/api/contact` | Contact enquiry | Public, rate-limited |
| POST | `/api/consultation` | Consultation request | Public, rate-limited |
| POST | `/api/health-checkup` | Business health checkup lead | Public, rate-limited |
| POST | `/api/lead-magnet` | Project guide lead | Public, rate-limited |
| POST | `/api/applications` | Job application | Public, rate-limited |
| GET | `/api/admin/summary` | Lead counts and recent records | Bearer token (`ADMIN_TOKEN`) |

Successful lead submissions return HTTP 201 and a record ID. The admin dashboard sends `Authorization: Bearer <ADMIN_TOKEN>` to the protected summary endpoint. The token is kept in page memory and is not saved to browser storage. Do not expose the admin token in frontend environment variables, source code, screenshots, Git history or public messages. For production use, consider a proper identity provider/session-based admin login and role-based authorization rather than a shared static token.

The project planning guide currently records a lead and displays a confirmation; an actual PDF asset and email/download delivery still need to be configured before describing it as a real download. Job applications currently accept a resume URL rather than uploading a file. Email notification, WhatsApp and Calendly integrations are not configured.

## AI Tools Used

- **Tool:** ChatGPT (AI assistant).
- **Purpose:** Helped plan the project, explain React/Express/MongoDB implementation, review errors and iterate on components and documentation.
- **Example prompt:** “Help me build a responsive multi-page React corporate website with a React Three Fiber hero, reusable service and portfolio routes, and an Express/MongoDB lead API. Explain changes and help debug build issues.”
- **Generated/assisted:** Initial component and route scaffolding, 3D scene ideas, API/middleware review, troubleshooting guidance and documentation improvements.
- **Manual work and verification:** The developer integrated the components into the project, ran the frontend production build, confirmed the contact form and MongoDB persistence during local testing, and reviewed the generated changes. Add any further manual changes and tests actually completed before submission; do not claim tests or tools that were not used.
- **Why selected:** Iterative explanations and debugging support while keeping code review, integration and final verification under the developer's control.

## Technology and animation notes

- **Three.js:** WebGL 3D rendering engine.
- **React Three Fiber:** React renderer used to compose the 3D scene.
- **Drei:** `Float`, `Stars`, `OrbitControls` and `MeshDistortMaterial` helpers/materials.
- **GSAP:** Hero entrance animation and reveal transitions.
- **GSAP ScrollTrigger:** Triggers reveal animations as sections enter the viewport.

These libraries are used in the implementation; simply installing a package is not considered a meaningful implementation. Verify the actual experience and performance on target devices. The 3D sphere is primarily an abstract visual and should be further refined if more explicit business/data storytelling is required by the evaluator.

## Performance and deployment

- Route-level lazy loading separates the home, general content and admin screens into asynchronously loaded route chunks.
- The 3D scene uses a capped device-pixel ratio and a lower star count in compact scenes.
- CSS includes responsive breakpoints and a reduced-motion media query.
- Run `npm run build` in `frontend` and review bundle-size warnings. Further improvements can include separating heavy Three.js dependencies into dedicated chunks, reducing unnecessary 3D mounts, checking mobile GPU behavior and running Lighthouse.

### Deploy

1. Initialize Git in the project root, verify `.gitignore` excludes all `.env` files and `node_modules`, then create meaningful commits.
2. Push the repository to GitHub with `frontend/`, `backend/` and `README.md`.
3. Deploy `frontend/` to Vercel. Set `VITE_API_URL` to the public backend URL.
4. Deploy `backend/` to Render or Railway with `MONGODB_URI`, `CLIENT_ORIGIN` set to the exact deployed frontend origin, `ADMIN_TOKEN` set to a long random secret, and `NODE_ENV=production`. Let the platform provide `PORT` if required.
5. Configure MongoDB Atlas network access and least-privilege credentials.
6. Verify the live `/api/health`, every form, `/admin`, mobile layout and browser/network logs. The live deployment is not complete until public URLs have been deployed and verified.

## Before submission checklist

- [ ] Run the frontend production build and fix errors/warnings where practical.
- [ ] Test all form types and direct-route refreshes.
- [ ] Verify `.env` is ignored and rotate any credentials previously exposed in screenshots or archives.
- [ ] Verify admin token protection and dashboard on the local environment.
- [ ] Test desktop, tablet, mobile, reduced motion, keyboard focus and form errors.
- [ ] Configure an actual guide file if claiming download delivery.
- [ ] Verify company facts against the official website; keep sample portfolio/jobs clearly labelled.
- [ ] Add meaningful Git commits and push to GitHub.
- [ ] Deploy frontend and backend and record their live URLs.
- [ ] Prepare to explain architecture, 3D implementation, API validation, database, performance trade-offs and known limitations.

## Known limitations

- Sample case studies, blog posts and job listings are demonstration content.
- Admin access uses a shared static bearer token; use proper user authentication/roles for a production system.
- The dashboard currently views records and exports CSV; it does not update lead status or edit records.
- Email notification, WhatsApp, Calendly and actual guide-file delivery are not configured.
- The application form accepts a resume URL rather than uploading a file.
- Live deployment and cross-device testing must be completed and verified separately.
