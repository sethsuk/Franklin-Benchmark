#!/bin/bash

set -e

echo "============================================"
echo "Franklin Benchmark - Frontend S3 Deployment"
echo "============================================"

# Configuration
AWS_REGION="us-east-1"
S3_BUCKET_NAME="franklin-benchmark-frontend"
BACKEND_API_URL="http://18.209.73.122:5001"

# Update API URL in environment
echo ""
echo "Setting up environment..."
export REACT_APP_API_URL="${BACKEND_API_URL}"

# Build React app
echo ""
echo "Building React application..."
cd frontend
npm install
npm run build
cd ..

if [ ! -d "frontend/build" ]; then
    echo "Error: Build failed. No build directory found."
    exit 1
fi

# Upload build files to S3
echo ""
echo "Uploading build files to S3..."

# Upload all files except index.html with long cache (1 year)
aws s3 sync ./frontend/build "s3://${S3_BUCKET_NAME}" \
    --delete \
    --cache-control "max-age=31536000,public" \
    --exclude "index.html" \
    --exclude "*.json"

# Upload index.html with no cache
aws s3 cp ./frontend/build/index.html "s3://${S3_BUCKET_NAME}/index.html" \
    --cache-control "no-cache,no-store,must-revalidate" \
    --content-type "text/html"

# Upload manifest.json with no cache
aws s3 cp ./frontend/build/manifest.json "s3://${S3_BUCKET_NAME}/manifest.json" \
    --cache-control "no-cache,no-store,must-revalidate" \
    --content-type "application/json"

echo ""
echo ""
echo ""
echo "============================================"
echo ""
echo "Website URL:"
echo "   http://${S3_BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com"
echo ""
echo "S3 Bucket Name: ${S3_BUCKET_NAME}"
echo ""
echo "Configuration:"
echo "   Backend API URL: ${BACKEND_API_URL}"
echo ""
echo "============================================"
