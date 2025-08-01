#!/bin/bash
set -e

echo "🚀 Deploying to DEVELOPMENT environment..."

{
    echo "📦 Running Prisma migrations for development..."
    yarn prisma:migrate:dev
    
    echo "🔧 Generating Prisma client for development..."
    yarn prisma:generate
    
    echo "🏗️ Building application..."
    yarn build
    
    echo "✅ Development deployment completed successfully!"
}
