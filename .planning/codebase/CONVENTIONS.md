# Coding Conventions

**Analysis Date:** 2026-06-03

## Naming Patterns

**Files:**
- JavaScript source files: `camelCase.js` (e.g., `contact-form.js`, `typewriter.js`, `copyright-year.js`)
- Minified/vendor files: `name.min.js` (e.g., `jquery.min.js`, `browser.min.js`)
- CSS files: `kebab-case.css` (e.g., `secondary.css`, `main.css`)
- HTML: `index.html` (single page entry point)
- Terraform files: `resource-type.tf` (e.g., `lambda.tf`, `dynamodb.tf`, `apigateway.tf`)
- Python: `snake_case.py` (e.g., `lambda_function.py`)

**JavaScript Functions:**
- Regular functions: `camelCase` (e.g., `get_visitors`, `tick`, `lambda_handler` in Python)
- IIFE functions: Anonymous self-invoking functions (e.g., in `typewriter.js` and `main.js`)
- Internal state/private variables: use underscore prefix or closure scope (e.g., `$window`, `$body` in `main.js`)

**JavaScript Variables:**
- DOM element references: prefixed with `$` (jQuery convention: `$body`, `$header`, `$wrapper`)
- Regular variables: `camelCase` (e.g., `visitorElement`, `charIdx`, `pauseTicks`, `deleting`)
- Constants: `UPPER_CASE` (e.g., `PAUSE = 28` in `typewriter.js`)

**CSS Variables (CSS Custom Properties):**
- Format: `--kebab-case` (e.g., `--accent`, `--green`, `--text-primary`, `--surface-hover`)
- Organized by category in `:root` (Design Tokens, Global overrides, Hero sections, etc.)

**Terraform Variables:**
- Local values: snake_case (e.g., `tags` in `locals.tf`)
- Resource names: `resource_type_descriptive_name` (e.g., `lambda_role`, `iam_policy_for_lambda`)
- Tag keys: PascalCase (e.g., `Project`, `Owner`, `Environment`)

**Python Variables:**
- Snake case throughout (e.g., `ddbTableName`, `responseBody` - mixed, but predominantly snake_case in boto3 contexts)
- Environment variables: UPPER_CASE with `os.environ` access (e.g., `databaseName`)

## Code Style

**Formatting:**
- No explicit formatter config (Prettier/ESLint not configured)
- CSS uses logical grouping with comments marking sections
- Comments use structured patterns: `/* ===== Section Name ===== */`

**Linting:**
- No linting configuration detected (no `.eslintrc`, `biome.json`, etc.)

**Indentation:**
- JavaScript: 2 spaces (visible in `contact-form.js`, `typewriter.js`)
- Python: 4 spaces (standard Python, seen in `lambda_function.py`)
- Terraform: 2 spaces (standard Terraform, seen in `.tf` files)

## Import Organization

**JavaScript:**
- No explicit import/module system (vanilla JS with jQuery dependency)
- jQuery used as global reference: `(function($) { ... })(jQuery)`
- Scripts loaded via `<script>` tags in `index.html`

**Python:**
- Standard library imports first: `import json`, `import os`
- Third-party imports: `import boto3`
- Pattern: `import module as alias` (e.g., `import boto3`)

**Terraform:**
- Organized by resource type across separate files
- Entry point: `main.tf` (documents overall structure as comments)
- No explicit import statements; Terraform reads all `.tf` files in directory

## Error Handling

**JavaScript Patterns:**
- Try-catch with async/await: `try { ... } catch (err) { ... }` in `visitorcount.js`
- Conditional checks before DOM access: `if (!form) return;` in `contact-form.js`
- Null-safe access: `item.get('Item')` with fallback in Python
- Alert-based user feedback: `alert("✅ Thank you!")` and `alert("❌ Oops!")`
- Console logging for debugging: `console.log()`, `console.error()`

**Python Patterns:**
- Bare `except:` clause used for fallback logic in `lambda_handler` (anti-pattern)
- Try-catch for DynamoDB operations (create if not exists pattern)
- Response body serialization with `json.dumps()`

## Logging

**Framework:** `console` methods (browser)

**Patterns:**
- Info logging: `console.log("Visitor count:", data)` for application state
- Error logging: `console.error("Visitor count fetch failed:", err)` for exceptions
- Debug statements: minimal, used primarily in API call paths

**Python:** No explicit logging framework; relies on CloudWatch via Lambda context

## Comments

**When to Comment:**
- Section headers for CSS: `/* ===== Description ===== */`
- Complex logic explanations: comments inline with setTimeout chains in `main.js`
- State management notes: e.g., "Handle lock" in `main.js`
- File header documentation: present in `main.js` (attribution to HTML5 UP template)

**JSDoc/TSDoc:**
- Not used in codebase
- Functions lack formal documentation blocks

**Terraform Comments:**
- Line comments (`#`) used for resource descriptions
- File-level comments explaining organization (e.g., in `main.tf`)

## Function Design

**Size:**
- Medium functions (20-50 lines typical)
- `$main._show` and `$main._hide` in `main.js` are 60-100 lines (nested logic with timeouts)

**Parameters:**
- Minimal parameters (1-3 typical)
- Event objects passed directly: `function (e)` for form submission
- No destructuring patterns observed

**Return Values:**
- Explicit returns: `if (!form) return;`
- Promise returns from async functions: `async function get_visitors()` returns Promise
- Void functions that mutate state: most jQuery methods

## Module Design

**Exports:**
- No module exports (vanilla JS, pre-ES6 module system)
- Global function calls: `get_visitors()` called at module level in `visitorcount.js`
- IIFE pattern for encapsulation: `(function($) { ... })(jQuery)` in `main.js`

**Barrel Files:**
- Not applicable (no module system)

## CSS Design Tokens

**Token Organization:**
- Color scheme: `--accent` (cyan #5bbad5), `--green`, `--red`, `--amber`
- Opacity variants: `--accent-dim`, `--accent-hover`, `--accent-border`
- Spacing: implicit through CSS values (no token for gaps)
- Typography: `--font` set to `"Inter", "Source Sans Pro", sans-serif`
- Transitions: `--transition: 0.2s ease`
- Border radius: `--radius`, `--radius-sm`, `--radius-xs`

---

*Convention analysis: 2026-06-03*
