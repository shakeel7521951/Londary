# AKOYA Laundry - AWS Lambda Deployment Guide

## 🚀 Serverless Deployment Setup

This backend is configured to deploy to AWS Lambda using the Serverless Framework.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **AWS Account** with appropriate credentials
3. **AWS CLI** installed and configured
4. **Serverless Framework** installed globally

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Install Serverless Framework Globally

```bash
npm install -g serverless
```

### 3. Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

### 4. Create Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DB_URL=mongodb+srv://your-mongodb-url

# JWT
JWT_SECRET=your-jwt-secret-key

# Frontend
FRONTEND_URL=https://your-frontend-domain.com

# SMS Service
SMS_API_KEY=your-sms-api-key
SMS_SENDER=your-sender-name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Deployment Commands

### Deploy to Development

```bash
npm run deploy:dev
```

### Deploy to Production

```bash
npm run deploy:prod
```

### Deploy with Custom Stage

```bash
serverless deploy --stage staging
```

### Remove Deployment

```bash
npm run remove
```

## Local Testing

### Test Locally with Serverless Offline

```bash
npm run offline
```

This will start a local server at `http://localhost:4000`

### Run Original Server (Non-Lambda)

```bash
npm start
```

or for development:

```bash
npm run dev
```

## Viewing Logs

### Real-time Logs

```bash
npm run logs
```

### View Specific Function Logs

```bash
serverless logs -f api --stage prod
```

## Testing Lambda Function Locally

```bash
npm run invoke
```

## API Endpoints

After deployment, you'll receive an API Gateway URL like:

```
https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
```

Your API endpoints will be:

- `GET /` - Health check
- `GET /api/health` - Detailed health check
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/orders` - Get all orders
- etc.

## Important Notes

### Database Connection

- The Lambda function caches the MongoDB connection between invocations
- This improves performance and reduces connection overhead
- Connection is reused when the Lambda container is warm

### File Storage

- Lambda has limited `/tmp` storage (512 MB)
- Temporary receipt files are created in `/tmp` and cleaned up immediately
- All permanent storage uses Cloudinary

### Timeout Configuration

- Default timeout: 30 seconds
- Adjust in `serverless.yml` if needed for long-running operations

### Memory Configuration

- Default: 512 MB
- Increase if you encounter memory issues

## Monitoring

### CloudWatch Logs

```bash
# View logs in AWS Console
https://console.aws.amazon.com/cloudwatch/

# Or use CLI
aws logs tail /aws/lambda/akoya-laundry-api-dev-api --follow
```

### AWS Lambda Console

Monitor your function at:

```
https://console.aws.amazon.com/lambda/
```

## Cost Optimization

### Lambda Free Tier

- 1M free requests per month
- 400,000 GB-seconds of compute time per month

### Tips

1. Keep Lambda function warm with scheduled pings
2. Optimize memory allocation
3. Use connection pooling for database
4. Implement caching strategies

## Troubleshooting

### Issue: Cold Start Times

**Solution**:

- Use provisioned concurrency for production
- Implement warming strategy

### Issue: Timeout Errors

**Solution**:

- Increase timeout in `serverless.yml`
- Optimize database queries
- Use connection caching

### Issue: Memory Errors

**Solution**:

- Increase memorySize in `serverless.yml`
- Optimize code and dependencies

### Issue: Database Connection Errors

**Solution**:

- Ensure MongoDB Atlas allows Lambda IP ranges (use 0.0.0.0/0 for testing)
- Verify connection string
- Check VPC settings if using private MongoDB

## Environment-Specific Deployments

### Development

```bash
npm run deploy:dev
```

### Production

```bash
npm run deploy:prod
```

### Custom Environment

```bash
serverless deploy --stage staging --region eu-west-1
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to AWS Lambda

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm run deploy:prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Architecture

```
Frontend (Vercel/Netlify)
    ↓
API Gateway
    ↓
AWS Lambda Function
    ↓
MongoDB Atlas
    ↓
External Services (SMS, Cloudinary, Email)
```

## Security Best Practices

1. ✅ Use environment variables for secrets
2. ✅ Enable CORS with specific origins
3. ✅ Implement rate limiting
4. ✅ Use HTTPS only
5. ✅ Keep dependencies updated
6. ✅ Use IAM roles with least privilege
7. ✅ Enable CloudWatch logging

## Useful Commands Reference

```bash
# Install dependencies
npm install

# Deploy
npm run deploy

# Test locally
npm run offline

# View logs
npm run logs

# Remove deployment
npm run remove

# Package without deploying
serverless package

# Get info about deployment
serverless info

# Invoke function locally
serverless invoke local -f api --data '{"path": "/api/health", "httpMethod": "GET"}'
```

## Support

For issues or questions:

1. Check CloudWatch logs
2. Review serverless.yml configuration
3. Verify environment variables
4. Check AWS Lambda console

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure AWS credentials
3. ✅ Set up environment variables
4. ✅ Test locally: `npm run offline`
5. ✅ Deploy to dev: `npm run deploy:dev`
6. ✅ Test deployment endpoints
7. ✅ Deploy to production: `npm run deploy:prod`
8. ✅ Update frontend with new API URL

---

**Made with ❤️ for AKOYA Luxury Laundry**
