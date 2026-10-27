# AAVIL ERP

A React + TypeScript frontend for employee, leave, project, timesheet, payroll, and appraisal workflows. The frontend lives at the repository root; the separate Fastify API and Supabase PostgreSQL backend live in [`backend/`](./backend/). Authentication, employee, leave, project, timesheet, payroll, and appraisal records are stored in Supabase.

## Requirements

- Node.js 22.12 or newer
- pnpm through Corepack (`corepack pnpm ...`)
- A Supabase project with a PostgreSQL database

## Local setup

1. Create a Supabase project. In the Supabase dashboard, open **Connect** and copy a PostgreSQL connection string. For a local Node.js server, use the **Session pooler** connection option if the direct connection is unavailable on your network or IPv4-only environment.
2. In PowerShell, run `Copy-Item backend\.env.example backend\.env`, then edit `backend\.env`. Set `DATABASE_URL` to the Supabase PostgreSQL connection string and replace the seed password with a unique password of at least 12 characters (maximum 72 UTF-8 bytes for bcrypt). Keep the file private and do not commit it. If the database password contains URL-special characters, use Supabase's URI-encoded connection string or percent-encode those characters.
3. Install dependencies:

   ```powershell
   corepack pnpm install
   ```

4. Apply the checked-in database migrations and create or complete the seeded account's employee profile:

   ```powershell
   corepack pnpm db:migrate
   corepack pnpm db:seed
   ```

   The seed script creates an account from `SEED_USER_*` settings if it does not exist, then creates its linked employee profile. For an existing account it does not change the password or account details; it only adds the missing profile. To seed another account, set a different email and run it again.

5. Start the frontend and API:

   ```powershell
   corepack pnpm dev:all
   ```

   Open the Vite URL printed in the terminal (usually <http://localhost:5173>). The frontend proxies `/api` requests to the API on port 3001. The health endpoint is <http://localhost:3001/api/health>.

If `corepack enable` fails due to Windows permissions, do not enable global shims; use `corepack pnpm` as shown above. If pnpm is unavailable, install pnpm for your user.

## API

- `GET /api/health` — database connectivity check
- `POST /api/auth/login` — verifies the account password and creates a server-side session
- `POST /api/auth/forgot-password` — sends a single-use reset link to an active account's email
- `POST /api/auth/reset-password` — changes the password using a valid one-time reset token
- `GET /api/auth/me` — returns the signed-in user
- `POST /api/auth/logout` — revokes the session
- `GET /api/employees` — administrators see all employee records; employees see only their linked profile
- `GET /api/employees/:id` — administrators can view any profile; employees can view only their own
- `POST /api/employees` — administrators create employee records
- `PATCH /api/employees/:id` — administrators update employee records
- `GET /api/leave-requests` — administrators see all requests; employees see their own requests and balance
- `POST /api/leave-requests` — submit a leave request from the linked employee account
- `PATCH /api/leave-requests/:id/review` — administrators approve or reject a pending request
- `GET /api/projects` — administrators see all projects; employees see their assigned projects
- `POST /api/projects` — administrators create projects and assign project team members
- `PATCH /api/projects/:id` — administrators update project progress
- `GET /api/timesheets` — employees see their timesheets; administrators see all timesheets
- `POST /api/timesheets` — create a weekly draft or submit a timesheet
- `PATCH /api/timesheets/:id` — edit a draft or rejected timesheet and optionally submit it
- `PATCH /api/timesheets/:id/review` — administrators approve or reject a submitted timesheet
- `GET /api/payroll` — administrators see all payroll records; employees see only their own
- `GET /api/payroll/:id` — retrieve an authorized payroll record
- `POST /api/payroll/runs` — administrators create a pay-period run with manually entered payroll figures
- `PATCH /api/payroll/:id/status` — administrators update a payroll record's status
- `GET /api/appraisals` — administrators see all reviews; employees see only their own
- `POST /api/appraisals/cycles` — administrators create a review for every active employee
- `PATCH /api/appraisals/:id/self-assessment` — employees submit their own self-assessment
- `PATCH /api/appraisals/:id/manager-review` — administrators complete submitted reviews
- `POST /api/accounts/employees/:employeeId/access-link` — administrators issue a one-time setup or password-reset link
- `PATCH /api/accounts/employees/:employeeId/active` — administrators activate or deactivate employee login access
- `POST /api/accounts/complete-setup` — consume a valid access link and set a password

Passwords are stored as bcrypt hashes. Session tokens are random, stored hashed in Supabase PostgreSQL, and sent to the browser only in an HTTP-only cookie. The cookie is `Secure` in production. Login and password recovery are rate limited.

Employee records are stored separately from login accounts. Creating an employee record does not create login credentials; an existing employee-role user with the same email is linked automatically. The seed command also creates or completes the seeded account's employee profile.

Leave requests are stored in PostgreSQL. The API counts weekdays (Monday–Friday, inclusive) and does not account for public holidays. Requests do not reduce balances while pending; annual, sick, and casual balances are checked and deducted atomically when an administrator approves. Maternity/paternity and unpaid leave do not deduct those balances.

Projects, project-team memberships, timesheets, and timesheet entries are stored in PostgreSQL. Employees can log time only against active projects assigned to them, and can edit only draft or rejected timesheets. Administrators review submitted timesheets. Hours are validated to a maximum of 24 per person per day.

Payroll runs and employee records are stored in PostgreSQL. Payroll amounts are entered by administrators; the API calculates gross earnings, deductions, and net pay and limits employees to viewing their own records. No tax rules, bank transfers, or payment-provider integrations are implemented; marking a record as paid is only a status update.

Performance reviews are stored in PostgreSQL. Administrators start a named cycle for all active employees; each employee submits a self-rating, reflection, and achievements, then an administrator records a manager rating and feedback. The overall rating is the mean of the two ratings, rounded to one decimal place. Employee access is restricted to their own reviews. The current account roles do not include a separate manager role, so manager reviews are administrator-only.

Employee login accounts are provisioned only by administrators; public signup is not available. From the employee directory an administrator can create a one-time setup link for an employee without an account, or a password-reset link for an existing employee account. These administrator-issued links expire after 24 hours and can be used once. The sign-in page also offers self-service password recovery for active employee and administrator accounts. It sends a one-time link that expires after 60 minutes; completing the reset revokes the account's existing sessions. To enable email recovery, set `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (a sender verified with Resend), and `APP_BASE_URL` in the backend environment. Keep the API key private and never expose it as a frontend environment variable. Until email is configured, self-service requests explain that recovery is unavailable and employees can ask an administrator to issue a reset link. Deactivating an employee account revokes its active sessions; marking the employee record inactive also disables its linked employee login.

Two-factor authentication is not implemented. Do not use payroll data as official tax or payment records without jurisdiction-specific review.

## Schema changes

After changing the Drizzle schema in [`backend/src/db/schema.ts`](./backend/src/db/schema.ts), generate a migration and apply it:

```powershell
corepack pnpm db:generate
corepack pnpm db:migrate
```

Migrations are applied in order from `backend/drizzle/` by `corepack pnpm db:migrate`; do not paste SQL into the Supabase SQL Editor when using this command. Phase 5 adds payroll tables, Phase 6 adds appraisal review records, Phase 7 adds one-time account-access tokens, and password recovery adds expiring reset-token records.
