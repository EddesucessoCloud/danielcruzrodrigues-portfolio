import {
  to = aws_acm_certificate.cert
  id = "arn:aws:acm:us-east-1:211125482456:certificate/279d028a-2f4f-4071-a256-e89e5b1ef519"
}

import {
  to = aws_cloudwatch_log_group.api_gw
  id = "visitor_count_log_group"
}

import {
  to = aws_iam_policy.iam_policy_for_lambda
  id = "arn:aws:iam::211125482456:policy/aws_iam_policy_for_terraform_lambda_func_role"
}

import {
  to = aws_iam_role.lambda_role
  id = "terraform_lambda_func_Role"
}

import {
  to = aws_dynamodb_table.visitor_count_ddb
  id = "visitor_count_ddb"
}

import {
  to = aws_lambda_function.terraform_lambda_func
  id = "terraform_lambda_func"
}

import {
  to = aws_cloudfront_origin_access_control.oac
  id = "E6WLMVVOZXIPH"
}

import {
  to = aws_lambda_permission.api_gw
  id = "terraform_lambda_func/AllowExecutionFromAPIGateway"
}

import {
  to = aws_cloudfront_response_headers_policy.security_headers
  id = "8999a1be-6ece-4a05-8c4d-f8798e782782"
}