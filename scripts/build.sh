#!/bin/bash

LAMBDA_FUNCTION_NAMES_FILE="./lambda_functions"
LAMBDA_CROSS_COMPILER="x86_64-unknown-linux-musl-gcc"
LAMBDA_TARGET="x86_64-unknown-linux-musl"
LAMBDA_BUILD_MODE="--release" # or ""
HAS_LAMBDA_CROSS_COMPILER=`which ${LAMBDA_CROSS_COMPILER}`
HAS_LAMBDA_CROSS_COMMAND=`which cross`
LAMBDA_BUILD_COMMAND=""

FRONTEND_SETUP_COMMAND="npm i"
FRONTEND_BUILD_COMMAND="npm run build"
FRONTEND_DIRECTORY="footprints-web"

function build_lambda() {
    target=$1
    prev_directory=`pwd`

    echo "target=\"${target}\""
    cd ${target}
    ${LAMBDA_BUILD_COMMAND} && \
        mkdir -p ./target/cdk/release && \
        zip -j ./target/cdk/release/bootstrap.zip ./target/x86_64-unknown-linux-musl/release/${target}
    cd ${prev_directory}
}

function build_frontend() {
    target=$1
    prev_directory=`pwd`

    echo "target=\"${target}\""
    cd ${target}
    ${FRONTEND_SETUP_COMMAND}
    ${FRONTEND_BUILD_COMMAND}
    cd ${prev_directory}
}

if [ ${HAS_LAMBDA_CROSS_COMPILER} ]; then
    LAMBDA_BUILD_COMMAND="cargo build ${LAMBDA_BUILD_MODE} --target ${LAMBDA_TARGET}"
elif [ ${HAS_LAMBDA_CROSS_COMMAND} ]; then
    LAMBDA_BUILD_COMMAND="cross build ${LAMBDA_BUILD_MODE} --target ${LAMBDA_TARGET}"
else
    echo "Any compiler are not found."
    exit 1
fi

echo "LAMBDA_BUILD_COMMAND=\"${LAMBDA_BUILD_COMMAND}\""

while read name; do
    test -e ${name} && \
        build_lambda ${name} || \
        echo "target=${name} not found."
done < ${LAMBDA_FUNCTION_NAMES_FILE}

# todo .env
build_frontend ${FRONTEND_DIRECTORY}
