<!-- refreshed: 2026-06-03 -->
# Architecture

**Analysis Date:** 2026-06-03

## System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Client / Browser Layer                        │
│  `index.html` + `assets/js/` + `assets/css/`                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CDN & Static Hosting Layer                      │
│     CloudFront + S3 + ACM (HTTPS/SSL)                           │
│  `infra/cloudfront.tf` `infra/acm.tf`                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
┌─────────────────────────┐  ┌──────────────────────────────────┐
│   API Layer             │  │  Static Assets                   │
│  API Gateway + Lambda   │  │  (CSS, JS, Images)              │
│  `infra/apigateway.tf`  │  │  S3 Bucket                       │
│  `infra/lambda.tf`      │  │  `daniel-resumewebsite`          │
└────────┬────────────────┘  └──────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Compute Layer                                 │
│                    AWS Lambda                                    │
│     `infra/lambda/lambda_function.py`                           │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                    │
│                    DynamoDB Table                                │
│     `infra/dynamodb.tf` (visitor_count_ddb)                     │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Frontend HTML/CSS/JS | Render portfolio page, typewriter effect, contact form | `index.html`, `assets/css/main.css`, `assets/js/main.js` |
| Typewriter Effect | Animate role title rotation | `assets/js/typewriter.js` |
| Visitor Counter | Fetch and display visit count from Lambda | `assets/js/visitorcount.js` |
| Contact Form | Handle form submission | `assets/js/contact-form.js` |
| CloudFront Distribution | CDN for static files, SSL/TLS termination, edge caching | `infra/cloudfront.tf` |
| API Gateway | HTTP endpoint, CORS handling, Lambda integration | `infra/apigateway.tf` |
| Lambda Function | Business logic for visitor count increment/retrieval | `infra/lambda/lambda_function.py` |
| DynamoDB Table | Store and persist visitor count data | `infra/dynamodb.tf` |
| IAM Roles/Policies | Lambda execution permissions, DynamoDB access | `infra/iam.tf` |
| ACM Certificate | HTTPS certificate for custom domain | `infra/acm.tf` |
| Terraform State | Infrastructure state management | `infra/main.tf` |

## Pattern Overview

**Overall:** Serverless Static Website with Dynamic Visitor Counter

**Key Characteristics:**
- Client-side rendered single-page portfolio (HTML5 static site)
- Serverless backend using AWS Lambda for dynamic functionality
- CloudFront CDN for global content distribution and SSL/TLS
- DynamoDB NoSQL database for lightweight data persistence
- Infrastructure as Code (Terraform) for reproducible deployments
- GitHub Actions CI/CD pipeline for automated deployment

## Layers

**Frontend Layer:**
- Purpose: Provide interactive portfolio interface with real-time visitor counter
- Location: `assets/`, `index.html`
- Contains: HTML structure, CSS styling (base + responsive), JavaScript modules
- Depends on: Browser APIs (DOM, Fetch), external CDN (Font Awesome, Google Fonts)
- Used by: End users accessing the portfolio website

**CDN/Delivery Layer:**
- Purpose: Distribute static assets globally with low latency and high availability
- Location: CloudFront distribution + S3 bucket
- Contains: All static files (HTML, CSS, JS, images, fonts)
- Depends on: S3 bucket, ACM certificate for HTTPS
- Used by: Browser clients via cached content delivery

**API Layer:**
- Purpose: Expose backend functionality through RESTful HTTP endpoints
- Location: `infra/apigateway.tf`
- Contains: HTTP API definition, routes, integrations, CORS configuration
- Depends on: Lambda function for actual processing
- Used by: Frontend JavaScript (visitor count fetch)

**Compute Layer:**
- Purpose: Execute server-side business logic for visitor count operations
- Location: `infra/lambda/lambda_function.py`
- Contains: Python handler that updates/retrieves DynamoDB data
- Depends on: DynamoDB table, IAM permissions
- Used by: API Gateway to handle requests

**Data Layer:**
- Purpose: Persist application state (visitor count)
- Location: `infra/dynamodb.tf`
- Contains: Single table with visitor_count item
- Depends on: IAM policy for Lambda access
- Used by: Lambda function for read/write operations

## Data Flow

### Visitor Counter Request Path

1. **Frontend Load** (`index.html`, line ~1): Page loads, script tags initialize
2. **Module Execution** (`assets/js/visitorcount.js`, line 25): `get_visitors()` function called automatically
3. **API Call** (`assets/js/visitorcount.js`, line 4): Fetch to API Gateway endpoint
4. **API Gateway Route** (`infra/apigateway.tf`, line 53): Route `ANY /terraform_lambda_func` receives request
5. **Lambda Invocation** (`infra/apigateway.tf`, line 45): AWS_PROXY integration triggers Lambda
6. **Handler Execution** (`infra/lambda/lambda_function.py`, line 12): `lambda_handler()` processes request
7. **DynamoDB Update** (`infra/lambda/lambda_function.py`, line 15-23): UpdateItem attempts to increment Visits counter
8. **DynamoDB Fallback** (`infra/lambda/lambda_function.py`, line 26-30): If item missing, PutItem creates it
9. **DynamoDB Retrieve** (`infra/lambda/lambda_function.py`, line 34-38): GetItem fetches current count
10. **Response Formatting** (`infra/lambda/lambda_function.py`, line 48-60): JSON response with CORS headers
11. **Frontend Display** (`assets/js/visitorcount.js`, line 13-14): Count displayed with animation

**State Management:**
- Client state: None (stateless frontend)
- Server state: Visitor count stored in DynamoDB, persisted across requests
- Session state: Not used
- Cache: CloudFront TTL 3600 seconds for HTML, longer for assets

### Contact Form Submission

1. **Form Submit** (`assets/js/contact-form.js`, line 6): User submits contact form
2. **Fetch Request** (`assets/js/contact-form.js`, line 11): POST to form.action endpoint
3. **Response Handling** (`assets/js/contact-form.js`, line 19-26): Success/error alert displayed

## Key Abstractions

**Visitor Counter Module:**
- Purpose: Encapsulate visitor count fetching and display logic
- Examples: `assets/js/visitorcount.js`
- Pattern: Async fetch wrapper with error handling and DOM manipulation

**Typewriter Effect Module:**
- Purpose: Animate role title rotation with character-by-character typing effect
- Examples: `assets/js/typewriter.js`
- Pattern: Self-executing function with closure-based state (idx, charIdx, deleting)

**Terraform Infrastructure Modules:**
- Purpose: Organize infrastructure resources by concern (compute, storage, networking, identity)
- Examples: `infra/lambda.tf`, `infra/dynamodb.tf`, `infra/iam.tf`, `infra/apigateway.tf`
- Pattern: Modular Terraform files with clear resource grouping

**Lambda Function Handler:**
- Purpose: Single entry point for all API requests via AWS_PROXY integration
- Examples: `infra/lambda/lambda_function.py` (lambda_handler function)
- Pattern: Event-driven handler that maps HTTP request to business logic

## Entry Points

**Browser/User Entry:**
- Location: `index.html`
- Triggers: User navigates to https://danielportfolio.eddesucesso.tech
- Responsibilities: Load HTML structure, initialize CSS/JS, trigger script modules

**JavaScript Modules:**
- Location: `assets/js/main.js` (initialization), `assets/js/visitorcount.js` (auto-exec), `assets/js/typewriter.js` (auto-exec)
- Triggers: DOMContentLoaded (contact-form), window.load (main.js), immediate execution (visitorcount, typewriter)
- Responsibilities: DOM manipulation, event handling, API communication

**Lambda Entry:**
- Location: `infra/lambda/lambda_function.py` (lambda_handler function)
- Triggers: API Gateway routes ANY request to /terraform_lambda_func
- Responsibilities: Parse event, execute business logic, return formatted response

**Terraform Entry:**
- Location: `infra/main.tf`
- Triggers: `terraform init`, `terraform plan`, `terraform apply`
- Responsibilities: Load backend state, orchestrate resource creation

**GitHub Actions Entry:**
- Location: `.github/workflows/create-deploy.yaml` (push to main), `.github/workflows/create-validate.yaml` (push to feature/**)
- Triggers: Git push events
- Responsibilities: Validate infrastructure, deploy to AWS, update static files

## Architectural Constraints

- **Threading:** Single-threaded event loop in browser (JavaScript). Lambda executes in separate process per invocation. No explicit threading code.
- **Global state:** Lambda function initializes DynamoDB client and table reference at module level (`dynamodb`, `table` globals in `infra/lambda/lambda_function.py`). Browser has no persistent global state between page loads.
- **Circular imports:** None detected. Terraform modules are imported via terraform syntax (no circular dependencies). JavaScript modules are independent.
- **CORS:** Hardcoded to single origin in API Gateway: `"allow_origins": ["https://danielportfolio.eddesucesso.tech"]` (`infra/apigateway.tf`, line 13)
- **API Rate Limiting:** Not configured. API Gateway accepts all requests without throttling.
- **Lambda Timeout:** Not explicitly set; defaults to 3 seconds. May be insufficient for slow DynamoDB operations.
- **DynamoDB Capacity:** PAY_PER_REQUEST billing mode; auto-scales but incurs per-request charges.
- **CloudFront Caching:** Default TTL 3600 seconds; max TTL 86400 seconds. HTML is cached, which may delay updates.

## Anti-Patterns

### Bare Exception Handling in Lambda

**What happens:** Lambda function catches all exceptions with bare `except:` clause (`infra/lambda/lambda_function.py`, line 24)
**Why it's wrong:** Masks all errors (permission denied, network errors, malformed requests). Makes debugging difficult. Silently creates fallback items when not intended.
**Do this instead:** Catch specific exceptions (`botocore.exceptions.ClientError` for DynamoDB, `json.JSONDecodeError` for parsing) and re-raise unhandled errors. Log errors explicitly.

### Global boto3 Client Initialization

**What happens:** DynamoDB client initialized at module level (`infra/lambda/lambda_function.py`, lines 6-9), shared across all Lambda invocations
**Why it's wrong:** Connections persist across warm invocations; cold starts may timeout. Environment variable accessed during module load (fails if missing).
**Do this instead:** Initialize client inside `lambda_handler()` or use lazy initialization to defer errors until function execution.

### Hardcoded Table Name in Code

**What happens:** Table name hardcoded as string `"visitor_count_ddb"` in Lambda handler; environment variable `databaseName` is not actually used in the update/put operations
**Why it's wrong:** Inconsistency between environment variable declaration (`infra/lambda.tf`, line 18) and actual usage. Makes code inflexible; requires code change to swap tables.
**Do this instead:** Use environment variable consistently: `table = dynamodb.Table(os.environ['databaseName'])` and ensure Terraform passes the correct name.

### CORS Policy Too Permissive for Visitor Counter

**What happens:** Visitor counter Lambda returns wildcard CORS headers in `Access-Control-Allow-Origin: *` (`infra/lambda/lambda_function.py`, line 56)
**Why it's wrong:** Allows any origin to call the endpoint, defeating API Gateway's CORS restriction. API Gateway restricts to single origin, but Lambda response header contradicts it.
**Do this instead:** Return CORS header matching the API Gateway configuration or use API Gateway's built-in CORS handling to avoid duplicate headers.

### No Input Validation in Lambda

**What happens:** Lambda handler accepts event with no validation; assumes fixed structure
**Why it's wrong:** Malformed requests from unexpected clients could cause crashes; no graceful degradation.
**Do this instead:** Validate event schema at handler entry; return 400 Bad Request for invalid input.

### Contact Form Has No Backend

**What happens:** Contact form JavaScript sends POST but no Lambda function processes it (`assets/js/contact-form.js`, line 11)
**Why it's wrong:** Form submission silently fails or goes to external service (e.g., Formspree). No email notification or data storage.
**Do this instead:** Implement Lambda handler for contact form; store messages in DynamoDB or send via SES.

## Error Handling

**Strategy:** Minimal error handling. Defaults to graceful UI fallback.

**Patterns:**
- JavaScript async/await with try-catch: Catches network errors, displays "N/A" fallback (`assets/js/visitorcount.js`, lines 3-22)
- Lambda bare exception: Assumes DynamoDB operation failure means item missing; creates new item as fallback (`infra/lambda/lambda_function.py`, lines 24-31)
- Contact form: Shows alert on success/error, does not log or persist failures (`assets/js/contact-form.js`, lines 19-26)

## Cross-Cutting Concerns

**Logging:** 
- Frontend: Console.log for debugging (in visitorcount.js, main.js)
- Lambda: CloudWatch Logs via IAM policy (logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents in `infra/iam.tf`, line 32-36)
- API Gateway: CloudWatch access logs enabled (`infra/apigateway.tf`, line 24-39)

**Validation:**
- Frontend: No form validation before submission (contact form accepts any input)
- Lambda: No schema validation; assumes DynamoDB response structure

**Authentication:**
- Frontend: Public access, no user authentication
- API Gateway: No API keys or authorization required
- Lambda: IAM role-based; only accessible via API Gateway
- S3/CloudFront: Public read via OAC (Origin Access Control), no user auth

**Rate Limiting:**
- API Gateway: Not configured; accepts unlimited requests
- DynamoDB: PAY_PER_REQUEST mode handles bursts automatically

---

*Architecture analysis: 2026-06-03*
