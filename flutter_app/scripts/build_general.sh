#!/bin/bash

# Build script for General variant
# This script copies General branding assets and builds the app with general flavor

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "Building General variant..."

# Build with Flutter
# You can modify this command to build for different platforms:
# - flutter build apk --dart-define=APP_VARIANT=general --flavor general
# - flutter build appbundle --dart-define=APP_VARIANT=general --flavor general
# - flutter build ios --dart-define=APP_VARIANT=general --flavor general

BUILD_TYPE=${1:-apk}

case "$BUILD_TYPE" in
    apk)
        # Copy Flutter assets only (Android uses flavor folders)
        "$SCRIPT_DIR/copy_branding.sh" general flutter
        flutter build apk --dart-define=APP_VARIANT=general --flavor general
        ;;
    appbundle)
        # Copy Flutter assets only (Android uses flavor folders)
        "$SCRIPT_DIR/copy_branding.sh" general flutter
        flutter build appbundle --dart-define=APP_VARIANT=general --flavor general
        ;;
    ios)
        # Copy both Flutter and iOS assets
        "$SCRIPT_DIR/copy_branding.sh" general all
        flutter build ios --dart-define=APP_VARIANT=general --flavor general
        ;;
    *)
        echo "Unknown build type: $BUILD_TYPE"
        echo "Usage: ./scripts/build_general.sh [apk|appbundle|ios]"
        exit 1
        ;;
esac

echo "General build completed."

