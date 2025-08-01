#!/bin/bash
set -e

echo "🚀 Deploying to PRODUCTION environment..."

{


    echo "📦 Running Prisma migrations for production..."
    yarn prisma:migrate:deploy
    
    echo "🔧 Generating Prisma client for production..."
    yarn prisma:generate:prod
    
    echo "🏗️ Building application..."
    yarn build
    
    echo "✅ Production deployment completed successfully!"
}
