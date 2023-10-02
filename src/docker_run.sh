#!/bin/bash
docker build -t fhtlgames-image .
docker run --rm -it --name=fhtlgames -e DOMAIN="https://games.byufamilytech.org" -p 3000:3000 fhtlgames-image
