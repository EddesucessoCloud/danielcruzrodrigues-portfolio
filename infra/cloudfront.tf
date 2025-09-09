
# Bucket S3 (existente)
data "aws_s3_bucket" "website_bucket" {
  bucket = "daniel-resumewebsite"
}

# Criando OAC (Origin Access Control)
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "DanielResumeOAC"
  description                       = "OAC for Daniel's resume website"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "website_distribution" {
  origin {
    domain_name              = data.aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id                = "S3-DanielResumeWebsite"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
    # s3_origin_config {
    # #   origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_control.oac.id}"
    # }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for Daniel's resume website"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-DanielResumeWebsite"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
  aliases = ["danielportfolio.eddesucesso.tech"]


  tags = local.tags
}


resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = data.aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOACReadOnly"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "arn:aws:s3:::${data.aws_s3_bucket.website_bucket.id}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website_distribution.arn
          }
        }
      }
    ]
  })
}
