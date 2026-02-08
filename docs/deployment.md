# Application Deployment Guide (EC2 + AWS ECR)

This document describes how to deploy the `enterprise-devops` application to an EC2 instance using Docker images stored in AWS ECR.

The deployment follows an **artifact-based CD approach**:
- Images are built in CI
- Pushed to ECR
- Pulled and run on EC2 (no local builds)

---

## 🧱 Prerequisites

Ensure the EC2 instance has:

- Docker installed and running
- AWS CLI installed
- IAM role or credentials with ECR access
- Port `3000` allowed in the security group (for testing)

---

## 🔐 Login to AWS ECR

Authenticate Docker with ECR using AWS CLI:

```bash
aws ecr get-login-password --region ap-south-1 \
| docker login --username AWS --password-stdin \
<ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

 Replace <ACCOUNT_ID> with your AWS account ID.

📦 Pull Docker Image from ECR

Images are tagged using immutable Git commit SHAs.

docker pull \
<ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/enterprise-devops/enterprise-app:<COMMIT_SHA>


Example:

docker pull \
123456789012.dkr.ecr.ap-south-1.amazonaws.com/enterprise-devops/enterprise-app:b942821e28378273e989c02a8c6d779c9e22932c

🚀 Run the Application Container

Stop and remove any existing container:

docker rm -f enterprise-app || true


Run the new version:

docker run -d \
  --name enterprise-app \
  -p 3000:3000 \
  --restart unless-stopped \
  <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/enterprise-devops/enterprise-app:<COMMIT_SHA>

✅ Verify Deployment
Health Check (from EC2)
curl http://localhost:3000/health


Expected response:

{"status":"UP"}

View Application Logs
docker logs enterprise-app

🔁 Rollback Procedure

To roll back to a previous version, deploy an older image tag:

docker rm -f enterprise-app

docker run -d \
  --name enterprise-app \
  -p 3000:3000 \
  --restart unless-stopped \
  <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/enterprise-devops/enterprise-app:<OLD_COMMIT_SHA>


Rollback is instant since images are immutable and stored in ECR.

🧠 Deployment Strategy Notes

Docker images are never built on EC2

CI pipeline is responsible for builds and tagging

EC2 is used only as a runtime environment

Commit SHA tags enable traceability and fast rollback

🔮 Future Improvements

Automate deployment via GitHub Actions (SSH-based CD)

Migrate runtime to ECS or EKS

Add monitoring and alerting

Introduce blue/green or rolling deployments


---





