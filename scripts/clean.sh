#!/bin/bash

LAMBDA_FUNCTION_NAMES_FILE="./lambda_functions"
FRONTEND_DIRECTORY="footprints-web"

function clean_lambda() {
    target=$1
    prev_directory=`pwd`

    echo "target=\"${target}\""
    cd ${target}
    rm -r ./target/cdk/release
    cd ${prev_directory}
}

function clean_frontend() {
    target=$1
    prev_directory=`pwd`

    echo "target=\"${target}\""
    # todo ...
}

while read name; do
    test -e ${name} && \
        clean_lambda ${name} || \
        echo "target=${name} not found."
done < ${LAMBDA_FUNCTION_NAMES_FILE}

# todo .env
clean_frontend ${FRONTEND_DIRECTORY}
