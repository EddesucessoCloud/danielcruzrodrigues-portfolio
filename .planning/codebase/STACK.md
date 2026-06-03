# Technology Stack

**Analysis Date:** 2026-06-03

## Languages

**Primary:**
- HTML5 - Frontend markup for portfolio website
- CSS3 - Styling and responsive design
- JavaScript - Client-side interactivity and API integration

**Secondary:**
- Python 3.8 - AWS Lambda backend for visitor count functionality

## Runtime

**Environment:**
- AWS Lambda (Python 3.8 runtime for backend)
- Browser runtime for frontend (modern browsers, ES6+ support)

**Package Manager:**
- pip (Python dependencies for Lambda)
- CDN-based for frontend libraries (Font Awesome, Google Fonts)

## Frameworks

**Core:**
- No frontend framework used - vanilla HTML/CSS/JavaScript
- AWS Lambda - Serverless compute for backend

**Build/Dev:**
- Terraform ~5.98.0 - Infrastructure as Code for AWS resource provisioning
- GitHub Actions - CI/CD pipeline for validation and deployment

## Key Dependencies

**Critical:**
- boto3 - AWS SDK for Python, enables DynamoDB access in Lambda (`infra/lambda/lambda_function.py`)
- Terraform AWS Provider ~5.98.0 - Manages AWS infrastructure (`infra/providers.tf`)

**Frontend Libraries (CDN):**
- Font Awesome 6.7.2 - Icon library via CDN (CDN: cdnjs.cloudflare.com)
- Google Fonts - Custom typography via CDN (fonts.googleapis.com)
- jQuery - DOM manipulation and utilities (`assets/js/jquery.min.js`)

**Infrastructure:**
- AWS Lambda - Serverless compute runtime
- DynamoDB - NoSQL database for visitor count
- API Gateway v2 - HTTP API endpoint for Lambda
- CloudFront - CDN and content distribution
- S3 - Static website hosting
- ACM (AWS Certificate Manager) - SSL/TLS certificate management
- CloudWatch - Logging and monitoring

## Configuration

**Environment:**
- AWS region: us-east-1 (hardcoded across Terraform configuration)
- Lambda environment variable: `databaseName = "visitor_count_ddb"` (`infra/lambda.tf`)
- S3 bucket: "daniel-resumewebsite" (`infra/cloudfront.tf`)
- API Gateway CORS: Restricted to `https://danielportfolio.eddesucesso.tech` (`infra/apigateway.tf`)

**Build:**
- Terraform configuration in `infra/` directory
- S3 backend for Terraform state (`infra/main.tf`):
  - Bucket: daniel-resumewebsite
  - Key: infra/terraform.tfstate
  - Region: us-east-1
  - Encryption: enabled

**Dependencies:**
- Renovate configuration (`renovate.json`) enabled for dependency updates
- GitHub Actions integration for CI/CD

## Platform Requirements

**Development:**
- Terraform >= 1.2.0
- AWS CLI (for credential configuration)
- AWS account with appropriate permissions
- Git with GitHub integration

**Production:**
- AWS Account (211125482456)
- AWS services: Lambda, DynamoDB, API Gateway v2, CloudFront, S3, ACM, CloudWatch, IAM
- GitHub Actions for automated deployment
- Domain: danielportfolio.eddesucesso.tech (via Route 53 or external DNS)

---

*Stack analysis: 2026-06-03*
