#!/bin/bash

ROOT=$(pwd)

cd ./sample-lambda-func
cross build --release --target x86_64-unknown-linux-musl && \
    mkdir -p ./target/cdk/release && \
    zip -j ./target/cdk/release/bootstrap.zip ./target/x86_64-unknown-linux-musl/release/sample-lambda-func

cd ${ROOT}
