# Shopify Backend Challenge Spring 2021

## Documentation / Sample Responses

Documentation and demo can be found here: https://documenter.getpostman.com/view/10967881/TzRREUjZ

![demo](https://i.imgur.com/vAyrKEB.mp4)

## Pre-requisites to run locally
1. NodeJS (v12.20.0 or above)
2. Yarn (v1.22.4 or above)
3. EveryPixel API key

## Steps to run
1. `git clone <repo>`
2. Save secrets in `.env` file
3. `yarn install`
4. `yarn dev`

## Things to Improve
1. Use a proper-database instead of storing mappings in-memory
2. Host files to S3/imgur instead of storing them locally
3. Added User authentication instead of allowing global CRUD permissions to everyone