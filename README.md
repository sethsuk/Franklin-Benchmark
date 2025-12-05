# Franklin Benchmark

Franklin Benchmark is a React-based web application featuring a suite of mini-games designed to measure and compare user performance in reaction time, button mashing, and quick math. Built with modern authentication flows, seamless user onboarding, and real-time leaderboards, Franklin Benchmark offers a playful yet robust environment to challenge yourself and compete with others.

## Features

* **Google OAuth2 Authentication**: Users can sign in with Google, pick a unique username, and have their session persisted via JWT.
* **Onboarding Flow**: First-time users are prompted in a modal to choose a username, which is sent to the server and stored in their profile.
* **Three Mini-Games**:

  * **Reaction Time**: Measure how quickly you can click once the box turns green.
  * **Button Masher**: Mash the button as many times as possible within a set duration.
  * **Quick Math**: Solve as many random arithmetic problems as you can before time runs out.
* **Real-Time Leaderboards**: Scores are recorded via secure API calls, and leaderboards refresh automatically after each submission.
* **Responsive UI**: Styled with Montserrat font, soft color palette, and consistent component design for a seamless user experience.

## Getting Started

These instructions will help you clone, install dependencies, and run Franklin Benchmark locally.

### Prerequisites

* Node.js (>= 16.x)
* npm
* A Google OAuth Client ID
* Backend API running at `http://localhost:5000`

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/franklin-benchmark.git
   cd franklin-benchmark
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root with the following:

   ```ini
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start the development server**:

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

---

# Deployment Guide

## Architecture

Frontend and backend are hosted separately on AWS:

- Frontend: React app deployed to S3 as a static website
- Backend: Express.js running in a Docker container on EC2
- Database: PostgreSQL hosted on AWS RDS
- Deployment: Images pushed to ECR, pulled and run on EC2

```
Client Browser
      |
      v
S3 Static Website (franklin-benchmark-frontend)
      |
      +---------> EC2 Docker Container (port 5001)
                       |
                       v
                  RDS PostgreSQL Database
```

---

## AWS Infrastructure Setup

### Create RDS Database

Create a new PostgreSQL RDS instance and note the login credentials. Additionally, ensure the security group allows inbound traffic of type PostgreSQL (port 5432) from your security group that will be used by the EC2 instance.

Add the credentials to the env files and `ec2-user-data.sh` script.

### Create ECR Repository

Create an ECR repository for the backend Docker image and update the `deploy-to-ecr.sh` script with the repository URI. Then, run `./deploy-to-ecr.sh` to push the initial image.


### Create EC2 Instance & Elastic IP

To maintain a static IP address, allocate an Elastic IP for your EC2 instance. Then, launch an EC2 instance that uses the allocated Elastic IP.

Note the public IP address assigned to your EC2 instance. Update the `BACKEND_API_URL` variable in the `deploy-frontend-s3.sh` script with this IP address, so the frontend can communicate with the backend.

Make sure to configure the security group for the EC2 instance to allow inbound traffic on port 5001 (for the backend API) and port 22 (for SSH access).

Copy the `ec2-user-data.sh` script contents into the User Data section when launching the EC2 instance. This script will automatically set up Docker, log in to ECR, pull the backend image, and start the container on boot.

### Create S3 Bucket

Create a new S3 bucket for the frontend static website. Make sure to uncheck "Block all public access" and add a bucket policy to allow public read access.

Also, enable static website hosting in the bucket properties and set both the index and error documents to `index.html`.

In the bucket policy, add the following JSON (replace `franklin-benchmark-frontend` with the corresponding bucket name, if different):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::franklin-benchmark-frontend/*"
    }
  ]
}
```

---

## Deployment Steps

### Build and Push Backend to ECR

On your local machine, run `./deploy-to-ecr.sh` to build and push the backend Docker image to ECR.

### Start Backend on EC2

Launch your EC2 instance with the user-data script to automatically pull and run the backend container. Then, SSH into the instance to verify it's running.

To verify the backend is running:

```bash
docker logs franklin-backend
```

You should see output showing:
```
Connected to PostgreSQL database
Server running on port 5001
```

### Deploy Frontend to S3

On your local machine, run `./deploy-frontend-s3.sh` to build and push the frontend to S3.

When complete, you'll see:
```
Website URL:
http://franklin-benchmark-frontend.s3-website-us-east-1.amazonaws.com
```

---

## Endpoints and URLs

Frontend: http://franklin-benchmark-frontend.s3-website-us-east-1.amazonaws.com

Backend API Base: http://18.209.73.122:5001

Database: franklin-benchmark-db.cof4o8qk4ho3.us-east-1.rds.amazonaws.com:5432

---

## Updating Your App

### Update Backend

After making changes to backend code, run the `deploy-to-ecr.sh` script again. Then, restart the EC2 instance.

The user-data script will automatically pull the latest image and restart the container.

### Updating Frontend

After making changes to frontend code, run the `deploy-frontend-s3.sh` script again.

The new build will automatically be uploaded to S3. Clear your browser cache if you don't see changes right away.

---

## Notes

- EC2 public IP changes when you stop and restart the instance. Update BACKEND_API_URL in deploy-frontend-s3.sh if this happens.
- For a permanent IP, consider allocating an Elastic IP address.
- Always remember to stop EC2 and RDS when not in use to save costs during development.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Happy benchmarking!*

