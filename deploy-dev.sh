#!/bin/bash
set -e
{

    git pull
    yarn
    chmod +x apps/server/deploy-dev.sh
    chmod +x apps/frontend/deploy-dev.sh
    cd apps/server && ./deploy-dev.sh
    cd ../frontend && ./deploy-dev.sh
    cd ../..
    pm2 restart 3
    pm2 restart 2

 
}
