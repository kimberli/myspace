#!/bin/bash

ROOT_DIR=$(git rev-parse --show-toplevel)
DIRECTORY="${ROOT_DIR}/photos"
OUTPUT_FILE="${ROOT_DIR}/src/lib/photos.json"

total_count=0
success=0
interactive=0
check=0
files=()

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
  local filename=$(basename "${file%.*}")
  local original_date=$(exiftool -j "$file" | jq -r '.[0].DateTimeOriginal')

  if [[ -n "$original_date" ]]; then
    local safe_date=$(echo "$original_date" | tr -dc '[:alnum:]_.-')
    local new_filename="${safe_date}.$(echo "$file" | rev | cut -d'.' -f1 | rev)"

    if [ "$file" == "$DIRECTORY/$new_filename" ]; then
      # Skip processing if the file is already named properly.
      return 1
    elif [[ "$check" == 1 ]]; then
      warn "$filename does not follow this rule."
    fi

    # Handle any filename collisions.
    if [ -f "$DIRECTORY/$new_filename" ]; then
      new_filename="${new_filename}_1"
    fi

    if [[ "$check" == 0 ]]; then
      mv "$file" "$DIRECTORY/$new_filename"
    fi
    return 0
  else
    warn "Could not extract date from $file"
    return 2
  fi
}

function get_gps_data() {
  local file="$1"
  local filename=$(basename "${file%.*}")

  local saved_latitude=$(jq -r ".[\"${filename}\"].lat // empty" ${OUTPUT_FILE}) 
  local saved_longitude=$(jq -r ".[\"${filename}\"].lng // empty" ${OUTPUT_FILE})

  # Read GPS data from EXIF metadata.
  # Outputs in the format 12.271307 S or 28.239203 E.
  local latitude=$(exiftool -c '%.6f' -j "$file" | jq -r '.[0].GPSLatitude // empty')
  local longitude=$(exiftool -c '%.6f' -j "$file" | jq -r '.[0].GPSLongitude // empty')

  if [[ $? -ne 0 ]]; then
    warn "Error reading GPS data from $file."
    return 2
  fi

  if [ -n "${saved_latitude}" ] && [ -n "${saved_longitude}" ]  && [ -z "${latitude}" ] && [ -z "${longitude}" ]; then
    # Data already has been populated for this file, and the EXIF metadata has been stripped,
    # so processing can be skipped.
    return 1
  elif [[ "$check" == 1 ]]; then
    warn "$filename does not follow this rule."
  fi

  if [ -z "${latitude}" ] || [ -z "${longitude}" ]; then
    # The file is missing GPS data, which can be manually populated in interactive mode.
    if [[ "$check" == 1 ]]; then
      return 2
    elif [[ "$interactive" == 1 ]]; then
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
    # Convert the stored EXIF data to positive / negative floating point values.
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

  if [[ "$check" == 0 ]]; then
    # Write the updated values into the output file.
    jq ". + {\"${filename}\": {lat: ${latitude}, lng: ${longitude}}}" ${OUTPUT_FILE} > tmp.json && mv tmp.json ${OUTPUT_FILE}
    if [[ $? -ne 0 ]]; then
      return 2
    fi
    # Remove the GPS EXIF data from the file.
    exiftool -q -gps:all= "$file"
    if [[ $? -ne 0 ]]; then
      return 2
    fi
  fi

  return 0
}

function compress_file() {
  local file="$1"
  local filename=$(basename "${file%.*}")
  local new_filename="$DIRECTORY/${filename}_small.jpg"

  if [ -f "$new_filename" ]; then
    return 1
  elif [[ "$check" == 1 ]]; then
    warn "$filename does not follow this rule."
  fi

  if [[ "$check" == 0 ]]; then
    convert $file -resize 600x600^ -gravity Center -extent 600x600 $new_filename
    if [[ $? -ne 0 ]]; then
      return 2
    fi
  fi
  return 0
}

function blur_file() {
  local file="$1"
  local filename=$(basename "${file%.*}")

  local saved_blur_data=$(jq -r ".[\"${filename}\"].blur // empty" ${OUTPUT_FILE}) 

  if [ -n "${saved_blur_data}" ]; then
    return 1
  elif [[ "$check" == 1 ]]; then
    warn "$filename does not follow this rule."
  fi

  if [[ "$check" == 0 ]]; then
    convert $file -resize 10x10 -blur 1x1 temp.jpg
    if [[ $? -ne 0 ]]; then
      return 2
    fi
    local encoded=$(cat temp.jpg | base64)
    if [[ $? -ne 0 ]]; then
      return 2
    fi
    jq ".\"${filename}\" |= . + {blur: \"${encoded}\"}" ${OUTPUT_FILE} > tmp.json && mv tmp.json ${OUTPUT_FILE}

    rm temp.jpg
    if [[ $? -ne 0 ]]; then
      return 2
    fi
  fi
  return 0
}

function add_description() {
  local file="$1"
  local filename=$(basename "${file%.*}")

  local saved_description=$(jq -r ".[\"${filename}\"].description // empty" ${OUTPUT_FILE}) 
  local saved_label=$(jq -r ".[\"${filename}\"].label // empty" ${OUTPUT_FILE}) 

  if [ -n "${saved_description}" ] && [ -n "${saved_label}" ]; then
    return 1
  elif [[ "$check" == 1 ]]; then
    warn "$filename does not follow this rule."
  fi

  if [[ "$check" == 0 ]]; then
    read -t 5 -n 1 -s -r -p "Press any key to open ${filename}.jpg. "
    open "$file"
    echo -e "Now enter a short label and the description to display for the file."
    while true; do
      read -p "Enter label: " label
      read -p "Enter description: " description
      echo ""
      echo "You entered:"
      echo "${label}"
      echo "${description}"
      read -p "Is this correct? (y/N) " yn
      if [[ "$yn" == "y" ]] || [[ "$yn" == "Y" ]]; then
        break
      fi
    done
    jq ".\"${filename}\" |= . + {label: \"${label}\", description: \"${description}\"}" ${OUTPUT_FILE} > tmp.json && mv tmp.json ${OUTPUT_FILE}

    if [[ $? -ne 0 ]]; then
      return 2
    fi
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
  readarray -d '' files < <(find ${DIRECTORY} -type f -name "*.jpg" ! -name "*_small.jpg" -print0)

  info "==== $processing_function ===="

  for file in "${files[@]}"; do
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

  if [[ "$check" == 0 ]]; then
    ok "> Finished processing ${success_count} files."
    
    if [[ $skipped_count -ne 0 ]]; then
      echo "> ${skipped_count} skipped processing."
    fi

    if [[ $failure_count -ne 0 ]]; then
      error "> ${failure_count} failed to process."
      success=1
    fi
  else
    if [[ "$skipped_count" == "$total_count" ]]; then
      ok "> All $skipped_count files pass this check."
    else
      error "> $skipped_count/$total_count files pass this check."
      success=1
    fi
  fi
}

while getopts ':cih' opt; do
  case "$opt" in
    c)
      echo "Only checking files, not modifying any."
      check=1
      ;;
    i)
      echo "Running in interactive mode."
      interactive=1
      ;;
    ?|h)
      echo "Usage: $(basename $0) [-i] [-c]"
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

readarray -d '' files < <(find ${DIRECTORY} -type f -name "*.jpg" ! -name "*_small.jpg" -print0)

for file in "${files[@]}"; do
  ((total_count++))
done

echo "Processing ${total_count} files..."

# Step 1: Rename the files according to their date taken.
process_files "rename_file"

# Step 2: Get the lat/long data, write it to a JSON, and clear it from the EXIF data.
process_files "get_gps_data"

# Step 3: Resize to obtain a smaller image.
process_files "compress_file"

# Step 4: Create a tiny version of this image for display while image is loading.
process_files "blur_file"

# Step 5: Ensure all photos have a label and description.
process_files "add_description"

exit $success
