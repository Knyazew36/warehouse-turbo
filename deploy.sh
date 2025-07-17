#!/bin/bash
set -e
{

    git pull
    yarn
    chmod +x apps/server/deploy.sh
    chmod +x apps/frontend/deploy.sh
    cd apps/server && ./deploy.sh
    cd ../frontend && ./deploy.sh
    cd ../..
    pm2 restart all

 
}
