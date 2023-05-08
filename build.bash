#!/bin/bash

set -eu

CWD=$(realpath "$(dirname "${BASH_SOURCE[0]}")")

cd "$CWD"

yarn

yarn run build

