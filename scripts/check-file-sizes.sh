#!/usr/bin/env sh
set -e

MAX_SIZE=6M

IGNORE_PATHS="
node_modules
.git
.next
out
public/storybook
coverage
build
"

EXCLUSIONS="
"

find_excludes=""
for dir in $IGNORE_PATHS; do
  [ -z "$dir" ] && continue
  find_excludes="$find_excludes ! -path ./$dir/*"
done
for file in $EXCLUSIONS; do
  [ -z "$file" ] && continue
  find_excludes="$find_excludes ! -path ./$file"
done

set -f
FILES=$(find . -type f -size +"$MAX_SIZE" $find_excludes -print)
set +f
if [ -n "$FILES" ]; then
  echo "Files over ${MAX_SIZE}:"
  echo "$FILES"
  exit 1
fi
