# Church Dashboard Testing Guide

## Quick Setup Steps

### 1. Connect to Supabase
- Click the "Connect to Supabase" button in the top right corner
- This will set up your database connection

### 2. Run Database Migrations
The migrations will automatically create all necessary tables:
- `churches` - Church organizations
- `church_users` - User roles and permissions  
- `sermons` - Sermon data
- `sermon_content` - Generated content

### 3. Create Test User Accounts

Since this uses Supabase Auth, you'll need to create actual user accounts:

**Option A: Create via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User" 
4. Create test users with these emails:
   - `admin@gracecommunity.org`
   - `pastor@firstbaptist.org`
   - `editor@gracecommunity.org`

**Option B: Use the Sign Up Flow** (if enabled)
1. Modify the LoginForm to include a sign-up option
2. Register new accounts through the UI

### 4. Link Users to Churches

After creating auth users, you'll need to manually link them to churches in the database:

```sql
-- Get the user IDs from Supabase Auth, then insert church_users records
INSERT INTO church_users (church_id, user_id, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'USER_ID_FROM_SUPABASE_AUTH', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440002', 'ANOTHER_USER_ID', 'admin');
```

## Test Scenarios

### 1. Authentication Testing
- ✅ Login with valid credentials
- ✅ Login with invalid credentials  
- ✅ Logout functionality
- ✅ Session persistence

### 2. Dashboard Testing
- ✅ View dashboard stats
- ✅ See recent sermons
- ✅ Navigate between sections

### 3. Sermon Management
- ✅ Add new sermon
- ✅ Edit existing sermon
- ✅ Delete sermon
- ✅ View sermon list
- ✅ Filter by series
- ✅ Check processing status

### 4. Content Hub Testing
- ✅ View embedded Notion page
- ✅ Handle missing Notion URL
- ✅ Open Notion in new tab

### 5. Multi-tenant Testing
- ✅ Churches only see their own data
- ✅ Role-based permissions work
- ✅ Data isolation between churches

## Sample Test Data

The system includes sample data for:

**Grace Community Church**
- 4 sample sermons with different processing statuses
- Notion page URL configured
- Various speakers and series

**First Baptist Church** 
- 2 sample sermons
- Different pastor and content

**New Life Fellowship**
- Church without Notion URL (tests fallback UI)

## Testing the Notion Integration

The sample data includes a real Notion URL that matches your screenshot:
`https://notion.so/businessautomationhub/22d2e250c21080c684d9c10e61723da?v=22d2e250c21081d9b7f800`

This will show the actual Notion content hub with columns for:
- Sermon Title
- Sermon Date  
- YouTube URL
- Full Blog Post
- Meta Tags
- Video Schema JSON
- Social Captions
- Discussion Questions
- Series Name

## API Endpoints for n8n Integration

The system exposes these endpoints for your n8n workflow:

- `GET /api/sermons/:churchId` - Get all sermons for a church
- `POST /api/sermons` - Create new sermon
- `PUT /api/sermons/:id` - Update sermon
- `GET /api/sermon-content/:sermonId` - Get generated content
- `PUT /api/sermon-content/:sermonId` - Update generated content

## Troubleshooting

**Can't login?**
- Ensure user exists in Supabase Auth
- Check church_users table has correct linking
- Verify RLS policies are working

**No sermons showing?**
- Check user is linked to correct church
- Verify church_id matches in sermons table
- Check browser console for errors

**Notion not loading?**
- Verify notion_page_url is correct in churches table
- Check if Notion page is publicly accessible
- Try opening URL directly in browser

**Database errors?**
- Ensure all migrations ran successfully
- Check Supabase logs for RLS policy issues
- Verify environment variables are set correctly