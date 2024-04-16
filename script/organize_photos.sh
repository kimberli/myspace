#!/bin/bash

ROOT_DIR=$(git rev-parse --show-toplevel)
DIRECTORY="${ROOT_DIR}/photos"

function error() {
  local message="$*"
  echo -e "\033[31m${message}\033[0m" >&2
}

function warn() {
  local message="$*"
  echo -e "\033[33m${message}\033[0m" >&2
}

function info() {
  local message="$*"
  echo -e "\033[34m${message}\033[0m"
}

function ok() {
  local message="$*"
  echo -e "\033[32m${message}\033[0m"
}

total_count=0

function rename_file() {
  local file="$1"
  local original_date=$(exiftool -j "$file" | jq -r '.[0].DateTimeOriginal')

  if [[ -n "$original_date" ]]; then
    local safe_date=$(echo "$original_date" | tr -dc '[:alnum:]_.-')
    local new_filename="${safe_date}.$(echo "$file" | rev | cut -d'.' -f1 | rev)"

    # Do nothing if the file is already named properly.
    if [ "$file" == "$DIRECTORY/$new_filename" ]; then
      return 0
    fi

    # Handle any filename collisions.
    if [ -f "$DIRECTORY/$new_filename" ]; then
      new_filename="${new_filename}_1"
    fi

    mv "$file" "$DIRECTORY/$new_filename"
    return 0
  else
    warn "Could not extract date from $file"
    return 1
  fi
}

function process_files() {
  local processing_function="$1"
  local success_count=0
  local failure_count=0

  info "Applying $processing_function..."

  for file in "${DIRECTORY}"/*; do
    result=$("$processing_function" "$file")
    if [[ $result -eq 0 ]]; then
      ((success_count++))
    else
      ((failure_count++))
    fi
  done

  ok "Finished processing ${success_count} files."
  
  if [[ $failure_count -ne 0 ]]; then
    error "${failure_count} failed to process."
  fi
}

for file in "${DIRECTORY}"/*; do
  ((total_count++))
done

info "Processing ${total_count} files..."

# Step 1: Rename the files according to their date taken.
process_files "rename_file"
