#!/bin/bash

set -e

echo "============================================"
echo "Franklin Benchmark - Backend ECR Deployment"
echo "============================================"

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="318035413014"
ECR_BACKEND_REPO="franklin-benchmark-backend"

# ECR URLs
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
BACKEND_IMAGE="${ECR_URL}/${ECR_BACKEND_REPO}:latest"


# Login to ECR
echo ""
echo "Logging into AWS ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URL}

# Build Docker image for linux/amd64 (EC2 compatible)
echo ""
echo "Building backend Docker image for linux/amd64..."
docker build --platform linux/amd64 -t ${ECR_BACKEND_REPO}:latest ./backend

# Tag for ECR
echo ""
echo "Tagging image for ECR..."
docker tag ${ECR_BACKEND_REPO}:latest ${BACKEND_IMAGE}

# Push to ECR
echo ""
echo "Pushing backend image to ECR..."
docker push ${BACKEND_IMAGE}

echo ""
echo ""
echo ""
echo "============================================"
echo ""
echo "Backend image pushed successfully!"
echo "Backend: ${BACKEND_IMAGE}"
echo ""
echo "Don't forget to SSH into EC2 and run the pull script."
echo ""
echo "============================================"
