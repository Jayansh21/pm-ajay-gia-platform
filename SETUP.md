# 🚀 Setup Guide

## Quick Start (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Seed demo data (optional but recommended for testing)
node server/seed-demo-data.js

# 3. Start the application
npm run dev
```

That's it! The application will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Detailed Setup

### Step 1: Install Dependencies

Install all required packages for both backend and frontend:

```bash
# Install root dependencies (backend)
npm install

# Install client dependencies (frontend)
cd client
npm install
cd ..
```

### Step 2: Database Setup

The SQLite database will be created automatically when you start the server for the first time.

**Option A: Start with Demo Data (Recommended)**
```bash
node server/seed-demo-data.js
```

This will create:
- 10 sample beneficiaries with varying eligibility scores
- 6 sample projects in different stages
- 3 training programs
- Audit logs for all actions

**Option B: Start with Empty Database**

Just start the server and the database will be initialized automatically.

### Step 3: Start the Application

**Option A: Start Both (Recommended)**
```bash
npm run dev
```

This starts both backend and frontend concurrently.

**Option B: Start Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

---

## Verification

### Check Backend
Visit http://localhost:5000 - you should see a welcome message.

### Check Frontend
Visit http://localhost:3000 - you should see the dashboard.

### Check API
```bash
curl http://localhost:5000/api/beneficiaries
```

---

## Troubleshooting

### Port Already in Use

**Frontend (Port 3000)**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

**Backend (Port 5000)**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

### Database Issues

If you encounter database errors:
```bash
# Remove the database and recreate
rm pmajay.db
node server/seed-demo-data.js
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf client/dist
cd client && npm run build
```

---

## Development Mode

### Auto-Reload

Both backend and frontend have auto-reload enabled:
- **Backend**: Uses `nodemon` - automatically restarts on file changes
- **Frontend**: Uses Vite HMR - instant updates without page reload

### Making Changes

1. Edit files in `server/` for backend changes
2. Edit files in `client/src/` for frontend changes
3. Changes will be reflected automatically

---

## Testing Credentials

The demo data includes these test beneficiaries:

1. **Anita Kumari** (High Priority - Score: 98)
   - Income: ₹25,000
   - Education: No formal education
   - Family Size: 8

2. **Priya Devi** (High Priority - Score: 85)
   - Income: ₹35,000
   - Education: Primary
   - Family Size: 6

3. **Test User** (Low Priority - Score: 42)
   - Income: ₹145,000
   - Education: Graduate
   - Family Size: 3

---

## Next Steps

1. ✅ Explore the Dashboard
2. ✅ Register a new beneficiary and see AI scoring in action
3. ✅ Submit a project and track its lifecycle
4. ✅ Create training programs and enroll beneficiaries
5. ✅ View analytics and audit logs

---

## Production Deployment

For production deployment, see the **Deployment** section in README.md.

Key considerations:
- Use PostgreSQL/MySQL instead of SQLite
- Set up environment variables
- Enable HTTPS
- Implement authentication
- Set up monitoring and logging
- Configure automated backups

---

## Need Help?

- 📖 Read the [README.md](README.md) for detailed documentation
- 🐛 Report issues on GitHub
- 💬 Contact the development team

---

**Happy Coding! 🎉**

