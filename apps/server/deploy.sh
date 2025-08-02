#!/bin/bash
set -e

echo "🚀 Deploying to PRODUCTION environment..."

{


    echo "📦 Running Prisma migrations for production..."
    yarn prisma:migrate:deploy:production
    
    echo "🔧 Generating Prisma client for production..."
    yarn prisma:generate:production
    
    echo "🏗️ Building application..."
    yarn build
    
    echo "✅ Production deployment completed successfully!"
}
