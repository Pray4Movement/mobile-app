#!/bin/bash

# Build script for Doxa variant
# This script copies Doxa branding assets and builds the app with doxa flavor

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "Building Doxa variant..."

# Build with Flutter
# You can modify this command to build for different platforms:
# - flutter build apk --dart-define=APP_VARIANT=doxa --flavor doxa
# - flutter build appbundle --dart-define=APP_VARIANT=doxa --flavor doxa
# - flutter build ios --dart-define=APP_VARIANT=doxa --flavor doxa

BUILD_TYPE=${1:-apk}

case "$BUILD_TYPE" in
    apk)
        # Copy Flutter assets only (Android uses flavor folders)
        "$SCRIPT_DIR/copy_branding.sh" doxa flutter
        flutter build apk --dart-define=APP_VARIANT=doxa --flavor doxa
        ;;
    appbundle)
        # Copy Flutter assets only (Android uses flavor folders)
        "$SCRIPT_DIR/copy_branding.sh" doxa flutter
        flutter build appbundle --dart-define=APP_VARIANT=doxa --flavor doxa
        ;;
    ios)
        # Copy both Flutter and iOS assets
        "$SCRIPT_DIR/copy_branding.sh" doxa all
        flutter build ios --dart-define=APP_VARIANT=doxa --flavor doxa
        ;;
    *)
        echo "Unknown build type: $BUILD_TYPE"
        echo "Usage: ./scripts/build_doxa.sh [apk|appbundle|ios]"
        exit 1
        ;;
esac

echo "Doxa build completed."

