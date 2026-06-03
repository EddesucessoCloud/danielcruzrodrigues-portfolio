# Testing Patterns

**Analysis Date:** 2026-06-03

## Test Framework

**Runner:**
- Not detected - no test runner configuration (`jest.config.*`, `vitest.config.*`, etc.)
- No test files found in codebase (no `*.test.js`, `*.spec.js`)

**Assertion Library:**
- None configured

**Run Commands:**
```bash
# No automated test commands present in package.json (no package.json exists)
# Testing currently manual/unavailable
```

## Test File Organization

**Location:**
- No test files detected in repository

**Naming:**
- Not applicable

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not applicable - no test framework configured

**Patterns:**
- Not applicable

## Mocking

**Framework:**
- Not configured

**Patterns:**
- Manual fetch mocking would be required for API testing
- No mock utilities present

**What to Mock:**
- External API calls: `https://hmp06jkngg.execute-api.us-east-1.amazonaws.com/default/terraform_lambda_func` in `assets/js/visitorcount.js`
- AWS services: boto3 client calls in `infra/lambda/lambda_function.py`
- DOM elements: Would need to mock browser API for form submission testing

**What NOT to Mock:**
- Core language features
- Built-in browser APIs (fetch, setTimeout) - consider using real implementations with proper async handling

## Fixtures and Factories

**Test Data:**
- No fixtures defined

**Location:**
- Not applicable

## Coverage

**Requirements:**
- None enforced

**View Coverage:**
- Not applicable

## Test Types

**Unit Tests:**
- Not implemented
- Candidates for unit testing:
  - `assets/js/typewriter.js` - typing animation logic (`tick` function)
  - `assets/js/copyright-year.js` - date formatting
  - `assets/js/gototop.js` - scroll position calculation
  - `infra/lambda/lambda_function.py` - DynamoDB visit counter logic

**Integration Tests:**
- Not implemented
- Candidates:
  - Form submission in `assets/js/contact-form.js` → Lambda API
  - Visitor count fetch in `assets/js/visitorcount.js` → DynamoDB via Lambda
  - Terraform infrastructure provisioning (manual via CI/CD in `.github/workflows/`)

**E2E Tests:**
- Not applicable - handled via manual CI/CD workflows
- `.github/workflows/create-validate.yaml` runs `terraform validate` and `terraform plan`
- `.github/workflows/create-deploy.yaml` runs full deployment with S3 upload and terraform apply

## CI/CD Testing Strategy

**Terraform Validation:**
- Location: `.github/workflows/create-validate.yaml`
- Command: `terraform validate` (lines 41-43)
- Scope: Syntax and configuration validation only (no plan review)

**Terraform Planning:**
- Location: `.github/workflows/create-validate.yaml`
- Command: `terraform plan -no-color -out=tfplan` (lines 45-47)
- Scope: Infrastructure change preview
- Executed on feature branches (`feature/**`)

**Deployment Workflow:**
- Location: `.github/workflows/create-deploy.yaml`
- Steps:
  1. S3 upload of static assets (lines 33-41)
  2. Terraform init (lines 46-48)
  3. Terraform plan (lines 50-52)
  4. Terraform apply with auto-approve (lines 54-56)
  5. Output retrieval (lines 58-63)

## Manual Testing Areas

**Frontend:**
- Article navigation (hash routing in `assets/js/main.js`)
- Form submission and validation (`assets/js/contact-form.js`)
- Typewriter animation (`assets/js/typewriter.js`)
- Visitor count display (`assets/js/visitorcount.js`)
- Scroll-to-top button (`assets/js/gototop.js`)
- Responsive breakpoints (breakpoints defined in `assets/js/main.js`)

**Backend/Infrastructure:**
- Lambda visitor counter invocation
- DynamoDB table creation and item management
- API Gateway integration
- CloudFront caching and distribution
- S3 bucket permissions and CORS

## Testing Gaps

**Critical Gaps:**
- No automated unit tests for JavaScript business logic
- No test framework configuration
- No mocking utilities for AWS API calls
- No test data fixtures
- No coverage tracking
- Python Lambda function untested (bare `except:` clause particularly risky)

**Recommendations for Implementation:**
1. Add Jest or Vitest for JavaScript testing
2. Add pytest for Python Lambda function testing
3. Create unit tests for `typewriter.js` animation logic
4. Create integration tests for form submission and visitor count retrieval
5. Add mocking for AWS API calls (boto3 mocks for Lambda, fetch mocks for API Gateway)
6. Enforce test coverage (minimum 70% recommended)
7. Add test pre-commit hooks to catch untested code

## Risk Areas Without Tests

**`infra/lambda/lambda_function.py`:**
- Bare `except:` clause (lines 24-31) - catches all exceptions indiscriminately
- No validation of `os.environ['databaseName']` before use
- Untested edge case: what if DynamoDB returns malformed response
- Risk: Silent failures or unexpected behavior in visitor counter

**`assets/js/visitorcount.js`:**
- No test for malformed API response handling
- No test for network timeout scenarios
- Hardcoded API endpoint (line 4) - no test for endpoint misconfiguration
- Risk: Visitor count display breaks silently with "N/A" fallback

**`assets/js/contact-form.js`:**
- No test for form validation
- No test for FormData serialization edge cases
- No test for network failures during submission
- Risk: User confusion if submission appears successful but isn't

---

*Testing analysis: 2026-06-03*
