# GUIDE — Starter Files

## Requirements

-   Node.js **v17.9.0**
-   NPM to install the project’s dependencies
-   Mysql 8

## Setup and Run

```bash
# install dependencies
npm i

# create your .env file from .env.example and fill info
cp .env.example .env

# Create Database (manual creation)
    + charset: utf8mb
    + collate: utf8mb_general_ci

# start app with dev
npm start

# deploy
npm build
npm serve

```

## Sequenlize cli (https://sequelize.org/master/manual/migrations.html)

```bash

# init model and migrate
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

# running migrations
npx sequelize-cli db:migrate

# create migration
npx sequelize-cli migration:generate --name=create-user-referral-table

# Undoing migrations
The most recent: sequelize-cli db:migrate:undo
A specific: sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
All: sequelize-cli db:migrate:undo:all

# Creating the first Seed
sequelize-cli seed:generate --name demo-user

# Running Seeds
sequelize-cli db:seed:all
or
sequelize-cli db:seed:undo --seed name-of-seed-as-in-data.js

# Undoing Seeds
The most recent: sequelize-cli db:seed:undo
A specific: sequelize-cli db:seed:undo --seed name-of-seed-as-in-data
All: sequelize-cli db:seed:undo:all
```
