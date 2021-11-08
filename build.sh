#!/bin/bash

FUNCTION_NAMES_FILE="./lambda_functions"
CROSS_COMPILER="x86_64-unknown-linux-musl-gcc"
TARGET="x86_64-unknown-linux-musl"
BUILD_MODE="--release" # or ""
HAS_CROSS_COMPILER=`which ${CROSS_COMPILER}`
HAS_CROSS_COMMAND=`which cross`
BUILD_COMMAND=""

function build() {
    target=$1
    prev_directory=`pwd`

    echo "target=${target}"
    cd ${target}
    ${BUILD_COMMAND} && \
        mkdir -p ./target/cdk/release && \
        zip -j ./target/cdk/release/bootstrap.zip ./target/x86_64-unknown-linux-musl/release/${target}
    cd ${prev_directory}
}

if [ ${HAS_CROSS_COMPILER} ]; then
    BUILD_COMMAND="cargo build ${BUILD_MODE} --target ${TARGET}"
elif [ ${HAS_CROSS_COMMAND} ]; then
    BUILD_COMMAND="cross build ${BUILD_MODE} --target ${TARGET}"
else
    echo "Any compiler are not found."
    exit 1
fi

echo "BUILD_COMMAND=\"${BUILD_COMMAND}\""

while read name; do
    test -e ${name} && \
        build ${name} || \
        echo "target=${name} not found."
done < ${FUNCTION_NAMES_FILE}
