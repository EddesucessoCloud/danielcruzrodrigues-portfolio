# main.tf
# Entry point for the Cloud Resume Challenge Terraform setup.
# Resources are organized into:
# - providers.tf: provider setup
# - lambda.tf: Lambda function and packaging
# - dynamodb.tf: DynamoDB table and item
# - iam.tf: IAM roles and policies
# - apigateway.tf: API Gateway setup

terraform {
  backend "s3" {
    bucket         = "daniel-resumewebsite" # substitua pelo seu bucket de state
    key            = "infra/terraform.tfstate" # caminho dentro do bucket
    region         = "us-east-1"                   # região do bucket
    encrypt        = true
  }
}
