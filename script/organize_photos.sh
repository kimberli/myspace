#!/bin/bash

ROOT_DIR=$(git rev-parse --show-toplevel)
DIRECTORY="${ROOT_DIR}/photos"
OUTPUT_FILE="${ROOT_DIR}/src/lib/photos.json"

total_count=0
success=0
interactive=0

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

function rename_file() {
  local file="$1"
  local original_date=$(exiftool -j "$file" | jq -r '.[0].DateTimeOriginal')

  if [[ -n "$original_date" ]]; then
    local safe_date=$(echo "$original_date" | tr -dc '[:alnum:]_.-')
    local new_filename="${safe_date}.$(echo "$file" | rev | cut -d'.' -f1 | rev)"

    # Do nothing if the file is already named properly.
    if [ "$file" == "$DIRECTORY/$new_filename" ]; then
      return 1
    fi

    # Handle any filename collisions.
    if [ -f "$DIRECTORY/$new_filename" ]; then
      new_filename="${new_filename}_1"
    fi

    mv "$file" "$DIRECTORY/$new_filename"
    return 0
  else
    warn "Could not extract date from $file"
    return 2
  fi
}

function get_gps_data() {
  local file="$1"
  local filename=$(basename "${file%.*}")


  local latitude=$(jq -r ".[\"${filename}\"].lat // empty" ${OUTPUT_FILE}) 
  local longitude=$(jq -r ".[\"${filename}\"].lng // empty" ${OUTPUT_FILE})

  if [ -n "${latitude}" ] && [ -n "${longitude}" ]; then
    # Data already has been populated for this file.
    return 1
  fi

  # Read GPS data from EXIF metadata.
  # Outputs in the format 12.271307 S or 28.239203 E.
  latitude=$(exiftool -c '%.6f' -j "$file" | jq -r '.[0].GPSLatitude // empty')
  longitude=$(exiftool -c '%.6f' -j "$file" | jq -r '.[0].GPSLongitude // empty')

  if [[ $? -ne 0 ]] || [ -z "${latitude}" ] || [ -z "${longitude}" ]; then
    if [[ "$interactive" == 1 ]]; then
      warn "Invalid GPS data for $filename."
      read -t 5 -n 1 -s -r -p "Press any key to open the file. "
      open "$file"
      echo "Now enter the intended GPS location for this photo."
      while true; do
        read -p "Enter latitude: " latitude
        latitude=$(echo "scale=6; $latitude" | bc | awk '{printf "%.6f\n", $1}')
        read -p "Enter longitude: " longitude
        longitude=$(echo "scale=6; $longitude" | bc | awk '{printf "%.6f\n", $1}')
	read -p "You entered: (${latitude},${longitude}). Is this correct? (y/N) " yn
	if [[ "$yn" == "y" ]] || [[ "$yn" == "Y" ]]; then
          break
	fi
      done
    else
      warn "Invalid GPS data for $filename. Run with -i to populate manually."
      return 2
    fi
  else
    # Convert to positive / negative floating point values.
    local latitude_value=$(echo "$latitude" | grep -oE '^[0-9.]+')
    local latitude_direction=$(echo "$latitude" | grep -oE '[NS]$')

    if [[ "$latitude_direction" == "S" ]]; then
      latitude=$(echo "-$latitude_value" | bc)
    else
      latitude=$(echo "$latitude_value" | bc)
    fi

    local longitude_value=$(echo "$longitude" | grep -oE '^[0-9.]+')
    local longitude_direction=$(echo "$longitude" | grep -oE '[EW]$')

    if [[ "$longitude_direction" == "W" ]]; then
      longitude=$(echo "-$longitude_value" | bc)
    else
      longitude=$(echo "$longitude_value" | bc)
    fi
  fi

  # Write the updated values into the output file.
  jq ". + {\"${filename}\": {lat: ${latitude}, lng: ${longitude}}}" ${OUTPUT_FILE} > tmp.json && mv tmp.json ${OUTPUT_FILE}
  if [[ $? -ne 0 ]]; then
    return 2
  fi

  return 0
}

function process_files() {
  # Processing functions should return 0 if the file was successfully processed,
  # 1 if it was skipped, and any other value if it failed.
  local processing_function="$1"
  local success_count=0
  local failure_count=0
  local skipped_count=0

  info "==== Applying $processing_function ===="

  for file in "${DIRECTORY}"/*; do
    "$processing_function" "$file"
    local result=$?
    if [[ $result -eq 0 ]]; then
      ((success_count++))
    elif [[ $result -eq 1 ]]; then
      ((skipped_count++))
    else
      ((failure_count++))
    fi
  done

  ok "> Finished processing ${success_count} files."
  
  if [[ $skipped_count -ne 0 ]]; then
    echo "> ${skipped_count} skipped processing."
  fi

  if [[ $failure_count -ne 0 ]]; then
    error "> ${failure_count} failed to process."
    success=1
  fi
}

while getopts ':ih' opt; do
  case "$opt" in
    i)
      echo "Running in interactive mode."
      interactive=1
      ;;
    ?|h)
      echo "Usage: $(basename $0) [-i]"
      exit 1
      ;;
  esac
done

if [ ! -f "${OUTPUT_FILE}" ]; then
  echo "{}" > "${OUTPUT_FILE}" 
fi

if ! jq . "${OUTPUT_FILE}" &> /dev/null; then
  error "'${OUTPUT_FILE}' is not valid JSON."
  exit 1
fi

for file in "${DIRECTORY}"/*; do
  ((total_count++))
done

echo "Processing ${total_count} files..."

# Step 1: Rename the files according to their date taken.
process_files "rename_file"

# Step 2: Get the lat/long data, write it to a JSON, and clear it from the EXIF data.
process_files "get_gps_data"
exit $success
