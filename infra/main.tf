# main.tf
# Entry point for the Cloud Resume Challenge Terraform setup.
# Resources are organized into:
# - providers.tf: provider setup
# - lambda.tf: Lambda function and packaging
# - dynamodb.tf: DynamoDB table and item
# - iam.tf: IAM roles and policies
# - apigateway.tf: API Gateway setup