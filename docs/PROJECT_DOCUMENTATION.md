# Project Documentation — airbnb-clone

Generated: 2025-10-22

This document captures the repository layout, important files, and the runtime logic/flow for the main features I inspected (auth/storage, HTTP client, comments, rooms, admin). Use it as a single-source reference for the code that was recently edited and the design patterns used across the project.

---

## Repo high-level structure

Top-level files and folders (relevant):

- `package.json` — project manifest.
- `airbnb-clone/` — main app folder (the Next.js application). Everything below references files inside this folder.
  - `README.md`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, etc.
  - `public/` — static assets.
  - `src/` — application source code (primary focus):
    - `api/` — thin axios-based API wrappers that call the backend endpoints.
    - `services/` — service-layer adapters that call `api/` and normalize responses.
    - `hooks/` — React Query and feature hooks (comments, rooms, locations, auth helpers).
    - `components/` — UI components grouped by feature.
    - `app/` — Next.js App Router pages and layouts (app-level routing).
    - `pages/` — remnants of Pages Router (some files existed earlier and may have been removed to avoid route collisions).
    - `helpers/` — small utilities (storage, formatters, etc.).
    - `types/` — TypeScript type definitions for domain objects (comment, room, user, booking, ...).
    - `services/` — domain logic wrappers (e.g., `commentService`, `roomService`).


## Key files and logic (what I inspected and summarized)

Below are file-level summaries. If you need deeper per-line notes, tell me which file(s) and I'll expand.

### `src/helpers/storage.ts`
- Purpose: small wrapper around `localStorage` to store commonly-used keys (auth token, user info) and provide generic get/set/remove helpers.
- Exports: `storage` object with methods:
  - `setToken(token: string)`, `getToken(): string | null`, `removeToken()`
  - `set(key: string, value: string)`, `get(key: string): string | null`, `remove(key: string)`
  - `clear()` to wipe localStorage (used rarely; use with care)
- Notes:
  - Methods guard `typeof window !== 'undefined'` to be safe under SSR.
  - Used by many modules (axios client, Navbar, auth flows) to persist auth state.


### `src/api/axiosClient.ts`
- Purpose: single axios instance pre-configured with base URL and default headers and interceptors.
- Configuration:
  - `baseURL` set to the backend API root `https://airbnbnew.cybersoft.edu.vn/api`.
  - Default `Content-Type: application/json` and static `tokenCybersoft` header in the instance.
- Request interceptor behavior:
  - Ensures `config.headers` exists (prevents runtime errors when other code overwrites headers).
  - Reads `storage.getToken()` and, when present, sets a `token` header (per-user auth token) on every request.
  - Ensures a `tokenCybersoft` header exists on each request (some code paths may override headers - this enforces it).
- Response interceptor behavior:
  - On success: returns `response.data` (the response unwrapped).
  - On error: inspects `error.response.data` and logs details. If the response indicates an auth failure (status 403), the interceptor clears stored auth keys (`storage.removeToken()`, `storage.remove('user')`, `storage.remove('userInfo')`) so the UI can react (redirect to login, etc.).
  - Returns a rejected promise with the error body or message so callers can handle user-facing errors.
- Notes:
  - The interceptor uses defensive typing for headers to satisfy TypeScript and to avoid throwing when headers are replaced.


### `src/api/comment.api.ts` (API wrapper)
- Purpose: thin wrappers for the comment-related backend endpoints (get all, get by room, create, update, delete).
- Behavior: each function calls `axiosClient` and returns the backend response. The service layer normalizes `content`.


### `src/services/commentService.ts`
- Purpose: service layer that calls `commentApi` and normalizes responses for UI/hooks.
- Behavior details:
  - `getAll()` — returns `res?.content || []` (handles both `{ content: [...] }` and directly returned arrays).
  - `getById(roomId)` — calls API endpoint for comments by room and returns `res?.content || []`.
  - `create(data: CreateCommentRequest)` — calls API to create a comment, and returns `res?.content` if present. If the backend doesn't return the expected `content` object, the service builds a fallback Comment object using the input data and a generated `id` (Date.now()) so UI code can proceed without crashing.
  - `update` / `delete` — call their respective APIs and return normalized results.
- Rationale:
  - Backend responses are inconsistent: sometimes the API returns an envelope `{ content: ... }`, sometimes raw objects/arrays. The service layer provides a stable shape to the rest of the app.
- Logging:
  - The service includes console logs for create operations to help debug cases where POST says success but UI doesn't update.


### `src/hooks/Room/useComment.ts`
- Purpose: React Query hook for comments scoped to a single room (MaPhong).
- Exports: `useComment(roomId: number)` returns:
  - `comments`, `isLoading`, `isError`, `error`, `refetch`
  - `createComment` mutation (with optimistic updates)
  - `updateComment` mutation
  - `deleteComment` mutation
  - `isCreating` boolean
- Query behavior:
  - Primary queryKey: `['comments', roomId]`.
  - `queryFn` tries `commentService.getById(roomId)`. If that returns empty, it falls back to `commentService.getAll()` then filters locally by `maPhong` — a defensive measure against inconsistent backend endpoints.
- Mutation behavior (create):
  - Optimistic update: onMutate inserts a temporary comment (with `id = Date.now()`) at the top of the comments list while the network call is pending.
  - onError: rolls back to the previous cached list.
  - onSuccess: invalidates and refetches the `['comments', roomId]` query to sync with backend truth.
- Notes:
  - This hook centralizes optimistic UI and fallback behavior so the UI components can be simple.


### `src/components/room/RoomReview.tsx`
- Purpose: UI component that shows the rating & comments list for a room and includes a form to submit a new comment.
- Props: `roomId: number` (MaPhong)
- Uses: `useComment(roomId)` hook.
- UI & Flow highlights:
  - Shows room id at the top for clarity.
  - Shows a scrollable comments list; displays a friendly empty state when there are no comments.
  - Includes a rating (`antd` Rate) and a textarea to submit new comments.
  - Submitting triggers `createComment.mutateAsync(...)` and uses toasts/messages to show success/failure.
  - The component handles errors defensively (catching `unknown` and extracting status codes safely) and shows a 403-specific message (asks user to login).
- Notes:
  - Since the hook performs optimistic updates, a successfully posted comment appears immediately in the list; on success the hook refetches to replace temporary entries with backend-created ones.


### `Admin & Room manager (notes)`
- There is an admin section under the App Router (e.g., `src/app/(admin)/...`) which provides management UI for locations and rooms.
- During development a Pages Router file `src/pages/admin/rooms.tsx` duplicated the route `/admin/rooms`, causing Next to report a collision. That duplicate Pages file was removed to keep the App Router route authoritative.
- A `useRoomManager` hook was implemented in the codebase following the pattern from `useLocationManager` (modal state, pagination, create/update/delete, image upload). If you can't find `src/hooks/Room/useRoomManager.ts`, it may be in a different path or wasn't saved — search for `useRoomManager` to locate it.


## How the comment flow works (end-to-end)
1. UI: `RoomReview` mounts and calls `useComment(roomId)`.
2. Hook: `useQuery(['comments', roomId])` runs `commentService.getById(roomId)`.
   - If API returns empty, hook fetches all comments and filters by `maPhong` client-side.
3. For creating a comment:
   - `createComment` mutation runs `commentService.create(payload)`.
   - The hook's `onMutate` performs an optimistic update: a temp comment with `id=Date.now()` is inserted into the cache.
   - If the network call fails, the hook rolls back to the previous cache.
   - On success, the hook invalidates and refetches `['comments', roomId]` to ensure the UI shows the backend-backed comment (which may include real ids/metadata).
4. The `commentService.create` returns a fallback object if the backend doesn't return `content`, avoiding crashes.


## Run & verify (PowerShell)
These commands assume you are using Windows PowerShell and the project root is the `airbnb-clone` directory inside the workspace.

```powershell
# change into the app folder
cd "E:\HocTap\HOC LAP TRUNH FULLStack\Do_An_FE_Next\airbnb-clone"

# install deps (if you haven't already)
npm install

# run dev server
npm run dev
```

What to look for while testing:
- No error about duplicate routes ("App Router and Pages Router both match path /admin/rooms"). If you still see such an error, search for any `src/pages/*` file that matches the path and remove/rename it.
- In the browser, open a Room detail page and test adding a comment:
  - Check console/server logs for `[commentService] create` debug logs.
  - The new comment should appear immediately (optimistic update). After a short time the app refetches comments and replaces the temporary comment with the backend one (if returned).
- If the backend returns 403 on protected endpoints, the axios client will clear `storage` keys (token, user) and the UI should prompt a login.


## Where to look for related code
- API layer: `src/api/*.ts` (e.g., `comment.api.ts`, `room.api.ts`, `user.api.ts`)
- Services: `src/services/*.ts` (e.g., `commentService.ts`, `roomService.ts`)
- Hooks: `src/hooks/**` (feature-specific hooks using React Query)
- Components: `src/components/**` (UI parts used by pages)
- App Router pages: `src/app/**` (production routes) — prefer these over `src/pages` files.
- Types: `src/types/*.ts` for domain models and request payload shapes.


## Known caveats & troubleshooting
- Inconsistent backend response shapes: many services defensively read `res?.content || res` to support either envelope or raw responses.
- If `storage` methods are missing or mismatched, the app may throw `storage.get is not a function` in components that expect the compatibility methods — ensure `src/helpers/storage.ts` exports `get/set/remove` alongside token helpers.
- If you get build-time type errors after edits, they are usually fixable by adding narrowings (use `unknown` in catch blocks and check shape before accessing properties).


## Next steps and suggestions
- If you want a deeper document for a specific file (line-by-line or function-by-function), tell me which file(s) and I will generate an expanded section.
- I can run the dev server in this environment and capture the terminal output and browser console logs if you want me to verify the runtime behavior now — say "Chạy dev & kiểm tra" and I will proceed.


---

If you want I can also generate per-file diagrams or a simple Mermaid architecture diagram showing the API -> Service -> Hook -> Component flow.

