# 🚀 Expanders360 API - Complete Setup Guide

## 📦 What's Included

This ZIP file contains a complete, production-ready NestJS API with:

✅ **Full Authentication System** (JWT + Role-based access)
✅ **MySQL Database** with migrations and seeds
✅ **MongoDB Integration** for document storage
✅ **Project-Vendor Matching Algorithm**
✅ **Analytics & Cross-Database Queries**
✅ **Email Notifications & Scheduling**
✅ **Docker Deployment Setup**
✅ **Comprehensive API Documentation**

## 🛠️ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
# Copy the environment file
cp .env.example .env

# Edit .env with your database credentials
# Minimum required: DB_PASSWORD and JWT_SECRET
```

### Step 3: Start with Docker (Recommended)
```bash
# Start all services (MySQL, MongoDB, API)
docker-compose up -d

# Wait 30 seconds for databases to initialize, then run:
docker-compose exec app npm run migration:run
docker-compose exec app npm run seed

# API will be available at: http://localhost:3000
# Swagger docs at: http://localhost:3000/api/docs
```

## 🔧 Alternative Setup (Local Development)

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- MongoDB 7.0+

### Database Setup
1. **MySQL**: Create database `expanders360`
2. **MongoDB**: Will be created automatically
3. **Run migrations**: `npm run migration:run`
4. **Seed data**: `npm run seed`

### Start Development Server
```bash
npm run start:dev
```

## 🧪 Test the API

### Sample Login Credentials
```
Admin User:
- Email: admin@expanders360.com
- Password: admin123

Client User:
- Email: client1@acme.com
- Password: client123
```

### Key API Endpoints
- **Auth**: `POST /auth/login`
- **Projects**: `GET /projects`
- **Matches**: `POST /matches/projects/1/rebuild`
- **Analytics**: `GET /analytics/top-vendors`
- **Documents**: `POST /documents` (with file upload)

## 📊 Features Demonstration

### 1. Authentication & Authorization
```bash
# Login as admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@expanders360.com","password":"admin123"}'
```

### 2. Project-Vendor Matching
```bash
# Rebuild matches for project ID 1
curl -X POST http://localhost:3000/matches/projects/1/rebuild \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Analytics (Cross-Database Query)
```bash
# Get top vendors by country with document counts
curl -X GET http://localhost:3000/analytics/top-vendors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Document Upload
```bash
# Upload a research document
curl -X POST http://localhost:3000/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@your-document.pdf" \
  -F "title=Market Research" \
  -F "content=Research content..." \
  -F "tags=market-research,germany" \
  -F "projectId=1"
```

## 🎯 Matching Algorithm

The system uses this formula for vendor matching:
```
Score = (services_overlap × 2) + vendor_rating + SLA_weight
```

Where:
- `services_overlap`: Number of matching services
- `vendor_rating`: Vendor's rating (0-5)
- `SLA_weight`: Calculated based on response time

## 📧 Email Notifications

Configure SMTP in `.env` for real emails:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Without SMTP, the system uses mock notifications (logged to console).

## ⏰ Scheduled Jobs

- **Daily Match Refresh** (2:00 AM): Updates all active project matches
- **SLA Monitoring** (Every 6 hours): Checks vendor response times

## 🐳 Production Deployment

### Docker Deployment
```bash
# Update environment variables in docker-compose.yml
# Deploy to your cloud provider (AWS, Railway, Render, etc.)
docker-compose up -d
```

### Cloud Platforms
- **Railway**: Connect GitHub repo, auto-deploy
- **Render**: Web service + database add-ons
- **AWS**: EC2 + RDS + DocumentDB

## 📚 API Documentation

Visit `http://localhost:3000/api/docs` for interactive Swagger documentation.

## 🔍 Database Schema

### MySQL Tables
- `users` - Authentication and roles
- `clients` - Company information
- `projects` - Expansion projects
- `vendors` - Service providers
- `matches` - Project-vendor matches with scores

### MongoDB Collections
- `documents` - Research documents and files

## 🧪 Sample Data

The seed script creates:
- 1 Admin user + 3 Client users
- 3 Client companies with profiles
- 5 Vendors across different regions
- 5 Sample expansion projects
- Pre-calculated matches and documents

## ✅ Verification Checklist

After setup, verify these work:

1. ✅ **Authentication**: Login with sample credentials
2. ✅ **Database**: Check MySQL and MongoDB connections
3. ✅ **Matching**: Rebuild matches for a project
4. ✅ **Analytics**: View top vendors by country
5. ✅ **Documents**: Upload and search documents
6. ✅ **Notifications**: Check console for mock emails
7. ✅ **Swagger**: Access API documentation

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**:
- Check MySQL/MongoDB are running
- Verify credentials in `.env`
- Ensure databases exist

**Migration Errors**:
- Drop and recreate database
- Run `npm run migration:run` again

**Docker Issues**:
- Run `docker-compose down -v` to reset
- Check Docker daemon is running

**Port Conflicts**:
- Change ports in `docker-compose.yml`
- Update `.env` PORT variable

## 📞 Support

For issues or questions:
- Check the comprehensive README.md
- Review API documentation at `/api/docs`
- Examine sample data in seed files

---

**🎉 Congratulations! You now have a fully functional Global Expansion Management API running with all required features implemented.**