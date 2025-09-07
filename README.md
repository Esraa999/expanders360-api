# Expanders360 Global Expansion Management API

A comprehensive NestJS backend API for managing global expansion projects, connecting clients with vendors, and storing research documents. Built with MySQL for relational data and MongoDB for unstructured documents.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Client, Admin)
- Secure password hashing with bcrypt

### Core Entities
- **Clients**: Company profiles linked to user accounts
- **Projects**: Expansion projects with country, services needed, and budget
- **Vendors**: Service providers with countries supported and services offered
- **Matches**: AI-powered project-vendor matching with scoring algorithm

### Document Management
- MongoDB storage for research documents
- Full-text search capabilities
- Tag-based organization
- File upload support

### Analytics & Insights
- Top vendors by country analysis
- Cross-database queries (MySQL + MongoDB)
- Match score analytics
- General system statistics

### Automation
- Daily match refresh for active projects
- SLA compliance monitoring
- Email notifications for new matches
- Automated vendor performance tracking

## 🛠️ Tech Stack

- **Framework**: NestJS (TypeScript)
- **Databases**: MySQL (relational), MongoDB (documents)
- **ORM**: TypeORM (MySQL), Mongoose (MongoDB)
- **Authentication**: JWT, Passport
- **Scheduling**: NestJS Schedule
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+
- MySQL 8.0+
- MongoDB 7.0+
- Docker & Docker Compose (for containerized deployment)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd expanders360-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials and other configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=expanders360

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/expanders360

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@expanders360.com

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Local Setup
1. **MySQL Setup**:
   - Create a MySQL database named `expanders360`
   - Update connection details in `.env`

2. **MongoDB Setup**:
   - Install and start MongoDB
   - Database will be created automatically

3. **Run Migrations**:
   ```bash
   npm run migration:run
   ```

4. **Seed Database**:
   ```bash
   npm run seed
   ```

#### Option B: Docker Setup
```bash
# Start all services (MySQL, MongoDB, API)
docker-compose up -d

# Wait for databases to initialize, then run migrations and seeds
docker-compose exec app npm run migration:run
docker-compose exec app npm run seed
```

### 5. Start the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **API Base URL**: `http://localhost:3000`

## 🏗️ Database Schema

### MySQL Tables
- `users` - User authentication and roles
- `clients` - Client company information
- `projects` - Expansion projects
- `vendors` - Service providers
- `matches` - Project-vendor matches with scores

### MongoDB Collections
- `documents` - Research documents and files

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get current user profile

### Clients
- `POST /clients` - Create client profile
- `GET /clients/me` - Get current user's client profile
- `GET /clients` - Get all clients (Admin only)
- `PATCH /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client (Admin only)

### Projects
- `POST /projects` - Create new project
- `GET /projects` - Get projects (filtered by user role)
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Vendors
- `POST /vendors` - Create vendor (Admin only)
- `GET /vendors` - Get all vendors
- `GET /vendors/:id` - Get vendor details
- `PATCH /vendors/:id` - Update vendor (Admin only)
- `DELETE /vendors/:id` - Delete vendor (Admin only)

### Matches
- `POST /matches/projects/:id/rebuild` - Rebuild matches for project
- `GET /matches/projects/:id` - Get matches for project
- `GET /matches` - Get all matches

### Documents
- `POST /documents` - Upload document
- `GET /documents` - Get all documents
- `GET /documents/search` - Search documents
- `GET /documents/projects/:projectId` - Get documents by project
- `GET /documents/:id` - Get document details
- `PATCH /documents/:id` - Update document
- `DELETE /documents/:id` - Delete document

### Analytics
- `GET /analytics/top-vendors` - Get top vendors by country
- `GET /analytics/general` - Get general analytics

## 🤖 Matching Algorithm

The project-vendor matching algorithm uses the following formula:

```
Score = (services_overlap × 2) + vendor_rating + SLA_weight
```

Where:
- `services_overlap`: Number of matching services between project needs and vendor offerings
- `vendor_rating`: Vendor's rating (0-5)
- `SLA_weight`: Calculated as `max(0, 10 - (SLA_hours / 24) × 5)`

## 📧 Notifications

The system sends email notifications for:
- New vendor matches
- SLA compliance warnings
- System alerts

Configure SMTP settings in `.env` for email functionality.

## ⏰ Scheduled Jobs

- **Daily Match Refresh** (2:00 AM): Updates matches for all active projects
- **SLA Monitoring** (Every 6 hours): Checks vendor response times and sends warnings

## 🐳 Docker Deployment

### Local Development with Docker
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Deployment
1. Update environment variables in `docker-compose.yml`
2. Configure proper SMTP settings
3. Set strong JWT secrets
4. Deploy to your cloud provider

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## 📊 Sample Data

The seed script creates:
- 1 Admin user (`admin@expanders360.com` / `admin123`)
- 3 Client users with company profiles
- 5 Vendors across different regions
- 5 Sample projects
- Matching records and research documents

## 🚀 Deployment Options

### Free Cloud Platforms
- **Railway**: Easy deployment with database add-ons
- **Render**: Free tier with automatic deployments
- **AWS Free Tier**: EC2 + RDS + DocumentDB

### Configuration for Cloud Deployment
1. Set environment variables in your cloud platform
2. Configure database connections
3. Set up SMTP service (SendGrid, AWS SES, etc.)
4. Configure domain and SSL certificates

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation with class-validator
- SQL injection prevention with TypeORM
- CORS enabled for cross-origin requests

## 📝 Development Notes

### Adding New Features
1. Create entity/schema files
2. Add service layer with business logic
3. Create controller with API endpoints
4. Add DTOs for request/response validation
5. Update database migrations if needed
6. Add tests for new functionality

### Database Migrations
```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@expanders360.com

---

**Built with ❤️ using NestJS, TypeScript, MySQL, and MongoDB**