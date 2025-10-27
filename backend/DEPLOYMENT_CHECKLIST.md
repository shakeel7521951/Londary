# AWS Lambda Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Setup

- [ ] Node.js 18+ installed
- [ ] AWS CLI installed and configured
- [ ] Serverless Framework installed globally (`npm install -g serverless`)
- [ ] AWS account created with appropriate permissions

### 2. AWS Configuration

- [ ] AWS credentials configured (`aws configure`)
- [ ] IAM user has necessary Lambda permissions
- [ ] IAM user has API Gateway permissions
- [ ] IAM user has CloudWatch Logs permissions

### 3. Database Setup

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (allow 0.0.0.0/0 for Lambda)
- [ ] Connection string tested

### 4. Environment Variables

- [ ] `.env` file created from `.env.example`
- [ ] All required variables filled in
- [ ] MongoDB connection string verified
- [ ] JWT secret generated
- [ ] SMS API credentials configured
- [ ] Cloudinary credentials configured
- [ ] Frontend URL updated

### 5. Code Preparation

- [ ] All dependencies installed (`npm install`)
- [ ] Code tested locally (`npm start`)
- [ ] Lambda handler tested (`npm run offline`)
- [ ] No hardcoded credentials in code
- [ ] Error handling implemented

## Deployment Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Test Locally

```bash
# Test with original server
npm start

# Test with serverless offline
npm run offline
```

### Step 3: Deploy to Development

```bash
npm run deploy:dev
```

### Step 4: Test Deployed API

- [ ] Health check endpoint working
- [ ] User registration working
- [ ] User login working
- [ ] Orders endpoint working
- [ ] SMS service working
- [ ] File upload working

### Step 5: Deploy to Production

```bash
npm run deploy:prod
```

## Post-Deployment Tasks

### 1. Update Frontend

- [ ] Update `VITE_API_URL` in frontend `.env`
- [ ] Test all frontend features
- [ ] Verify CORS settings working

### 2. Monitoring Setup

- [ ] CloudWatch logs accessible
- [ ] Set up CloudWatch alarms for errors
- [ ] Set up CloudWatch alarms for high latency
- [ ] Configure log retention period

### 3. Performance Optimization

- [ ] Check cold start times
- [ ] Consider provisioned concurrency for prod
- [ ] Implement warming strategy if needed
- [ ] Monitor memory usage
- [ ] Adjust timeout if needed

### 4. Security

- [ ] API Gateway has request throttling
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Rate limiting implemented

### 5. Cost Monitoring

- [ ] AWS Budget alerts configured
- [ ] Monitor Lambda invocations
- [ ] Monitor API Gateway requests
- [ ] Review CloudWatch Logs costs

## Verification Tests

### API Endpoints to Test

```bash
# Health check
curl https://your-api-url.com/

# Health detailed
curl https://your-api-url.com/api/health

# User registration
curl -X POST https://your-api-url.com/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# User login
curl -X POST https://your-api-url.com/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## Rollback Plan

If deployment fails:

1. **Rollback to previous version**

```bash
serverless deploy --stage prod --package .serverless
```

2. **Remove failed deployment**

```bash
serverless remove --stage prod
```

3. **Check logs**

```bash
serverless logs -f api --stage prod
```

## Common Issues and Solutions

### Issue: Cold Start Timeout

**Solution**: Increase timeout in serverless.yml or use provisioned concurrency

### Issue: Database Connection Failed

**Solution**:

- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify connection string
- Check database user permissions

### Issue: CORS Errors

**Solution**:

- Verify FRONTEND_URL in environment variables
- Check CORS configuration in lambda.js
- Ensure API Gateway CORS enabled

### Issue: File Upload Errors

**Solution**:

- Verify Cloudinary credentials
- Check /tmp directory permissions
- Increase memory limit if needed

### Issue: SMS Not Sending

**Solution**:

- Verify SMS API credentials
- Check API endpoint availability
- Review CloudWatch logs for errors

## Monitoring Commands

```bash
# View real-time logs
npm run logs

# View specific time range
serverless logs -f api --startTime 1h --stage prod

# Get function info
serverless info --stage prod

# Invoke function locally
serverless invoke local -f api --data '{"path":"/api/health","httpMethod":"GET"}'

# Get deployment list
serverless deploy list --stage prod
```

## Contact Information

**AWS Support**: https://console.aws.amazon.com/support/
**Serverless Documentation**: https://www.serverless.com/framework/docs/

---

## Quick Commands Reference

```bash
# Deploy
npm run deploy:dev          # Deploy to development
npm run deploy:prod         # Deploy to production

# Test
npm run offline             # Test locally with serverless
npm start                   # Test with original server

# Monitor
npm run logs                # View logs
serverless info             # Get deployment info

# Cleanup
npm run remove              # Remove deployment
```

**Last Updated**: $(date)
**Deployment Owner**: AKOYA Luxury Laundry Team
