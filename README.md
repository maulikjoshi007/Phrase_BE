

## Description

This is a Nest.js API project designed to manage phrases and their translations. 

## Getting Started

To run this project locally, follow these steps:

### Clone the repository:

```bash
git clone https://github.com/maulikjoshi007/Phrase_BE
cd Phrase_BE 
```
## Prerequisites -
- Node.js (version 14 or later)
 - PostgreSQL (or any other database you're using) 
 -  npm (Node Package Manager)
 
### Install dependencies:
``` bash 
npm install
``` 

### Set up environment variables:

Create a `.env` file in the root of your project and add the following environment variables:

```
DB_HOST=<your-database-host>
DB_USER=<your-database-user>
DB_PASSWORD=<your-database-password>
DB_NAME=<your-database-name>

# THIS PORT WILL BE USED TO RUN THIS APP
PORT=3000
  
# ONLY THESE ORIGINS WILL BE ALLOWED TO SEND REQUESTS FROM FRONT END
CORS=http://localhost:3001
```
Replace `<your-database-host>` with your database host name, `<your-database-user>` with your database user, `<your-database-password>` with your database password, and `<your-database-name>` with your database name.


### Run the database migrations:
Run the migrations
``` bash
npx knex migrate:latest
```


### Insert the Records in Database:
Run the seed files
``` bash
npx knex seed:run
```

### Run the development server:

``` bash
npm run start
```

Open [http://localhost:3000/](http://localhost:3000/) in your browser to see the API running.

## Environment Variables

Variable : Description


-   `PORT` : The port on which your application will run.
-   `ENVIRONMENT` : Specifies the environment in which the app is running (e.g., local, production).
-   `DB_HOST` : The hostname of the database server.
-   `DB_USER` : The username to connect to the database.
-   `DB_PASSWORD` :  The password for the database user.
-   `DB_NAME` :  The name of the database to connect to.
-   `CORS` :  The allowed origin(s) for CORS requests from the frontend.

### API Endpoints

#### Phrases

-   **GET** `/get-all-phrase` - Retrieve all phrases with pagination, sorting, and optional status filtering
-   **GET** `/phrases/:id` - Retrieve a specific phrase by UUID
-   **GET** `/search` - Searches for phrases containing the provided query string with optional pagination, sorting, and status filtering
-   **GET** `:id/:language` - Fetches the translation of a specific phrase in the specified language

#### Language

-   **GET** `/list` - Retrieve all languages

## Scripts

-   **`npm run start`** - Start the application in development mode.
-   **`npm run test`** - Run unit tests using jest.

## Running Tests

To run the test cases for this project, use the following command

`npm run test` 

