#!/bin/bash

set -eu

CWD=$(realpath "$(dirname "${BASH_SOURCE[0]}")")

cd "$CWD"

git fetch
git merge

yarn

yarn run build

