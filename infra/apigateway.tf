# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "visitor_count_log_group"
  retention_in_days = 30
}

# API Gateway API
resource "aws_apigatewayv2_api" "lambda" {
  name          = "visitor_count_CRC"
  protocol_type = "HTTP"
  description   = "Visitor count for Cloud Resume Challenge"
  cors_configuration {
    allow_origins = ["https://danielportfolio.eddesucesso.tech"]
  }
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }

  tags = local.tags
}

# API Gateway Integration
resource "aws_apigatewayv2_integration" "terraform_lambda_func" {
  api_id             = aws_apigatewayv2_api.lambda.id
  integration_uri    = aws_lambda_function.terraform_lambda_func.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

# API Gateway Route
resource "aws_apigatewayv2_route" "terraform_lambda_func" {
  api_id    = aws_apigatewayv2_api.lambda.id
  route_key = "ANY /terraform_lambda_func"
  target    = "integrations/${aws_apigatewayv2_integration.terraform_lambda_func.id}"
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.terraform_lambda_func.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}