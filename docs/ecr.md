## AWS ECR

This project uses AWS Elastic Container Registry (ECR) as a private container registry.

- Repository: enterprise-devops/enterprise-app
- Image scanning enabled
- Encrypted at rest
- Used by CI/CD pipelines and EKS workloads

Images are tagged using semantic versions and `latest` for rolling deployments.
