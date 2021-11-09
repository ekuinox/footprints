#!/bin/bash

source .env

export COGNITO_PROVIDER_GOOGLE_CLIENT_ID=${COGNITO_PROVIDER_GOOGLE_CLIENT_ID}
export COGNITO_PROVIDER_GOOGLE_CLIENT_SECRET=${COGNITO_PROVIDER_GOOGLE_CLIENT_SECRET}

[[ $CI == 'true' ]] && export CDK_APPROVAL='never' || export CDK_APPROVAL='broadening'; cdk deploy --require-approval $CDK_APPROVAL '*'
