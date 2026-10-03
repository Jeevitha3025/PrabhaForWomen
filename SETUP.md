# PRABHA – backend setup

## 1. Firebase (one time)
1. Firebase console → **Authentication** → enable **Email/Password**.
2. **Firestore** and **Storage** must be created (any region).
3. Deploy the security rules in this repo:
   ```
   npm i -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,storage
   ```

### Data layout
| Path | Who can read | What's in it |
|---|---|---|
| `users/{uid}` | only that user | name, email, role, lang, `profile`, `roadmapProgress`, `mentorPrivate.docPaths` |
| `mentors/{uid}` | that mentor, or anyone signed in once **approved** | public mentor card + `verificationStatus` |
| `requests/{id}` | the entrepreneur and the mentor involved | session requests (`requested` → `accepted`/`declined`) |
| Storage `mentor-docs/{uid}/…` | only that mentor (and you in the console) | uploaded ID / certificates |

## 2. Approving a mentor (manual toggle)
Firestore → `mentors` → pick the mentor's uid → edit `verificationStatus`:
`pending` → `approved` (or `rejected`). The mentor's app switches instantly — it listens with `onSnapshot`.
Their documents are under Storage → `mentor-docs/{uid}`.
Mentors can never set themselves to `approved`; the rules only let them write `pending`.

## 3. Emails (Resend)
Copy `artifacts/api-server/.env.example` → `.env` and fill in:
- `RESEND_API_KEY` – from resend.com
- `RESEND_FROM` – an address on a domain verified in Resend. Until you verify a domain,
  `onboarding@resend.dev` only delivers to the email you signed up to Resend with.
- `FIREBASE_PROJECT_ID=prabha-9f629` – the server verifies the user's sign-in token, and the
  email always goes to the address on that token (nobody can make the server mail a stranger).
- `ADMIN_EMAIL` (optional) – gets a "new mentor to verify" mail with a direct console link.

Frontend: `artifacts/prabha/.env` → `VITE_API_URL=http://localhost:8080` (change when deployed).
