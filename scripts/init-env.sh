#!/bin/bash

# Cloudformation Outputを取得
exports=$(aws cloudformation list-exports --output json | jq '.Exports')

api_endpoint=$(echo ${exports} \
  | jq 'map(select(.Name == "cognito-example-api-endpoint"))' \
  | jq '.[].Value' -r)
user_pool_id=$(echo ${exports} \
  | jq 'map(select(.Name == "cognito-example-user-pool-id"))' \
  | jq '.[].Value' -r)
user_pool_client_id=$(echo ${exports} \
  | jq 'map(select(.Name == "cognito-example-user-pool-client-id"))' \
  | jq '.[].Value' -r)
user_pool_client_secret=$(aws cognito-idp describe-user-pool-client \
  --user-pool-id "${user_pool_id}" \
  --client-id ${user_pool_client_id} \
  --output json \
  | jq '.UserPoolClient.ClientSecret' -r)
custom_domain=$(echo ${exports} \
  | jq 'map(select(.Name == "cognito-example-custom-domain"))' \
  | jq '.[].Value' -r)
sessions_table_name=$(echo ${exports} \
  | jq 'map(select(.Name == "cognito-example-sessions-table-name"))' \
  | jq '.[].Value' -r)
region=$(aws configure get region)

# .envファイルに環境変数を書き込む
{
  echo "API_ENDPOINT=${api_endpoint}"
  echo "CLIENT_ID=${user_pool_client_id}"
  echo "CLIENT_SECRET=${user_pool_client_secret}"
  echo "CUSTOM_DOMAIN=${custom_domain}"
  echo "SESSIONS_TABLE_NAME=${sessions_table_name}"
  echo "REGION=${region}"
} > .env
