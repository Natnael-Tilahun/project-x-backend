#!/bin/bash

# Check if environment is passed
if [ -z "$1" ]; then
    echo "Usage: $0 [dev|uat|prod]"
    exit 1
fi

ENVIRONMENT="$1"

# Set path based on environment
case "$ENVIRONMENT" in
    dev)
        BUILD_FILE_PATH="/home/natnael-tilahun/Documents/Projectx files/admin/dev"
        ;;
    uat)
        BUILD_FILE_PATH="/home/natnael-tilahun/Documents/Projectx files/admin/uat"
        ;;
    prod)
        BUILD_FILE_PATH="/home/natnael-tilahun/Documents/Projectx files/admin/prod"
        ;;
    *)
        echo "Invalid environment: $ENVIRONMENT"
        echo "Valid options: dev, uat, prod"
        exit 1
        ;;
esac

echo "=== Starting build process for $ENVIRONMENT ==="
npm run generate || { echo "Build failed. Exiting."; exit 1; }

# Move the dist folder to target path
mv dist "$BUILD_FILE_PATH"

# Navigate to project directory
cd "$BUILD_FILE_PATH" || exit

echo "=== Creating projectx folder ==="
mkdir projectx

echo "=== Moving build output ==="
mv dist/* projectx

echo "=== Zipping project ==="
zip -r projectx.zip projectx

echo "✅ Build and zip completed: $BUILD_FILE_PATH/projectx.zip"

echo "=== Cleaning old dist file ==="
rm -rf dist
rm -rf projectx
# rm -f projectx.zip
