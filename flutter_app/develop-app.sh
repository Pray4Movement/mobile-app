#!/bin/bash

# Development script for running the app with different variants
# Usage: ./develop-app.sh <variant> <platform> [device]
# Variants: doxa, general
# Platforms: android, ios, web, linux, windows, macos
# Device: optional device ID (use 'flutter devices' to list)

VARIANT=$1
PLATFORM=$2
DEVICE=$3

# Validate variant
if [ -z "$VARIANT" ]; then
    echo "Error: Variant not specified"
    echo "Usage: ./develop-app.sh <variant> <platform> [device]"
    echo "Variants: doxa, general"
    echo "Platforms: android, ios, web, linux, windows, macos"
    exit 1
fi

if [ "$VARIANT" != "doxa" ] && [ "$VARIANT" != "general" ]; then
    echo "Error: Invalid variant '$VARIANT'"
    echo "Valid variants: doxa, general"
    exit 1
fi

# Validate platform
if [ -z "$PLATFORM" ]; then
    echo "Error: Platform not specified"
    echo "Usage: ./develop-app.sh <variant> <platform> [device]"
    echo "Platforms: android, ios, web, linux, windows, macos"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

cd "$PROJECT_ROOT" || exit 1

echo "========================================="
echo "Developing $VARIANT variant on $PLATFORM"
echo "========================================="

# Copy branding assets
echo "Copying branding assets..."
"$SCRIPT_DIR/scripts/copy_branding.sh" "$VARIANT" flutter

# Copy iOS assets if building for iOS
if [ "$PLATFORM" = "ios" ]; then
    echo "Copying iOS assets..."
    "$SCRIPT_DIR/scripts/copy_branding.sh" "$VARIANT" ios
fi

# Build Flutter command
FLUTTER_CMD="flutter run --dart-define=APP_VARIANT=$VARIANT --flavor $VARIANT"

# Add device flag only if a specific device is provided
# If no device is specified, Flutter will show an interactive device selector
if [ -n "$DEVICE" ]; then
    FLUTTER_CMD="$FLUTTER_CMD -d $DEVICE"
fi

echo ""
echo "Running: $FLUTTER_CMD"
echo ""

# Execute the command
eval "$FLUTTER_CMD"

