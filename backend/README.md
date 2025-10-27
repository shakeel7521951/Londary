# 🧺 AKOYA Luxury Laundry - Backend API (AWS Lambda)

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange)
![Serverless](https://img.shields.io/badge/Serverless-Framework-red)

Enterprise-grade serverless backend API for AKOYA Luxury Laundry service, deployed on AWS Lambda.

## 🌟 Features

- ✅ **Serverless Architecture** - AWS Lambda + API Gateway
- ✅ **MongoDB Atlas** - Scalable cloud database with connection caching
- ✅ **JWT Authentication** - Secure user authentication
- ✅ **SMS Notifications** - Order updates via waghl.com
- ✅ **Receipt Generation** - Professional PDF receipts with QAR currency
- ✅ **Image Storage** - Cloudinary integration
- ✅ **Email Service** - Nodemailer integration
- ✅ **Bilingual Support** - Arabic and English
- ✅ **CORS Enabled** - Secure cross-origin requests
- ✅ **Error Handling** - Comprehensive error management
- ✅ **CloudWatch Logging** - Complete observability

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- AWS Account
- MongoDB Atlas account
- AWS CLI configured

### Installation

```bash
# Clone repository
git clone https://github.com/shakeel7521951/Londary.git
cd Londary/backend

# Install dependencies
npm install

# Install Serverless Framework globally
npm install -g serverless

# Configure AWS credentials
aws configure
```

### Configuration

1. Copy `.env.example` to `.env`
2. Fill in all required environment variables
3. Ensure MongoDB Atlas allows Lambda connections (0.0.0.0/0)

### Deploy

```bash
# Development
npm run deploy:dev

# Production
npm run deploy:prod
```

## 📦 Installation

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Install Serverless Framework

```bash
npm install -g serverless
```

### 3. Configure AWS

```bash
aws configure
# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

## 🌐 Deployment

### Development Deployment

```bash
npm run deploy:dev
```

### Production Deployment

```bash
npm run deploy:prod
```

### Custom Stage

```bash
serverless deploy --stage staging --region eu-west-1
```

### Using Deploy Scripts

**Windows:**

```bash
deploy.bat
```

**Linux/Mac:**

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📖 API Documentation

### Base URL

After deployment:

```
https://xxxxxxxxxx.execute-api.{region}.amazonaws.com/{stage}
```

### Endpoints

#### Health Check

```http
GET /
GET /api/health
```

#### Authentication

```http
POST /api/v1/users/register
POST /api/v1/users/login
POST /api/v1/users/verify-otp
POST /api/v1/users/forgot-password
POST /api/v1/users/reset-password
```

#### Orders

```http
GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id
DELETE /api/v1/orders/:id
POST   /api/v1/orders/:id/confirm-delivery
```

#### Coupons

```http
GET    /api/v1/coupons
POST   /api/v1/coupons
POST   /api/v1/coupons/validate
```

#### Employees

```http
GET    /api/v1/employees
POST   /api/v1/employees
PUT    /api/v1/employees/:id
DELETE /api/v1/employees/:id
```

#### Dashboard

```http
GET /api/v1/dashboard/stats
GET /api/v1/dashboard/recent-orders
```

## 🔐 Environment Variables

Create a `.env` file with:

```env
# Database
DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/db

# Authentication
JWT_SECRET=your-secret-key

# Frontend
FRONTEND_URL=https://your-domain.com

# SMS Service
SMS_API_KEY=your-api-key
SMS_SENDER=AKOYA

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│ (Vercel/Netlify)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Lambda Function│
│   (Node.js 18)  │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│  MongoDB     │  │   External   │
│   Atlas      │  │   Services   │
│              │  │ (SMS, Email, │
│              │  │  Cloudinary) │
└──────────────┘  └──────────────┘
```

## 💻 Development

### Local Development (Traditional Server)

```bash
npm start
# or with auto-reload
npm run dev
```

### Local Development (Serverless Offline)

```bash
npm run offline
```

Server will run at `http://localhost:4000`

### Code Structure

```
backend/
├── lambda.js              # Lambda handler
├── server.js              # Traditional server
├── serverless.yml         # Serverless config
├── controller/            # Request handlers
├── models/                # MongoDB models
├── routes/                # API routes
├── middleware/            # Custom middleware
├── services/              # Business logic
└── temp/                  # Temporary files
```

## 🧪 Testing

### Test Locally

```bash
# Start server
npm start

# Or use serverless offline
npm run offline
```

### Test Deployed Function

```bash
# Invoke locally
serverless invoke local -f api --data '{"path":"/api/health","httpMethod":"GET"}'

# Test health endpoint
curl https://your-api-url.com/api/health
```

### Run API Tests

```bash
# Test user registration
curl -X POST https://your-api-url.com/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phoneNumber":"+1234567890","password":"test123"}'
```

## 📊 Monitoring

### View Logs

```bash
# Real-time logs
npm run logs

# View logs for specific time
serverless logs -f api --startTime 1h

# Follow logs
serverless logs -f api -t
```

### CloudWatch

View logs in AWS Console:

```
https://console.aws.amazon.com/cloudwatch/
```

### Metrics to Monitor

- Invocation count
- Error rate
- Duration
- Cold start times
- Memory usage
- Throttles

## 🔧 Troubleshooting

### Common Issues

#### Cold Start Timeout

**Solution**: Increase timeout in `serverless.yml` or use provisioned concurrency

#### Database Connection Failed

**Solution**:

- Verify MongoDB Atlas network access (0.0.0.0/0)
- Check connection string
- Ensure database user has proper permissions

#### CORS Errors

**Solution**:

- Verify FRONTEND_URL environment variable
- Check API Gateway CORS settings
- Ensure credentials: true in frontend

#### File Upload Errors

**Solution**:

- Check Cloudinary credentials
- Verify /tmp permissions
- Increase memory if needed

### Debug Mode

View detailed logs:

```bash
SLS_DEBUG=* serverless deploy
```

## 📚 Additional Resources

- [Serverless Framework Docs](https://www.serverless.com/framework/docs/)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Deployment Guide](./DEPLOYMENT.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Deploy to dev
5. Create pull request

## 📄 License

ISC

## 👥 Team

**AKOYA Premium Laundry Development Team**

## 📞 Support

For issues or questions:

- Check CloudWatch logs
- Review deployment guide
- Contact development team

---

**Made with ❤️ for AKOYA Premium Laundry**

## Quick Commands

```bash
# Install
npm install

# Deploy
npm run deploy:dev          # Development
npm run deploy:prod         # Production

# Test
npm run offline             # Local serverless
npm start                   # Local server

# Monitor
npm run logs                # View logs
serverless info             # Deployment info

# Cleanup
npm run remove              # Remove deployment
```
