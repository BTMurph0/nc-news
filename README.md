# Northcoders News API

# Link to hosted version
https://barry-nc-news.onrender.com/api/users

# Summary
This is an API for the purpose of accessing data on articles, topics, article comments and users

# Instructions

To clone this project:
1. Go to the github repo here: https://github.com/BTMurph0/nc-news

2. Click the green Code button and copy the link.

3. Open a terminal and navigate to a directory where you want to clone the project to.

4. Type "git clone <project-link>"


To run this project locally after cloning:

1. Install dependencies: npm install jest and supertest

2. Setup the database by running: npm run setup-dbs

3. Seed the database by running: npm run seed

4. Run tests by running: npm test

Creating the .env files:

1. Using .env-example as a template, in the root folder create a file called .env.test then another called .env.development.

2. Edit the files so they contain the database names - the database names can be found in the /db/setup.sql file.

3. Make sure the env files are ignored by adding their filenames to the .gitignore file.

# Versions
Requires min Node version of 10.2.4 and Posgres 15.5
