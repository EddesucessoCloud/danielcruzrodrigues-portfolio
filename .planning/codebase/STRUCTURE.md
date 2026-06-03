# Codebase Structure

**Analysis Date:** 2026-06-03

## Directory Layout

```
[project-root]/
├── .github/                    # GitHub configuration
│   └── workflows/              # CI/CD pipelines
│       ├── create-deploy.yaml  # Deploy to AWS on main push
│       └── create-validate.yaml# Validate infra on feature/* push
├── .planning/                  # Generated planning documents
│   └── codebase/               # Codebase analysis (this directory)
├── assets/                     # Static web assets
│   ├── css/                    # Stylesheets
│   │   ├── main.css            # Core styling (400+ lines)
│   │   ├── secondary.css       # Additional styles
│   │   └── noscript.css        # Fallback for no-JS
│   ├── js/                     # JavaScript modules
│   │   ├── main.js             # Main application logic (400 lines)
│   │   ├── util.js             # Utility functions (586 lines)
│   │   ├── visitorcount.js     # Visitor counter API call (25 lines)
│   │   ├── typewriter.js       # Role title animation (48 lines)
│   │   ├── contact-form.js     # Form submission handler (28 lines)
│   │   ├── gototop.js          # Scroll to top button (13 lines)
│   │   ├── copyright-year.js   # Auto-update copyright (5 lines)
│   │   ├── browser.min.js      # Browser detection minified
│   │   ├── breakpoints.min.js  # Responsive breakpoints minified
│   │   ├── jquery.min.js       # jQuery library (minified)
│   │   └── fontawesome-all.min.css # Icon font CSS
│   ├── sass/                   # Sass source (if preprocessed)
│   │   ├── base/               # Base styles
│   │   ├── components/         # Component styles
│   │   ├── layout/             # Layout styles
│   │   └── libs/               # Library styles
│   └── webfonts/               # Font files
├── images/                     # Image assets
│   ├── icons/                  # Favicon and app icons
│   │   ├── favicon.svg
│   │   ├── favicon-96x96.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon-16x16.png
│   │   ├── apple-touch-icon.png
│   │   ├── safari-pinned-tab.svg
│   │   └── browserconfig.xml
│   ├── screenshot.webp         # Portfolio demo image
│   └── Cloud Resume Challenge Cover.webp # Hero image
├── draw.io/                    # Draw.io diagrams and exports
├── infra/                      # Infrastructure as Code (Terraform)
│   ├── .terraform/             # Terraform working directory (generated)
│   │   └── providers/          # Cached provider plugins
│   ├── lambda/                 # Lambda function code
│   │   ├── lambda_function.py  # Visitor counter handler
│   │   └── lambda_function.zip # Packaged function (generated)
│   ├── main.tf                 # Terraform entry point, backend config
│   ├── providers.tf            # AWS provider version constraints
│   ├── locals.tf               # Local variables (tags)
│   ├── imports.tf              # Placeholder for future imports
│   ├── iam.tf                  # IAM roles and policies
│   ├── lambda.tf               # Lambda function and archive
│   ├── dynamodb.tf             # DynamoDB table and initial item
│   ├── apigateway.tf           # API Gateway, routes, integrations
│   ├── cloudfront.tf           # CloudFront distribution, S3 policy, OAC
│   ├── acm.tf                  # ACM SSL/TLS certificate
│   ├── outputs.tf              # Terraform outputs (URLs)
│   ├── terraform.tfstate       # Current state (generated)
│   ├── terraform.tfstate.backup# State backup (generated)
│   └── .terraform.lock.hcl     # Dependency lock file (generated)
├── index.html                  # Main portfolio page
├── favicon.ico                 # Root favicon
├── robots.txt                  # Search engine crawler directives
├── sitemap.xml                 # SEO sitemap
├── site.webmanifest            # PWA manifest
├── renovate.json               # Dependency update automation
├── .gitignore                  # Git exclusions
├── .claude/                    # Claude configuration
│   └── settings.local.json     # Local settings
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

## Directory Purposes

**`.github/workflows/`:**
- Purpose: Automated deployment and validation pipelines
- Contains: GitHub Actions YAML workflow definitions
- Key files: `create-deploy.yaml` (production deploy), `create-validate.yaml` (PR validation)

**`assets/`:**
- Purpose: Static web assets served to browser clients
- Contains: Stylesheets, JavaScript, fonts, icons
- Key files: `assets/css/main.css` (core styles), `assets/js/main.js` (main app logic), `assets/js/visitorcount.js` (API integration)

**`assets/js/`:**
- Purpose: Client-side application logic and interactivity
- Contains: Vanilla JavaScript modules for UI behavior, API calls, animations
- Key files: `main.js` (core DOM manipulation), `util.js` (shared utilities), `visitorcount.js` (visitor counter), `typewriter.js` (title animation)

**`assets/css/`:**
- Purpose: Visual styling and responsive design
- Contains: CSS stylesheets for layout, typography, colors, responsive breakpoints
- Key files: `main.css` (primary styles), `secondary.css` (additional overrides)

**`images/`:**
- Purpose: Portfolio images and branding assets
- Contains: Icons, favicons, screenshots, hero images
- Key files: `screenshot.webp` (demo image), various favicon formats

**`infra/`:**
- Purpose: Infrastructure as Code for AWS cloud resources
- Contains: Terraform configuration files defining all backend services
- Key files: `main.tf` (entry point), `lambda.tf` (compute), `dynamodb.tf` (data), `apigateway.tf` (API), `cloudfront.tf` (CDN)

**`infra/lambda/`:**
- Purpose: Lambda function source code
- Contains: Python handler for visitor count operations
- Key files: `lambda_function.py` (main handler logic)

**Root Directory:**
- Purpose: Static site files and project metadata
- Contains: `index.html`, configuration files, licenses, documentation
- Key files: `index.html` (portfolio page), `robots.txt` (SEO), `site.webmanifest` (PWA)

## Key File Locations

**Entry Points:**
- `index.html`: Main portfolio website HTML; loaded by browser, triggers CSS/JS modules
- `infra/main.tf`: Terraform entry point; defines backend state and orchestrates infrastructure
- `.github/workflows/create-deploy.yaml`: CI/CD deployment pipeline triggered on main branch push
- `.github/workflows/create-validate.yaml`: CI/CD validation pipeline triggered on feature branch push

**Configuration:**
- `infra/providers.tf`: AWS provider version constraints and region
- `infra/locals.tf`: Reusable variables (tags) shared across resources
- `.github/workflows/*.yaml`: Deployment and validation automation
- `renovate.json`: Automated dependency updates

**Core Logic:**
- `infra/lambda/lambda_function.py`: Visitor counter business logic (DynamoDB operations)
- `assets/js/visitorcount.js`: Frontend API integration for visitor count
- `assets/js/typewriter.js`: Role title animation effect
- `assets/js/main.js`: Main application event handling and UI logic

**Styling:**
- `assets/css/main.css`: Primary stylesheet (reset, layout, typography, colors)
- `assets/css/secondary.css`: Additional CSS overrides and customizations

**Infrastructure:**
- `infra/iam.tf`: Lambda execution role and DynamoDB permissions
- `infra/dynamodb.tf`: Visitor count data store
- `infra/apigateway.tf`: HTTP API and Lambda integration
- `infra/cloudfront.tf`: CDN distribution and S3 policy
- `infra/acm.tf`: HTTPS certificate

**Metadata & Documentation:**
- `README.md`: Project overview and setup instructions
- `robots.txt`: Search engine crawler configuration
- `sitemap.xml`: Site structure for SEO
- `site.webmanifest`: PWA manifest (app name, icons, display mode)

## Naming Conventions

**Files:**
- **HTML**: `index.html` (root page), kebab-case for multi-word files
- **CSS**: `main.css`, `secondary.css` (semantic names), minified `.min.css` for libraries
- **JavaScript**: camelCase (`visitorcount.js`, `typewriter.js`), minified `.min.js` for libraries
- **Terraform**: kebab-case (`main.tf`, `api-gateway.tf`, `dynamodb.tf`), grouped by concern
- **Workflows**: `create-deploy.yaml`, `create-validate.yaml` (descriptive action prefix)

**Directories:**
- **Assets**: `assets/css`, `assets/js`, `assets/sass`, `assets/webfonts` (lowercase, plural for collections)
- **Infrastructure**: `infra/` (short), `infra/lambda/` (function code nested)
- **GitHub**: `.github/workflows/` (standard GitHub convention)
- **Config**: `.claude/`, `.planning/` (dot prefix for hidden/config directories)

**Variables & Functions:**
- **JavaScript**: camelCase (`get_visitors`, `visitorElement`)
- **Python**: snake_case (`lambda_handler`, `ddbTableName` mixed—see Lambda function)
- **Terraform**: snake_case (`aws_lambda_function`, `aws_dynamodb_table`, local variables `tags`)

## Where to Add New Code

**New Frontend Feature:**
- Primary code: `assets/js/[feature-name].js` (new module) or add to `assets/js/main.js` (if small)
- Styles: `assets/css/secondary.css` or create `assets/css/[feature-name].css`
- HTML: Add sections to `index.html`
- Example: New contact method → `assets/js/contact-form-enhanced.js` + `assets/css/contact.css`

**New Component/Module:**
- Implementation: `assets/js/[component-name].js` (self-contained module with IIFE or event listener)
- Initialization: Import in `index.html` `<script>` tag or call from `assets/js/main.js`
- Example: Gallery carousel → `assets/js/gallery.js` with event delegation

**Utilities & Helpers:**
- Shared helpers: `assets/js/util.js` (existing utility module)
- Example: New formatting function → Add to `assets/js/util.js` exports

**New API Endpoint:**
- Backend logic: `infra/lambda/lambda_function.py` (extend lambda_handler with new route handling)
- API route: `infra/apigateway.tf` (add new `aws_apigatewayv2_route` resource)
- IAM permissions: `infra/iam.tf` (add DynamoDB/service permissions if needed)
- Example: New endpoint `/stats` → Add route in apigateway.tf + handler code in lambda_function.py

**New Infrastructure Component:**
- Resources: Create new `.tf` file in `infra/` (e.g., `infra/s3.tf` for new bucket)
- Variables: Add to `infra/locals.tf` if shared across resources
- Outputs: Add to `infra/outputs.tf` if needed for reference
- Example: Add caching layer → `infra/elasticache.tf` + add security group to `infra/iam.tf`

**Database Changes:**
- Schema: Modify `infra/dynamodb.tf` (table structure)
- Initial data: Update `aws_dynamodb_table_item` in `infra/dynamodb.tf`
- Access control: Update IAM policy in `infra/iam.tf` with new permissions
- Example: Add timestamp tracking → Add `created_at` attribute in dynamodb.tf + update Lambda to write it

**Tests:**
- Unit tests: Not currently in repository; would add to `test/` or co-locate as `*.test.js`
- Infrastructure tests: Add to CI pipeline (create-validate.yaml) with `terraform validate`

**CI/CD Changes:**
- Deployment logic: Modify `.github/workflows/create-deploy.yaml` (S3 sync, Terraform apply)
- Validation logic: Modify `.github/workflows/create-validate.yaml` (Terraform validate, plan)
- Example: Add pre-deploy checks → Add step in create-deploy.yaml before "Terraform Apply"

## Special Directories

**`.terraform/`:**
- Purpose: Terraform working directory (cache and plugin storage)
- Generated: Yes (by `terraform init`)
- Committed: No (included in `.gitignore`)
- Contains: Provider plugins, state locks, module cache

**`.planning/codebase/`:**
- Purpose: Generated codebase analysis documents
- Generated: Yes (by GSD map-codebase)
- Committed: Yes (human-reviewed reference)
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, STACK.md, INTEGRATIONS.md

**`infra/.terraform/`:**
- Purpose: Terraform state and plugin files
- Generated: Yes
- Committed: No
- Note: State files (terraform.tfstate, terraform.tfstate.backup) contain sensitive AWS account info; never commit

**`assets/webfonts/`:**
- Purpose: Font files (FontAwesome, Google Fonts)
- Generated: No (downloaded during development)
- Committed: Yes (preloaded in index.html)

**`.github/workflows/`:**
- Purpose: GitHub Actions automation
- Generated: No (hand-written)
- Committed: Yes
- Note: Secrets referenced via ${{ secrets.GH_PAT }} are managed in GitHub repo settings

---

*Structure analysis: 2026-06-03*
