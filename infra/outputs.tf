output "base_url" {
  description = "Base URL for API Gateway stage."

  value = aws_apigatewayv2_stage.lambda.invoke_url
}
output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution."

  value = aws_cloudfront_distribution.website_distribution.domain_name
}