# SEO Action Plan — danielportfolio.eddesucesso.tech

**Generated:** 2026-06-05 | **Health Score:** 64/100 | **Target:** 80+/100

---

## Priority Definitions

- **Critical** — Blocks indexing, causes security risk, or directly costs recruiter conversions
- **High** — Significantly impacts rankings or AI discoverability (fix within 1 week)
- **Medium** — Optimisation opportunity (fix within 1 month)
- **Low** — Nice to have (backlog)

---

## Critical Priority

### C1 — Add Security Headers via CloudFront Response Headers Policy
**Impact:** Technical SEO +12 pts | **Effort:** 1-2h (Terraform only)

No security headers are present. All are configurable via one Terraform resource — zero frontend changes needed.

```hcl
# Add to infra/cloudfront.tf
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "portfolio-security-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    frame_options      { frame_option = "DENY"; override = true }
    content_type_options { override = true }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }

  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=()"
      override = true
    }
  }
}

# Then attach to the distribution:
# response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
```

Then add a Cache-Control behavior:
- HTML (`*.html`, default): `no-cache`
- Assets (`/assets/*`): `public, max-age=31536000, immutable` (Vite hashes filenames)

---

### C2 — Add Resume PDF Download Button to Hero
**Impact:** Recruiter conversion (primary) | **Effort:** 20 min

Recruiters paste PDFs into ATS — no download button = lost conversions.

Add to the hero section alongside the existing LinkedIn/GitHub/Email CTAs:
```html
<a href="/images/daniel-cruz-rodrigues-data-engineer-resume.pdf"
   class="btn-primary"
   download
   aria-label="Download Daniel's resume PDF">
  <i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>
  Resume PDF
</a>
```

---

### C3 — Fix Duplicate DOM Headings
**Impact:** Heading hierarchy, thin content signal | **Effort:** 30-60 min

All H2 and H3 headings are rendered twice in the DOM. Likely a JS component mounting issue (section cloned or rendered twice without deduplication). Affects: "Let's Connect" (H2) and all four expertise section H3s.

**Debug steps:**
1. Open DevTools → Elements → search for `<h2` — confirm duplicate count
2. Locate the JS component or template that mounts expertise cards twice
3. Remove the duplicate mount; ensure each section has a unique `id` attribute

---

## High Priority

### H1 — Create /llms.txt
**Impact:** AI Search Readiness +15 pts | **Effort:** 45 min

```
# Daniel Cruz Rodrigues — Senior Data Engineer

> Senior Data Engineer with 4+ years of experience in large-scale data
> pipelines, cloud infrastructure, and MLOps. AWS-certified (5 certs).
> Open to international remote opportunities in data engineering,
> Databricks, and cloud-native roles.

## About
- Full name: Daniel Cruz Rodrigues
- Role: Senior Data Engineer
- Employer: NTT DATA (current)
- Location: Brazil (open to remote / relocation)
- Contact: danielcruz.alu.lmb@gmail.com
- LinkedIn: https://www.linkedin.com/in/danielcruzbianalytics/
- GitHub: https://github.com/EddesucessoCloud
- Blog: https://danielcruzrodrigues.hashnode.dev

## Key Achievements
- Apache Spark pipelines processing 20M+ records/day on Databricks + Delta Lake
- Reduced pipeline MTTD by ~50% via Datadog/Prometheus observability stack
- Delivered ~30% performance gain through Spark optimisation (partitioning, caching, broadcast joins)
- Cut AWS infrastructure costs by 25% via Spot Instances and right-sizing
- Automated CI/CD with Terraform + GitHub Actions

## Certifications
- AWS Certified Solutions Architect – Professional
- AWS Certified DevOps Engineer – Professional
- AWS Certified Developer – Associate
- AWS Certified Data Engineer – Associate
- AWS Certified Solutions Architect – Associate

## Core Skills
Databricks, Delta Lake, Apache Spark, PySpark, AWS EMR, AWS Glue, AWS Step Functions,
Terraform, Apache Airflow, MLlib, Scikit-learn, TensorFlow, Datadog, Prometheus, Grafana

> LLM inference crawlers: permitted for retrieval and summarisation.
> Training use: not permitted.
```

Deploy as a static file to S3 — it will be served at `/llms.txt` by CloudFront.

Also add to robots.txt:
```
User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /
```

---

### H2 — Trim Meta Description to ≤155 Characters
**Impact:** SERP CTR — recruiter CTA no longer truncated | **Effort:** 5 min

**Replace in `index.html`:**
```html
<!-- Remove -->
<meta name="description" content="Senior Data Engineer (4+ yrs) specialising in Databricks, AWS and Apache Spark. Building large-scale Data Lakes and AI/ML solutions at NTT DATA. Open to remote roles worldwide." />

<!-- Add (154 chars) -->
<meta name="description" content="Senior Data Engineer (4+ yrs) specialising in Databricks, AWS and Apache Spark. Building large-scale Data Lakes at NTT DATA. Open to remote roles worldwide." />
```

---

### H3 — Fix og:url Trailing Slash
**Impact:** Social crawlers — eliminates soft duplicate signal | **Effort:** 5 min

```html
<!-- Remove -->
<meta property="og:url" content="https://danielportfolio.eddesucesso.tech" />

<!-- Add -->
<meta property="og:url" content="https://danielportfolio.eddesucesso.tech/" />
```

---

### H4 — Enrich Person Schema (image, nationality, knowsLanguage, Credly URLs)
**Impact:** Google AI Overviews entity disambiguation, Bing Copilot | **Effort:** 30 min

In the `<script type="application/ld+json">` Person node, add:

```json
"image": {
  "@type": "ImageObject",
  "url": "https://danielportfolio.eddesucesso.tech/images/cloud-resume-challenge-cover.webp",
  "width": 1200,
  "height": 630
},
"nationality": { "@type": "Country", "name": "Brazil" },
"knowsLanguage": ["pt", "en"]
```

Fix LinkedIn sameAs:
```json
"sameAs": [
  "https://github.com/EddesucessoCloud/",
  "https://www.linkedin.com/in/danielcruzbianalytics/",
  "https://danielcruzrodrigues.hashnode.dev"
]
```

Enrich each `hasCredential` node:
```json
{
  "@type": "EducationalOccupationalCredential",
  "name": "AWS Certified Solutions Architect – Professional",
  "credentialCategory": "Professional Certification",
  "recognizedBy": {
    "@type": "Organization",
    "name": "Amazon Web Services",
    "sameAs": "https://aws.amazon.com"
  },
  "url": "https://www.credly.com/badges/<badge-id>/public_url"
}
```

---

### H5 — Add Prose "About" Bio Paragraph
**Impact:** AI citability (all platforms), E-E-A-T | **Effort:** 1h

Add a 150-word prose paragraph as the first content section (before the metrics cards). This becomes the universal AI citation passage.

**Template:**
> Daniel Cruz Rodrigues is a Senior Data Engineer at NTT DATA with over four years of experience building large-scale data platforms on Databricks, Apache Spark, and AWS. He specialises in the medallion architecture (bronze → silver → gold) on Delta Lake, processing over 20 million records daily with ACID guarantees. His cloud work at NTT DATA has delivered a 25% reduction in AWS infrastructure costs and a ~30% improvement in pipeline performance through Spark optimisation. He holds five AWS certifications including Solutions Architect – Professional and Data Engineer – Associate. Daniel is based in Brazil and is actively open to senior remote data engineering opportunities worldwide. He writes technical content on Hashnode and maintains open-source work on GitHub.

---

### H6 — Improve Sitemap
**Impact:** Crawl signal quality | **Effort:** 1h

1. Remove the PDF entry
2. Add `changefreq: monthly` to the homepage entry
3. Remove the third-party tool comment
4. Ideally: generate automatically in GitHub Actions on every deploy

**Minimal improved sitemap:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://danielportfolio.eddesucesso.tech/</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.00</priority>
  </url>
</urlset>
```

---

## Medium Priority

### M1 — Add Availability, Location, and Timezone to Hero
**Impact:** Recruiter qualification friction | **Effort:** 20 min

Add beneath the "Open to remote worldwide" badge:
- Current location: Brazil (UTC-3)
- Available for: fully remote or relocation
- Preferred timezone overlap: UTC-5 to UTC+2

---

### M2 — Expand Heading Structure
**Impact:** On-Page SEO, heading hierarchy | **Effort:** 30 min

Add explicit H2 tags for sections that currently lack them: About, Projects, Certifications, Contact. See `FULL-AUDIT-REPORT.md` for the recommended heading hierarchy.

---

### M3 — Add Acronym Expansions
**Impact:** Non-technical screener readability | **Effort:** 20 min

On first use, expand:
- MTTD → Mean Time to Detect (MTTD)
- ACID → ACID (Atomicity, Consistency, Isolation, Durability)
- IaC → Infrastructure as Code (IaC)
- FinOps → Cloud Financial Operations (FinOps)

---

### M4 — Move Projects Section Above Certifications
**Impact:** Senior-role scannability | **Effort:** 30 min

For senior roles, project evidence outweighs credential signals. Swap the order in the HTML.

---

### M5 — Add WebSite Schema Block
**Impact:** Sitelinks search eligibility | **Effort:** 15 min

Add a second JSON-LD block alongside the existing ProfilePage schema:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Daniel Cruz Rodrigues – Portfolio",
  "url": "https://danielportfolio.eddesucesso.tech/",
  "author": {
    "@type": "Person",
    "name": "Daniel Cruz Rodrigues"
  }
}
```

---

### M6 — Add preload for Hero Image
**Impact:** LCP improvement | **Effort:** 10 min

```html
<link rel="preload" as="image"
  href="/assets/build/cloud-resume-challenge-cover-C6C1NiWJ.webp"
  type="image/webp" />
```

---

### M7 — Add "Last Updated" Date to Page
**Impact:** Freshness signal, trust | **Effort:** 10 min

Add to the footer or About section: "Last updated: June 2026"

---

## Low Priority

### L1 — Add Profile Photo
**Impact:** E-E-A-T trust, Person rich result eligibility | **Effort:** 1h

A headshot is required for Google's Person rich result image. Add a professional photo to the hero section and update the Person schema `image` property to point to it.

---

### L2 — Add FAQ Section (5-7 Q&A pairs)
**Impact:** Perplexity and Google AI Overview citability | **Effort:** 2-3h

Target questions recruiters actually search. Each answer: 50-80 words, self-contained, one quantified claim.

Example questions:
- "What AWS certifications does Daniel Cruz Rodrigues hold?"
- "What data pipeline scale has Daniel Cruz Rodrigues worked at?"
- "Is Daniel Cruz Rodrigues available for remote work?"
- "What technologies does Daniel Cruz Rodrigues specialise in?"
- "What has Daniel Cruz Rodrigues achieved in data engineering?"

---

### L3 — Add SoftwareSourceCode Schema for Projects
**Impact:** Machine-readable project attribution | **Effort:** 30 min

```json
{
  "@type": "SoftwareSourceCode",
  "name": "Cloud Resume Challenge",
  "description": "Serverless portfolio with visitor counter using AWS Lambda, DynamoDB, API Gateway, and Terraform IaC",
  "programmingLanguage": ["Python", "Terraform", "JavaScript"],
  "codeRepository": "https://github.com/EddesucessoCloud/",
  "author": { "@type": "Person", "name": "Daniel Cruz Rodrigues" }
}
```

---

### L4 — Off-Page: YouTube Video + Reddit Posts
**Impact:** ChatGPT/Perplexity citation frequency | **Effort:** 3-5h

One YouTube video (5-10 min architecture walkthrough, Databricks demo, or Cloud Resume Challenge explanation) + 2-3 genuine posts in r/dataengineering or r/aws referencing the portfolio URL. YouTube presence has ~0.737 empirical correlation with AI citation frequency — the highest off-page GEO signal available.

---

### L5 — Suppress Server Header / Tighten robots.txt for Training Crawlers
**Impact:** Infrastructure disclosure, training opt-out | **Effort:** 30 min

- `Server: AmazonS3` is exposed in response headers. This is an AWS CloudFront limitation; a custom response header can partially mask it.
- Add explicit `Disallow` for `CCBot` and `anthropic-ai` if training opt-out is desired (see H1 robots.txt snippet).

---

## Implementation Roadmap

| Week | Actions | Score Impact |
|---|---|---|
| Week 1 | C1 (security headers), C2 (PDF CTA), C3 (DOM duplicates), H2 (meta desc), H3 (og:url) | +8 pts |
| Week 1 | H1 (llms.txt), H4 (schema enrichment), H5 (prose About) | +10 pts |
| Week 2 | H6 (sitemap), M1 (availability), M2 (headings), M3 (acronyms), M4 (section order), M5 (WebSite schema) | +5 pts |
| Week 3 | M6 (preload), M7 (last updated), L1 (profile photo), L2 (FAQ) | +3 pts |
| Month 2 | L3 (SoftwareSourceCode), L4 (YouTube + Reddit) | +5 pts (GEO) |
| **Target** | | **~85/100** |

---

*Action Plan generated: 2026-06-05*
*Based on: FULL-AUDIT-REPORT.md (claude-seo:seo-audit, multi-agent)*
