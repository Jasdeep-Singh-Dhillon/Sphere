# Sphere

A real-time communication platform (Discord-like) for messaging, voice calls, and community management. Built with Next.js and Convex.

## Features

- **Server Management** - Create and join servers, organize channels into categories
- **Text Channels** - Real-time messaging with file uploads, message editing, and deletion
- **Voice Channels** - WebRTC-based voice communication with signaling
- **User Authentication** - Email/password, Google, and GitHub login via Better Auth
- **User Profiles** - Custom usernames, avatars, and about sections
- **Roles & Permissions** - Custom roles with granular permissions (view channels, manage roles, admin)
- **Invite System** - Server invite links
- **Server Profiles** - Per-server display names and avatars
- **File Storage** - Image/file uploads via Convex storage

## Technologies

- **Next.js** 15 with Turbopack
- **React** 19
- **TypeScript**
- **Convex** - real-time backend, database, and storage
- **Better Auth** - authentication (email/password, GitHub, Google)
- **Turso** (libSQL) - user database
- **Tailwind CSS** v4
- **Radix UI** - accessible UI primitives
- **Lucide React** - icons
- **Motion** - animations
- **Sonner** - toast notifications
- **Zod** - validation
- **Date-fns** - date formatting
- **Stripe** - payment processing (in progress)
- **MediaSoup** - WebRTC media handling

## Getting Started

```bash
bun install
bun dev        # start dev server with Turbopack
bun run build  # build for production
```

Requires Convex deployment, Turso database, and OAuth provider credentials configured in environment variables.

## Project Structure

```
convex/              - Convex backend (schema, queries, mutations)
  schema.ts          - database schema (users, servers, channels, messages, etc.)
  servers.ts         - server CRUD and queries
  channels.ts        - channel queries
  messages.ts        - message CRUD
  users.ts           - user management
  webrtc.ts          - WebRTC signaling messages
  storage.ts         - file upload handling
src/
  app/               - Next.js pages (login, register, channels, account, onboarding)
  components/        - UI components
  hooks/             - custom React hooks
  lib/               - utility functions
  types/             - TypeScript types
  auth.ts            - Better Auth configuration
  env.js             - environment variable validation
```
