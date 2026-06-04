# External Integrations

**Analysis Date:** 2026-06-03

## APIs & External Services

**AWS Services:**
- AWS Lambda - Backend function for visitor count (`infra/lambda.tf`)
  - Runtime: Python 3.8
  - Handler: `lambda_function.lambda_handler`
  - Environment variable: `databaseName`

- API Gateway v2 - HTTP API endpoint for Lambda invocation (`infra/apigateway.tf`)
  - Endpoint: `https://hmp06jkngg.execute-api.us-east-1.amazonaws.com/default/terraform_lambda_func`
  - Protocol: HTTP
  - CORS enabled for: `https://danielportfolio.eddesucesso.tech`
  - Route: `ANY /terraform_lambda_func`
  - Method: POST (AWS_PROXY integration)

**Frontend APIs:**
- AWS Lambda via API Gateway - Called from `assets/js/visitorcount.js`
  - Endpoint: `https://hmp06jkngg.execute-api.us-east-1.amazonaws.com/default/terraform_lambda_func`
  - Method: GET
  - Response format: JSON `{"count": <number>}`

## Data Storage

**Databases:**
- DynamoDB (NoSQL)
  - Table name: `visitor_count_ddb`
  - Billing mode: PAY_PER_REQUEST
  - Hash key: `id` (String)
  - Attributes: `id` (S), `visitor_count` (N), `Visits` (N)
  - Global Secondary Index: `visitor_count_index` on `visitor_count` attribute
  - Connection: AWS SDK (boto3) via Lambda IAM role
  - Client: boto3 (`infra/lambda/lambda_function.py`)

**File Storage:**
- AWS S3
  - Bucket: `daniel-resumewebsite`
  - Purpose: Static website hosting for HTML, CSS, JavaScript, images
  - Access: CloudFront distribution with Origin Access Control (OAC)
  - Files synced via GitHub Actions (`infra/create-deploy.yaml`):
    - `assets/` directory
    - `images/` directory
    - `draw.io/` directory
    - `index.html`
    - `favicon.ico`
    - `sitemap.xml`
    - `site.webmanifest`
    - `robots.txt`

**Caching:**
- AWS CloudFront - CDN for content delivery (`infra/cloudfront.tf`)
  - Distribution domain: Aliases to `danielportfolio.eddesucesso.tech`
  - Origin: S3 bucket via OAC
  - Price class: PriceClass_100
  - Cache behavior: Default TTL 3600s, Max TTL 86400s
  - Protocol: HTTPS (TLS 1.2+)

## Authentication & Identity

**AWS Identity:**
- GitHub OIDC Integration for CI/CD (`create-validate.yaml`, `create-deploy.yaml`)
  - AssumeRole: `arn:aws:iam::211125482456:role/GitHubAction-AssumeRoleWithAction`
  - Federated OIDC provider for GitHub Actions
  - Permissions: id-token write, contents write (validate), contents read (deploy)

**API Access:**
- No explicit API authentication
- CORS configured in API Gateway for browser requests
- CloudFront certificate validation via ACM

**Lambda Execution:**
- IAM Role: `terraform_lambda_func_Role` (`infra/iam.tf`)
- Permissions:
  - CloudWatch Logs: CreateLogGroup, CreateLogStream, PutLogEvents
  - DynamoDB: UpdateItem, GetItem, PutItem (table: `visitor_count_ddb`)
- Service principal: lambda.amazonaws.com

## Monitoring & Observability

**Error Tracking:**
- CloudWatch Logs
  - Log group: `visitor_count_log_group`
  - Retention: 30 days
  - Enabled for API Gateway stage (`infra/apigateway.tf`)

**Logs:**
- CloudWatch Logs via API Gateway access logging
  - Format: JSON with requestId, sourceIp, httpMethod, status, integrationErrorMessage
  - Destination: CloudWatch log group

**Lambda Metrics:**
- CloudWatch native metrics for Lambda function performance

## CI/CD & Deployment

**Hosting:**
- AWS (us-east-1 region)
- S3 + CloudFront for static site delivery
- Lambda + API Gateway for backend API

**CI Pipeline:**
- GitHub Actions (`create-validate.yaml`)
  - Trigger: Push to feature/* branches
  - Steps:
    1. Checkout with GH_PAT token
    2. Configure AWS credentials via OIDC
    3. Terraform init, validate, plan
    4. Stage changes and create PR

**CD Pipeline:**
- GitHub Actions (`create-deploy.yaml`)
  - Trigger: Push to main branch
  - Steps:
    1. Checkout repository
    2. Configure AWS credentials via OIDC
    3. Upload assets/images/draw.io/index.html to S3
    4. Terraform init, plan, apply (auto-approve)
    5. Retrieve CloudFront domain from Terraform output
    6. Publish deployment summary

## Environment Configuration

**Required env vars:**
- AWS_REGION: "us-east-1"
- S3_BUCKET: "daniel-resumewebsite"
- GitHub OIDC role ARN: `arn:aws:iam::211125482456:role/GitHubAction-AssumeRoleWithAction`

**Secrets location:**
- GitHub Secrets:
  - `GH_PAT` - GitHub Personal Access Token for PR creation (`create-validate.yaml`)

**Terraform Variables:**
- AWS account: 211125482456
- Domain: danielportfolio.eddesucesso.tech
- Terraform state bucket: daniel-resumewebsite

## Webhooks & Callbacks

**Incoming:**
- GitHub Actions webhooks (automated via GitHub push events to main and feature/* branches)

**Outgoing:**
- Lambda returns visitor count via API Gateway to frontend JavaScript (`assets/js/visitorcount.js`)
- CloudFront origin callbacks to S3 for static content retrieval

---

*Integration audit: 2026-06-03*
