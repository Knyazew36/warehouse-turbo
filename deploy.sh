#!/bin/bash
set -e
{

    git pull
    yarn
    chmod +x apps/server/deploy.sh
    chmod +x apps/frontend/deploy.sh
    yarn deploy
    pm2 restart all

 
}
