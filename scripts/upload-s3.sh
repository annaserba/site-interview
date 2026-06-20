#!/usr/bin/env sh
set -eu

: "${S3_ACCESS_KEY:?Укажите S3_ACCESS_KEY}"
: "${S3_SECRET_KEY:?Укажите S3_SECRET_KEY}"

S3_ENDPOINT="${S3_ENDPOINT:-https://s3.twcstorage.ru}"
S3_BUCKET="${S3_BUCKET:-5f60ae52-8657-407e-a83b-00b9cae4a175}"
S3_REGION="${S3_REGION:-ru-1}"
CACHE_CONTROL="public, max-age=300, stale-while-revalidate=86400"

upload_file() {
  file_name="$1"
  curl \
    --fail-with-body \
    --silent \
    --show-error \
    --aws-sigv4 "aws:amz:${S3_REGION}:s3" \
    --user "${S3_ACCESS_KEY}:${S3_SECRET_KEY}" \
    --request PUT \
    --header "Content-Type: application/json; charset=utf-8" \
    --header "Cache-Control: ${CACHE_CONTROL}" \
    --header "x-amz-acl: public-read" \
    --upload-file "public/data/${file_name}" \
    "${S3_ENDPOINT}/${S3_BUCKET}/data/${file_name}"
}

upload_file questions.json
upload_file questions-index.json

echo "S3: questions.json и questions-index.json обновлены"
