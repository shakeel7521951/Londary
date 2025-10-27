#!/bin/bash

# AKOYA Laundry - Quick Deployment Script

echo "🚀 AKOYA Laundry - AWS Lambda Deployment"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with required environment variables."
    echo "See .env.example for reference."
    exit 1
fi

echo "✅ Environment file found"

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: AWS credentials not configured!"
    echo "Run 'aws configure' to set up your credentials."
    exit 1
fi

echo "✅ AWS credentials configured"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies installed"

# Ask for deployment stage
echo ""
echo "Select deployment stage:"
echo "1) Development (dev)"
echo "2) Production (prod)"
echo "3) Custom stage"
read -p "Enter choice (1-3): " stage_choice

case $stage_choice in
    1)
        STAGE="dev"
        ;;
    2)
        STAGE="prod"
        ;;
    3)
        read -p "Enter custom stage name: " STAGE
        ;;
    *)
        echo "Invalid choice. Defaulting to dev."
        STAGE="dev"
        ;;
esac

echo ""
echo "🚀 Deploying to stage: $STAGE"
echo ""

# Deploy
serverless deploy --stage $STAGE

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Note the API endpoint URL above"
    echo "2. Update your frontend VITE_API_URL with this endpoint"
    echo "3. Test the API health endpoint"
    echo ""
    echo "View logs: serverless logs -f api -t --stage $STAGE"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Check the error messages above for details."
    exit 1
fi
