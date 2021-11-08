#!/bin/bash

ROOT=$(pwd)

cd ./sample-lambda-func

rm -r ./target/cdk/release || echo '[build:clean] No existing release found.'

cd ${ROOT}
