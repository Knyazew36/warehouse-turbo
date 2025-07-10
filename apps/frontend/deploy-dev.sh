#!/bin/bash
set -e
{
    git pull
    yarn
    # yarn dev
    pm2 restart all
 
}
