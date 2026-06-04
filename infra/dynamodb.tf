# DynamoDB Table
resource "aws_dynamodb_table" "visitor_count_ddb" {
  name         = "visitor_count_ddb"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "visitor_count"
    type = "N"
  }

  global_secondary_index {
    name            = "visitor_count_index"
    hash_key        = "visitor_count"
    projection_type = "ALL"
  }

  tags = local.tags
}
