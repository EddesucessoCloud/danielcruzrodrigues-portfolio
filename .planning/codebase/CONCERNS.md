# Codebase Concerns

**Analysis Date:** 2026-06-03

## Tech Debt

**Bare except clause in Lambda function:**
- Issue: `infra/lambda/lambda_function.py` line 24 uses a bare `except:` clause that catches all exceptions, including system exits and keyboard interrupts
- Files: `infra/lambda/lambda_function.py`
- Impact: Silent failures make debugging difficult; unexpected errors are masked; function continues execution even on critical failures
- Fix approach: Replace with specific exception handling (e.g., `except ClientError:` for DynamoDB-specific errors) to distinguish between intentional item creation (ItemNotFoundException) and actual errors

**Outdated Python runtime:**
- Issue: `infra/lambda.tf` specifies `runtime = "python3.8"` which is EOL as of October 2023
- Files: `infra/lambda.tf` line 14
- Impact: Security vulnerabilities, lack of patches, eventual AWS deprecation forcing migration
- Fix approach: Update to `python3.12` or latest stable runtime; test Lambda function thoroughly with new runtime

**Hardcoded API endpoint in frontend:**
- Issue: `assets/js/visitorcount.js` line 4 contains hardcoded production API Gateway URL
- Files: `assets/js/visitorcount.js`
- Impact: No environment-based configuration; difficult to switch between dev/staging/prod; breaks when API endpoint changes
- Fix approach: Use environment variables or configuration file to set API endpoint; inject at build time

**Hardcoded AWS account ID in IAM policy:**
- Issue: `infra/iam.tf` line 46 contains hardcoded account ID `211125482456` in DynamoDB resource ARN
- Files: `infra/iam.tf`
- Impact: Policy is not portable; must manually update if deploying to different account; violates Infrastructure-as-Code best practices
- Fix approach: Use `data.aws_caller_identity.current.account_id` variable throughout Terraform code

**Bare parameter name "Visits" in Lambda:**
- Issue: `infra/lambda/lambda_function.py` uses hardcoded partition key `id: 'Visits'` and attribute name `Visits` inconsistently
- Files: `infra/lambda/lambda_function.py` lines 17, 29, 43
- Impact: Attribute mismatch possible; DynamoDB schema not documented; hard to modify schema without breaking code
- Fix approach: Define attribute names as constants at module level; add schema validation

**No input validation on contact form:**
- Issue: `assets/js/contact-form.js` submits form data without validation
- Files: `assets/js/contact-form.js`
- Impact: Backend receives malformed/malicious data; no user feedback on invalid input; poor UX
- Fix approach: Add client-side validation (email format, required fields); add server-side validation in form handler

## Security Considerations

**Cross-Origin Resource Sharing (CORS) misconfiguration:**
- Risk: `infra/apigateway.tf` line 13 restricts CORS to `https://danielportfolio.eddesucesso.tech`, but Lambda returns `Access-Control-Allow-Origin: '*'` in response
- Files: `infra/apigateway.tf`, `infra/lambda/lambda_function.py` line 56
- Current mitigation: API Gateway CORS check provides some protection, but Lambda override weakens defense
- Recommendations: Remove hardcoded `*` from Lambda response; let API Gateway handle CORS entirely; test actual origin enforcement

**Exposed AWS API endpoint in frontend code:**
- Risk: API Gateway endpoint URL is visible in browser DevTools network tab and source code
- Files: `assets/js/visitorcount.js` line 4
- Current mitigation: Lambda uses AWS_PROXY and API key is not required (public GET)
- Recommendations: Add rate limiting to API Gateway; implement request signing if needed; monitor CloudWatch logs for abuse

**Missing environment variable for Lambda configuration:**
- Risk: Database name hardcoded as `visitor_count_ddb` in Terraform variables, not sourced from secure secret manager
- Files: `infra/lambda.tf` line 18
- Current mitigation: Environment is AWS-only, partially protected by IAM
- Recommendations: Consider using AWS Secrets Manager for sensitive configuration; add environment-based configuration layer

**No error logging in contact form:**
- Risk: `assets/js/contact-form.js` shows generic alert to user but provides no backend feedback for debugging
- Files: `assets/js/contact-form.js` line 24
- Current mitigation: Form uses HTTPS via CloudFront; local alerts only
- Recommendations: Log errors to CloudWatch; send error tracking to monitoring service

## Performance Bottlenecks

**Recursive setTimeout in typewriter animation:**
- Problem: `assets/js/typewriter.js` uses `setTimeout(tick, delay)` in recursive function without proper cleanup
- Files: `assets/js/typewriter.js` lines 43, 47
- Cause: Function creates new setTimeout call on every tick (up to 28+ ticks per word); no cancellation mechanism; runs indefinitely
- Improvement path: Use `setInterval()` instead for periodic updates; add cleanup function; consider CSS animations for better performance; add ability to stop animation

**Synchronous Lambda exception handling adds latency:**
- Problem: Lambda waits for DynamoDB response even on update failure before attempting put_item
- Files: `infra/lambda/lambda_function.py` lines 14-31
- Cause: Try-catch blocks for exception handling incur extra latency; bare except clause may mask transient errors
- Improvement path: Use conditional writes with UpdateExpression `if_not_exists`; leverage DynamoDB's atomic operations instead of try-catch pattern

**No caching strategy for visitor count:**
- Problem: Every page load triggers Lambda invocation via API Gateway
- Files: `assets/js/visitorcount.js`, `infra/apigateway.tf`
- Cause: API Gateway cache is not configured; default_ttl is 3600s for CloudFront but doesn't apply to API endpoint
- Improvement path: Add CloudFront distribution for API endpoint or implement Lambda response caching; consider SQS batch updates

## Fragile Areas

**Lambda function schema assumptions:**
- Files: `infra/lambda/lambda_function.py`
- Why fragile: Code assumes DynamoDB table has specific attributes (`id`, `Visits`) and partition key structure; no schema validation; mismatch with `infra/dynamodb.tf` which defines `visitor_count` attribute
- Safe modification: Write schema tests; use boto3 type hints; add explicit attribute name mapping function
- Test coverage: No unit tests; no integration tests for DynamoDB operations

**CloudFront distribution configuration:**
- Files: `infra/cloudfront.tf`
- Why fragile: S3 bucket reference uses data source lookup by hardcoded name `"daniel-resumewebsite"`; OAC setup is manually synchronized with S3 bucket policy; commented-out legacy s3_origin_config shows incomplete refactoring
- Safe modification: Use variable for bucket name; add validation that OAC policy matches distribution; test access control before deploying
- Test coverage: No Terraform plan validation in pre-commit; no integration tests

**GitHub Actions workflow automation:**
- Files: `.github/workflows/create-validate.yaml`, `.github/workflows/create-deploy.yaml`
- Why fragile: Validate workflow stages and commits changes automatically without manual review; deploy workflow uses `-auto-approve` flag; hardcoded role ARN for GitHub Actions OIDC
- Safe modification: Add PR review gate before merge; require explicit approval for terraform apply; parametrize role ARN
- Test coverage: No dry-run tests; no rollback mechanism; no infrastructure state backup verification

**HTML contact form endpoint:**
- Files: `index.html` (contact form action attribute not visible in excerpt)
- Why fragile: Contact form endpoint is likely hardcoded; no validation that endpoint exists before form renders
- Safe modification: Make form action dynamic; add endpoint availability check on page load; provide fallback
- Test coverage: No endpoint health checks; no form submission integration tests

## Scaling Limits

**DynamoDB provisioning model:**
- Current capacity: PAY_PER_REQUEST billing with no explicit throttling limits
- Limit: AWS DynamoDB default account-level quota is 40,000 RCU/WCU per region; single table can handle sustained traffic but burst protection is weak
- Scaling path: Monitor CloudWatch metrics for throttling; if count exceeds ~10K requests/second, consider provisioned capacity with auto-scaling; implement Lambda concurrency limits

**API Gateway throttling:**
- Current capacity: No explicit throttling configured in `infra/apigateway.tf`
- Limit: Default API Gateway rate limit is 10,000 RPS; quota per account varies by region
- Scaling path: Add explicit throttle settings; implement request signing to differentiate legitimate vs. abusive traffic; use WAF rules on CloudFront

**S3 and CloudFront bandwidth:**
- Current capacity: S3 default request rate 3,500 PUT/POST/DELETE per second, unlimited GET
- Limit: CloudFront can scale globally but origin (S3) has request rate limits
- Scaling path: Add CloudFront caching headers; implement request batching; monitor S3 request metrics

## Dependencies at Risk

**Python 3.8 runtime deprecation:**
- Risk: AWS will deprecate Python 3.8 runtime (already EOL)
- Impact: Lambda function will fail to deploy; existing deployments will be forced to migrate
- Migration plan: Update `infra/lambda.tf` to use `python3.12`; test Lambda thoroughly; update CI/CD pipeline to reflect new runtime

**Terraform AWS provider version constraint:**
- Risk: `infra/providers.tf` likely pins AWS provider to specific version; updates may lag behind AWS API changes
- Impact: New AWS features unavailable; compatibility issues; potential security patches delayed
- Migration plan: Review provider version constraints; update to latest stable version; test Terraform plan thoroughly before applying

**GitHub Actions action versions:**
- Risk: `create-validate.yaml` and `create-deploy.yaml` use specific action versions that may become unmaintained
- Impact: Security vulnerabilities in actions; deprecated dependency management
- Migration plan: Audit all `uses:` statements; update to latest versions; pin to major versions only (e.g., `v3` instead of `v3.1.0`)

## Test Coverage Gaps

**No Lambda function tests:**
- What's not tested: DynamoDB operations, error handling, CORS headers, UpdateExpression syntax
- Files: `infra/lambda/lambda_function.py`
- Risk: Silent failures when DynamoDB schema changes; undiscovered bugs in exception handling; security headers not validated
- Priority: High — Critical backend logic has zero test coverage

**No Terraform validation tests:**
- What's not tested: CloudFront distribution access control, IAM policy correctness, API Gateway routing
- Files: `infra/*.tf`
- Risk: Misconfigured resources deployed to production; security policies not enforced; broken infrastructure
- Priority: High — Infrastructure changes are auto-approved without validation

**No frontend integration tests:**
- What's not tested: Visitor count API calls, contact form submission, typewriter animation
- Files: `assets/js/visitorcount.js`, `assets/js/contact-form.js`, `assets/js/typewriter.js`
- Risk: Broken features discovered in production; browser compatibility issues
- Priority: Medium — User-facing features lack validation

**No E2E tests:**
- What's not tested: Full portfolio load in browser, visitor count increments, contact form flow
- Files: All frontend and backend integration
- Risk: Broken user experience in production; deployment failures undetected
- Priority: Medium — End-to-end functionality unmeasured

---

*Concerns audit: 2026-06-03*
