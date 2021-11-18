#!/bin/bash

LAMBDA_CROSS_COMPILER="x86_64-unknown-linux-musl-gcc"
LAMBDA_TARGET="x86_64-unknown-linux-musl"
LAMBDA_BUILD_MODE="--release" # or ""
HAS_LAMBDA_CROSS_COMPILER=`which ${LAMBDA_CROSS_COMPILER}`
HAS_LAMBDA_CROSS_COMMAND=`which cross`
LAMBDA_BUILD_COMMAND=""
LAMBDA_DIRECTORY="footprints-functions"
LAMBDA_GET_FUNCTION_NAMES="./get_functions.sh"

FRONTEND_SETUP_COMMAND="npm i"
FRONTEND_BUILD_COMMAND="npm run build"
FRONTEND_DIRECTORY="footprints-web"

function build_lambda() {
    target=$1
    prev_directory=`pwd`

    echo "target=\"${target}\""
    cd ${target}
    ${LAMBDA_BUILD_COMMAND}
    mkdir -p ./target/cdk/release
    ${LAMBDA_GET_FUNCTION_NAMES} | while read name; do
        echo ${name}
        zip -j ./target/cdk/release/${name}.zip ./target/x86_64-unknown-linux-musl/release/${name}
    done
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

build_lambda ${LAMBDA_DIRECTORY}

# todo .env
build_frontend ${FRONTEND_DIRECTORY}
