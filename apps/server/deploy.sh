#!/bin/bash
set -e
{
    npx prisma generate
    yarn build
}
