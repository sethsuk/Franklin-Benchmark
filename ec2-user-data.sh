#!/bin/bash

# ===========================================
# EC2 User Data Script
# ===========================================

set -e

# Log output to a file for debugging
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "$(date): Starting EC2 User Data script..."

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="318035413014"
ECR_BACKEND_REPO="franklin-benchmark-backend"

# Database configuration
DB_HOST="franklin-benchmark-db.cof4o8qk4ho3.us-east-1.rds.amazonaws.com"
DB_USER="postgres"
DB_PASSWORD="cGf0M53q5cA18lJfhiuo"
DB_NAME="franklin_benchmark"
DB_PORT="5432"

# ECR URLs
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
BACKEND_IMAGE="${ECR_URL}/${ECR_BACKEND_REPO}:latest"

# Update system
echo "$(date): Updating system packages..."
yum update -y

# Install Docker
echo "$(date): Installing Docker..."
yum install -y docker

# Start Docker daemon
echo "$(date): Starting Docker daemon..."
systemctl start docker
systemctl enable docker

# Install AWS CLI
echo "$(date): Installing AWS CLI..."
yum install -y aws-cli

# Add ec2-user to docker group (for non-root access)
echo "$(date): Adding ec2-user to docker group..."
usermod -aG docker ec2-user

# Wait for Docker to be ready
echo "$(date): Waiting for Docker daemon to be ready..."
sleep 10

# Login to ECR
echo "$(date): Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URL}

# Pull backend image
echo "$(date): Pulling backend image from ECR..."
docker pull ${BACKEND_IMAGE}

# Stop any existing container
echo "$(date): Stopping any existing container..."
docker stop franklin-backend 2>/dev/null || true
docker rm franklin-backend 2>/dev/null || true

# Run backend container with environment variables
echo "$(date): Starting backend container..."
docker run -d \
    --name franklin-backend \
    --restart unless-stopped \
    -p 5001:5001 \
    -e DB_HOST="${DB_HOST}" \
    -e DB_USER="${DB_USER}" \
    -e DB_PASSWORD="${DB_PASSWORD}" \
    -e DB_NAME="${DB_NAME}" \
    -e DB_PORT="${DB_PORT}" \
    -e NODE_ENV="production" \
    ${BACKEND_IMAGE}

# Wait and verify
echo "$(date): Waiting for container to start..."
sleep 5

echo "$(date): Checking container status..."
docker ps

echo "$(date): Checking container logs..."
docker logs franklin-backend || echo "No logs yet"

echo "$(date): User Data script completed successfully"

