#!/usr/bin/env bash
# One-shot deploy of the careers application mailer.
# Creates (or updates) the IAM role, the Lambda, its Function URL and the SES
# identities, then prints the URL to put in VITE_APPLY_ENDPOINT.
#
# Prereqs: AWS CLI v2 signed in (`aws configure`) as a principal with the rights
# in deployer-policy.json. Run from the repo root:   bash backend/deploy.sh
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
FN="2ms-careers-apply"
ROLE="2ms-careers-apply-role"
SENDER="${SENDER:-careers@2mscorporation.com}"
RECIPIENTS="${RECIPIENTS:-medhaj@2mscorporation.com,megha@2mscorporation.com,pranaya@2mscorporation.com}"
ALLOWED_ORIGIN="${ALLOWED_ORIGIN:-*}"
DOMAIN="${SENDER#*@}"

here="$(cd "$(dirname "$0")" && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

echo "== Region: $REGION"
ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"

# --- IAM role -----------------------------------------------------------------
if ! aws iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  echo "== Creating IAM role $ROLE"
  aws iam create-role --role-name "$ROLE" --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]
  }' >/dev/null
  aws iam attach-role-policy --role-name "$ROLE" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  aws iam put-role-policy --role-name "$ROLE" --policy-name ses-send --policy-document '{
    "Version":"2012-10-17",
    "Statement":[{"Effect":"Allow","Action":["ses:SendEmail","ses:SendRawEmail"],"Resource":"*"}]
  }'
  echo "   waiting for role to propagate..."; sleep 10
fi
ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/${ROLE}"

# --- Lambda -------------------------------------------------------------------
cp "$here/apply-lambda.mjs" "$work/index.mjs"
(cd "$work" && python -c "import zipfile; zipfile.ZipFile('fn.zip','w',zipfile.ZIP_DEFLATED).write('index.mjs')")
ENV="Variables={SENDER=$SENDER,RECIPIENTS=$RECIPIENTS,ALLOWED_ORIGIN=$ALLOWED_ORIGIN}"

if aws lambda get-function --function-name "$FN" --region "$REGION" >/dev/null 2>&1; then
  echo "== Updating Lambda $FN"
  aws lambda update-function-code --function-name "$FN" --region "$REGION" \
    --zip-file "fileb://$work/fn.zip" >/dev/null
  aws lambda wait function-updated --function-name "$FN" --region "$REGION"
  aws lambda update-function-configuration --function-name "$FN" --region "$REGION" \
    --environment "$ENV" --timeout 30 --memory-size 256 >/dev/null
else
  echo "== Creating Lambda $FN"
  aws lambda create-function --function-name "$FN" --region "$REGION" \
    --runtime nodejs20.x --architectures arm64 --handler index.handler \
    --role "$ROLE_ARN" --zip-file "fileb://$work/fn.zip" \
    --timeout 30 --memory-size 256 --environment "$ENV" >/dev/null
fi
aws lambda wait function-active-v2 --function-name "$FN" --region "$REGION"

# --- Function URL (public, CORS) ---------------------------------------------
CORS='{"AllowOrigins":["*"],"AllowMethods":["POST"],"AllowHeaders":["content-type"],"MaxAge":86400}'
if ! aws lambda get-function-url-config --function-name "$FN" --region "$REGION" >/dev/null 2>&1; then
  echo "== Creating Function URL"
  aws lambda create-function-url-config --function-name "$FN" --region "$REGION" \
    --auth-type NONE --cors "$CORS" >/dev/null
  aws lambda add-permission --function-name "$FN" --region "$REGION" \
    --statement-id public-url --action lambda:InvokeFunctionUrl \
    --principal '*' --function-url-auth-type NONE >/dev/null
else
  aws lambda update-function-url-config --function-name "$FN" --region "$REGION" \
    --auth-type NONE --cors "$CORS" >/dev/null
fi
URL="$(aws lambda get-function-url-config --function-name "$FN" --region "$REGION" --query FunctionUrl --output text)"

# --- SES identities -----------------------------------------------------------
echo "== SES identities (region $REGION)"
if ! aws sesv2 get-email-identity --email-identity "$DOMAIN" --region "$REGION" >/dev/null 2>&1; then
  aws sesv2 create-email-identity --email-identity "$DOMAIN" --region "$REGION" >/dev/null
fi
echo "   Domain $DOMAIN: add these DKIM CNAME records to DNS, then SES verifies it automatically:"
aws sesv2 get-email-identity --email-identity "$DOMAIN" --region "$REGION" \
  --query 'DkimAttributes.Tokens[]' --output text | tr '\t' '\n' | \
  sed "s|^\(.*\)$|     \1._domainkey.$DOMAIN  CNAME  \1.dkim.amazonses.com|"

IFS=',' read -ra RCPTS <<< "$RECIPIENTS"
for addr in "${RCPTS[@]}"; do
  if ! aws sesv2 get-email-identity --email-identity "$addr" --region "$REGION" >/dev/null 2>&1; then
    aws sesv2 create-email-identity --email-identity "$addr" --region "$REGION" >/dev/null
    echo "   Verification email sent to $addr (click the link in it)"
  fi
done

cat <<MSG

== Done.
Put this in .env (and in your hosting build env), then rebuild:

VITE_APPLY_ENDPOINT=$URL

While SES is in sandbox mode it only delivers to verified addresses, which is
fine for the three recipients. The sender ($SENDER) must be verified too,
either via the domain DKIM records above or by verifying that address.
MSG
