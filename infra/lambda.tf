# Archive Python code into a zip file
data "archive_file" "zip_the_python_code" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/"
  output_path = "${path.module}/lambda/lambda_function.zip"
}

# Lambda Function
resource "aws_lambda_function" "terraform_lambda_func" {
  filename      = "${path.module}/lambda/lambda_function.zip"
  function_name = "terraform_lambda_func"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.8"
  depends_on    = [aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role]
  environment {
    variables = {
      databaseName = "visitor_count_ddb"
    }
  }
  tags = local.tags
}