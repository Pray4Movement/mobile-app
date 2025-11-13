#!/bin/bash

# Copy variant-specific branding assets
# Usage: ./scripts/copy_branding.sh <variant> [platform]
# Variant should be either "doxa" or "general"
# Platform is optional: "flutter", "ios", "android", or "all" (default: all)

VARIANT=$1
PLATFORM=${2:-all}

if [ -z "$VARIANT" ]; then
    echo "Error: Variant not specified"
    echo "Usage: ./scripts/copy_branding.sh <variant> [platform]"
    echo "Variants: doxa, general"
    echo "Platforms: flutter, ios, android, all (default: all)"
    exit 1
fi

if [ "$VARIANT" != "doxa" ] && [ "$VARIANT" != "general" ]; then
    echo "Error: Invalid variant '$VARIANT'"
    echo "Valid variants: doxa, general"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Copy Flutter branding assets
if [ "$PLATFORM" = "flutter" ] || [ "$PLATFORM" = "all" ]; then
    BRANDING_DIR="$PROJECT_ROOT/branding"
    if [ ! -d "$BRANDING_DIR/$VARIANT" ]; then
        echo "Error: Branding directory not found: $BRANDING_DIR/$VARIANT"
        exit 1
    fi
    echo "Copying Flutter branding assets from $VARIANT to current..."
    rm -rf "$BRANDING_DIR/current"
    cp -r "$BRANDING_DIR/$VARIANT" "$BRANDING_DIR/current"
    echo "Flutter branding assets copied successfully."
fi

# Copy iOS assets
if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "all" ]; then
    IOS_ASSETS_DIR="$PROJECT_ROOT/ios/assets"
    IOS_TARGET_DIR="$PROJECT_ROOT/ios/Runner/Assets.xcassets"

    if [ ! -d "$IOS_ASSETS_DIR/$VARIANT" ]; then
        echo "Warning: iOS assets directory not found: $IOS_ASSETS_DIR/$VARIANT"
        echo "Skipping iOS asset copy..."
    else
        echo "Copying iOS assets from $VARIANT..."
        # Backup current assets if they exist
        if [ -d "$IOS_TARGET_DIR" ]; then
            rm -rf "$IOS_TARGET_DIR.backup"
            cp -r "$IOS_TARGET_DIR" "$IOS_TARGET_DIR.backup"
        fi
        # Copy variant-specific assets
        rm -rf "$IOS_TARGET_DIR"
        cp -r "$IOS_ASSETS_DIR/$VARIANT/Assets.xcassets" "$IOS_TARGET_DIR"
        echo "iOS assets copied successfully."
    fi
fi

# Copy Android assets (if needed in future)
if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "all" ]; then
    # Android uses flavor folders, so copying is optional
    # This section can be used if you want to copy from a central location
    echo "Android assets use flavor folders (no copying needed)."
fi

