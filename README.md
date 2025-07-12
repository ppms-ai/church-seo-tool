# Church SEO Dashboard

This project is a small demo showing how a church can submit sermons and view generated content.  It uses React with Supabase for data storage and authentication.

## Environment Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
   (If your environment does not have internet access you may need to pre-load `node_modules`.)

2. **Create a `.env` file**
   ```bash
   cp .env.example .env
   ```
   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for your Supabase project.  The example values point to a demo project.

3. **Run database migrations**
   The `supabase/migrations` folder contains SQL scripts that create the following tables:
   - `churches`
   - `church_users`
   - `sermons`
   - `sermon_content`

   You can apply them with the Supabase CLI:
   ```bash
   npx supabase db reset --local
   ```
   or through the Supabase dashboard by running each script manually.

## Creating Church Users

Authentication uses Supabase Auth.  Accounts can be created in two ways:

1. **Via the Supabase Dashboard** – navigate to **Authentication → Users** and create a new user with an email and password.
2. **Via the sign up option on the login screen** – users can self‑register if you leave sign up enabled.

After a user is created you must insert a record into the `church_users` table linking the user to a church.  An example SQL snippet:
```sql
INSERT INTO church_users (church_id, user_id, role)
VALUES ('<church uuid>', '<auth user id>', 'admin');
```

Once linked, the user can log in and will only see data for their own church.

## Running the App

```bash
npm run dev
```

The sermon submission form and Content Hub work the same as before, but they are now protected by authentication.  An admin user can access `/admin` to manage church records and reset passwords.
