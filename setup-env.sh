#!/bin/bash

# Setup Environment Variables Script
echo "Setting up environment variables for React frontend..."

# Create .env files from templates
echo "Creating .env files from templates..."

if [ ! -f .env ]; then
    echo "Creating .env for local development..."
    cp env.template .env
    echo "✓ Created .env"
else
    echo "⚠ .env already exists, skipping..."
fi

if [ ! -f .env.local ]; then
    echo "Creating .env.local for local overrides..."
    cp env.local.template .env.local
    echo "✓ Created .env.local"
else
    echo "⚠ .env.local already exists, skipping..."
fi

if [ ! -f .env.production ]; then
    echo "Creating .env.production for production builds..."
    cp env.production.template .env.production
    echo "✓ Created .env.production"
    echo "⚠ Remember to update REACT_APP_API_URL in .env.production with your actual backend URL!"
else
    echo "⚠ .env.production already exists, skipping..."
fi

echo ""
echo "Environment files created successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env files to match your configuration"
echo "2. Update backend URL in .env.production before deployment" 
echo "3. Never commit .env files to git (they're already ignored)"
echo ""
echo "Available environment variables:"
echo "- REACT_APP_API_URL: Backend API URL"
echo "- REACT_APP_ENV: Environment name"
echo "- REACT_APP_API_TIMEOUT: API request timeout"
echo "- REACT_APP_ENABLE_3D_MODEL: Enable/disable 3D model"
echo "- REACT_APP_ENABLE_DEBUG_MODE: Enable debug logging"
echo "- PORT: Development server port"
echo "- GENERATE_SOURCEMAP: Include source maps in build"
