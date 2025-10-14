# 🏛️ PM-AJAY GIA Beneficiary Management Platform

<div align="center">

**A Modern, AI-Powered Platform for Managing SC Community Beneficiaries**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-key-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 🎯 Overview

A comprehensive **Beneficiary Management System** for PM-AJAY GIA (Gains in Income and Assets) component, addressing critical challenges in identifying and reaching SC community beneficiaries for Income Generation, Skill Development, and Infrastructure support initiatives.

### 🏆 Problem Statement Addressed

This platform solves three major challenges:
1. **High Risk of Inclusion/Exclusion Errors** - AI-based eligibility scoring
2. **Poor Tracking of Beneficiary Outcomes** - Digital project lifecycle management
3. **Fragmented Beneficiary Data** - Centralized database with audit trails

---

## 🌟 Key Features

### 🤖 AI-Based Beneficiary Selection
- **Smart Eligibility Scoring Algorithm** (0-100 scale)
  - Income Level Assessment (40 points)
  - Education Level Evaluation (20 points)
  - Family Size Consideration (20 points)
  - SC Category Verification (20 points)
- Real-time score calculation during registration
- Automated prioritization for resource allocation

### 📊 Digital Project Tracking
- **Complete Project Lifecycle Management**
  - Submitted → Approved → In Progress → Completed
  - Real-time status updates
  - Progress percentage tracking
  - Priority scoring for allocation
- Support for multiple project types:
  - 💰 Income Generation (Micro-enterprises, Small Business)
  - 🎓 Skill Development (Training, Certification)
  - 🏗️ Infrastructure (Community facilities)

### 📈 Analytics & Reporting
- Interactive dashboards with real-time metrics
- Beneficiary distribution by state/district
- Project trends and completion rates
- Funding allocation visualization
- Training program effectiveness tracking

### 🔍 Transparency & Audit
- Complete audit trail for all actions
- Timestamp and user attribution
- Verification status tracking
- Document management system

### 📱 Mobile-Responsive Design
- Works seamlessly on phones, tablets, and desktops
- Lightweight and fast
- Intuitive UI for field-level enumerators

### 🔗 Integration Ready
- RESTful API architecture
- Standard JSON data formats
- Banking details for Direct Benefit Transfer
- Easy integration with financial platforms

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Git** for cloning the repository

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/pm-ajay-gia-platform.git
cd pm-ajay-gia-platform

# Install dependencies
npm install

# Seed demo data (optional but recommended)
node server/seed-demo-data.js

# Start the application
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Manual Setup

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Start backend server
npm run server

# In another terminal, start frontend
npm run client
```

---

## 📖 Usage

### For Administrators

1. **Dashboard** - View key metrics and system overview
2. **Beneficiary Management**
   - Register new beneficiaries with AI eligibility scoring
   - View and verify beneficiary details
   - Track verification status
3. **Project Management**
   - Review submitted projects
   - Approve/reject project applications
   - Track project progress
   - Monitor completion rates
4. **Training Programs**
   - Create and manage training programs
   - Track enrollment and completion
   - Monitor skill development outcomes
5. **Analytics**
   - View beneficiary distribution
   - Analyze project trends
   - Track funding allocation
6. **Audit Logs**
   - Review all system actions
   - Ensure transparency and accountability

### For Field Officers

1. **Beneficiary Registration**
   - Collect beneficiary information
   - System automatically calculates eligibility score
   - Instant feedback on eligibility
2. **Project Submission**
   - Submit projects on behalf of beneficiaries
   - Upload supporting documents
   - Track submission status

---

## 🔧 Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Embedded database
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple processes
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Beneficiaries
```
GET    /api/beneficiaries           - Get all beneficiaries
POST   /api/beneficiaries           - Register new beneficiary
GET    /api/beneficiaries/:id       - Get beneficiary by ID
PATCH  /api/beneficiaries/:id       - Update beneficiary
DELETE /api/beneficiaries/:id       - Delete beneficiary
PATCH  /api/beneficiaries/:id/verify - Verify beneficiary
```

#### Projects
```
GET    /api/projects                - Get all projects
POST   /api/projects                - Submit new project
GET    /api/projects/:id            - Get project by ID
PATCH  /api/projects/:id/status     - Update project status
DELETE /api/projects/:id            - Delete project
```

#### Training Programs
```
GET    /api/training-programs       - Get all programs
POST   /api/training-programs       - Create new program
GET    /api/training-programs/:id   - Get program by ID
POST   /api/training-programs/:id/enroll - Enroll beneficiary
PATCH  /api/training-programs/:id/complete - Mark completion
```

#### Analytics
```
GET    /api/dashboard/stats                    - Dashboard statistics
GET    /api/analytics/beneficiary-distribution - Beneficiary by state
GET    /api/analytics/project-trends           - Project trends
```

#### Audit Logs
```
GET    /api/audit-logs              - Get all audit logs
```

### Example Request
```javascript
// Register a new beneficiary
POST /api/beneficiaries
Content-Type: application/json

{
  "name": "John Doe",
  "father_name": "Richard Doe",
  "date_of_birth": "1990-01-15",
  "gender": "Male",
  "caste_category": "SC",
  "annual_income": 45000,
  "education_level": "Secondary",
  "family_size": 5,
  "mobile": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St",
  "state": "Maharashtra",
  "district": "Mumbai",
  "pincode": "400001",
  "bank_account": "1234567890",
  "ifsc_code": "SBIN0001234"
}
```

---

## 🎨 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Real-time metrics and system overview*

### Beneficiary Registration
![Registration](docs/screenshots/registration.png)
*AI-powered eligibility scoring during registration*

### Project Management
![Projects](docs/screenshots/projects.png)
*Track projects through their complete lifecycle*

### Analytics
![Analytics](docs/screenshots/analytics.png)
*Interactive charts and data visualization*

---

## 🗂️ Project Structure

```
pm-ajay-gia-platform/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                  # Backend Node.js application
│   ├── index.js            # Express server & API routes
│   └── seed-demo-data.js   # Demo data seeding script
├── package.json            # Root package.json
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

---

## 🧪 Testing the System

### Test AI Eligibility Scoring

Try registering beneficiaries with different profiles:

**High Priority (Score: 90+)**
- Annual Income: ₹30,000
- Education: No formal education
- Family Size: 8
- Caste Category: SC

**Medium Priority (Score: 60-70)**
- Annual Income: ₹80,000
- Education: Secondary
- Family Size: 5
- Caste Category: SC

**Lower Priority (Score: 40-50)**
- Annual Income: ₹140,000
- Education: Graduate
- Family Size: 3
- Caste Category: SC

### Test Project Workflow

1. Submit a project for a beneficiary
2. Approve the project with funding amount
3. Mark project as "In Progress"
4. Update progress percentage
5. Mark as completed

### Test Training Programs

1. Create a new training program
2. Enroll beneficiaries
3. Track completion status
4. View analytics on skill development

---

## 🔐 Security Considerations

- Input validation on all API endpoints
- SQL injection prevention using parameterized queries
- CORS configuration for API security
- Audit logging for all critical actions
- Data encryption for sensitive information (recommended for production)

---

## 🚀 Deployment

### Production Recommendations

1. **Database**: Migrate from SQLite to PostgreSQL/MySQL for production
2. **Environment Variables**: Use `.env` file for sensitive configuration
3. **HTTPS**: Enable SSL/TLS certificates
4. **Authentication**: Implement JWT-based authentication
5. **Rate Limiting**: Add API rate limiting
6. **Monitoring**: Set up logging and monitoring (e.g., PM2, Winston)
7. **Backup**: Implement automated database backups

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN cd client && npm install && npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - Initial work - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Built for PM-AJAY GIA Hackathon
- Inspired by the need for better beneficiary management systems
- Thanks to all contributors and testers

---

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

<div align="center">

**Made with ❤️ for SC Community Development**

⭐ Star this repository if you find it helpful!

</div>
