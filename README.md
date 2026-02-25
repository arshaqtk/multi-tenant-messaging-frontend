# Chat App Frontend

React + Vite frontend for the multi-tenant messaging backend.

## Tech Stack

- React (functional components + hooks)
- React Router v6
- Axios
- Socket.IO client

## Features

- Register organization admin
- Login with `email + password`
- JWT stored in `localStorage`
- Role-aware routes (`admin` vs normal user)
- Admin panel:
  - create users
  - fetch users
  - create groups
  - add users to groups
  - view group members
- Chat page:
  - fetch groups
  - load persisted message history per group
  - realtime messages via Socket.IO
  - HTTP fallback when socket is disconnected

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

3. Run dev server:

```bash
npm run dev
```

## Route Structure

- `/login`
- `/register`
- `/chat` (authenticated)
- `/admin` (authenticated + admin role)

## API Integration (current backend)

- `POST /auth/register-org-admin`
- `POST /auth/login`
- `GET /users`
- `POST /users`
- `GET /groups`
- `POST /groups`
- `POST /groups/:groupId/members`
- `GET /groups/:groupId/messages`
- `POST /groups/:groupId/messages`

## Notes

- Admin/member UI is intentionally minimal; focus is functionality.
- If websocket fails, sending falls back to HTTP message post.
- Login does not ask for orgId; backend resolves account by email/password.
- If the same email and password match multiple org accounts, backend may return an ambiguity error.

## Build

```bash
npm run build
```
