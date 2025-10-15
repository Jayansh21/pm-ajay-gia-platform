# 🎯 Demo Data Guide for PM-AJAY GIA Platform

## 📋 Overview

Your deployed Vercel application will start with an empty database. This guide shows you how to populate it with realistic demo data for your hackathon presentation.

## 🚀 Quick Start - Load Demo Data

### **Method 1: Using the Home Page Button (Recommended)**

1. **Visit your deployed app**: `https://your-app-name.vercel.app`
2. **Click "Load Demo Data"** button on the home page
3. **Wait for initialization** (2-3 seconds)
4. **You'll be automatically redirected** to the dashboard with data

### **Method 2: Direct API Call**

```bash
curl -X GET https://your-app-name.vercel.app/api/init-db
```

## 📊 What Demo Data Includes

### **👥 Beneficiaries (5 records)**
- **Rajesh Kumar** - Farmer from UP (Eligibility: 85)
- **Priya Sharma** - Tailor from Bihar (Eligibility: 90)
- **Amit Singh** - Laborer from MP (Eligibility: 95)
- **Sunita Devi** - Domestic Worker from Rajasthan (Eligibility: 100)
- **Vikram Yadav** - Driver from Maharashtra (Eligibility: 60)

### **📋 Projects (5 records)**
- **Organic Vegetable Farming** - In Progress (60% complete)
- **Tailoring Business Setup** - Completed (100%)
- **Construction Skills Training** - Approved (0% complete)
- **Community Kitchen Setup** - In Progress (30% complete)
- **Vehicle Maintenance Workshop** - Submitted (0% complete)

### **🎓 Training Programs (3 records)**
- **Digital Literacy Program** - Ongoing (25/30 participants)
- **Entrepreneurship Development** - Ongoing (18/20 participants)
- **Agricultural Techniques** - Upcoming (0/25 participants)

## 🎯 Perfect for Hackathon Demo

### **Demo Flow:**
1. **Start**: Show empty dashboard
2. **Load Data**: Click "Load Demo Data" button
3. **Show Results**: Navigate through populated sections
4. **Highlight Features**: 
   - AI eligibility scoring
   - Project progress tracking
   - Real-time analytics
   - State-wise distribution

### **Key Statistics After Loading:**
- **5 Beneficiaries** with varying eligibility scores
- **5 Projects** in different stages
- **3 Training Programs** with enrollment data
- **₹1.9L Total Funding** approved
- **Multiple States** represented (UP, Bihar, MP, Rajasthan, Maharashtra)

## 🔧 Technical Details

### **Database Initialization:**
- **SQLite database** created in `/tmp/` directory
- **Tables auto-created** with proper schema
- **Data persists** during function execution
- **No duplicate data** - checks before inserting

### **API Endpoints:**
- `GET /api/init-db` - Initialize database with demo data
- `GET /api/beneficiaries` - List all beneficiaries
- `GET /api/projects` - List all projects
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🚨 Troubleshooting

### **If Demo Data Doesn't Load:**

1. **Check API Status**:
   ```bash
   curl https://your-app-name.vercel.app/api/init-db
   ```

2. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Functions
   - View real-time logs for errors

3. **Manual Database Reset**:
   - The database resets on each deployment
   - Try the "Load Demo Data" button again

### **Common Issues:**

- **"Database already initialized"** - Data already exists, proceed to dashboard
- **"Failed to initialize"** - Check Vercel function logs
- **Empty dashboard** - Click "Load Demo Data" button

## 🎉 Success Indicators

After successful initialization, you should see:

✅ **Dashboard shows real statistics**
✅ **Beneficiaries page has 5 records**
✅ **Projects page shows 5 projects**
✅ **Analytics page displays charts**
✅ **Training page has 3 programs**

## 📱 Demo Presentation Tips

### **Before Judges Arrive:**
1. Load demo data once
2. Test all navigation
3. Prepare specific talking points
4. Have backup screenshots ready

### **During Presentation:**
1. **Start with empty state** - show the problem
2. **Load demo data** - demonstrate the solution
3. **Navigate through features** - show capabilities
4. **Highlight AI scoring** - emphasize innovation
5. **Show real-time updates** - demonstrate responsiveness

## 🔄 Reset Demo Data

To reset and reload demo data:

1. **Wait for new deployment** (database resets automatically)
2. **Or clear browser cache** and reload
3. **Or call the API directly** to reinitialize

## 📞 Support

If you encounter any issues:

1. **Check Vercel Function Logs**
2. **Verify API endpoints are working**
3. **Test with curl commands**
4. **Check browser console for errors**

---

**Your PM-AJAY GIA platform is now ready for an impressive hackathon demonstration! 🚀**
