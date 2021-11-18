#!/bin/sh

cargo metadata --no-deps --format-version 1 |
    jq -r '.packages[].targets[] | select( .kind | map(. == "bin") | any ) | .name'
