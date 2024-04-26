# Event Booking API

## Description

This project is an API for an event booking system. It allows users to create events, book events, and view events. The API is built using Node.js, Express, and MySQL.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Node.js version 14.17.1, which can be downloaded from [Node.js](https://nodejs.org/dist/v14.17.1/). This version is necessary to ensure compatibility with the project setup.
- You have a Windows/Linux/Mac machine.
- You have Docker installed, if you wish to run the project using Docker.
- You have MySQL installed, if you wish to run the project without Docker.

## Installation

### Running the project using Docker
- Clone the repository.
- Navigate to the project directory.
- Update docker-compose.yml file with the necessary environment variables.
- Run the following command to start the project using Docker Compose:
    ```
    docker-compose up
    ```
    This will build and start the containers defined in the `docker-compose.yml` file.

- Once the containers are up and running, you can access the API at `http://localhost:8000`.

- To stop the containers, you can run the following command:
    ```
    docker-compose down
    ```

- If you faced any issues with the Docker setup, you can run the project without Docker by following the steps below. 

### Running the project without Docker
- Clone the repository.
- Navigate to the project directory.
- Run the following command to install the project dependencies:
    ```
    npm install
    ```
- Create a `.env` file in the project root directory, you can use the `.env.example` file as a template.
- Update the `.env` file with the necessary environment variables.


- Then, you can use the following command to start the project in development mode:
    ```
    npm run dev
    ```
    This will start the server at `http://localhost:8000`.

Or, you can follow the steps below to start the project in production mode:
- Run the following command to build the project:
    ```
    npm run build
    ```
- Run the following command to start the project in production mode:
    ```
    npm start
    ```
    This will start the server at `http://localhost:8000`.

## API Documentation
This project uses swagger documentation, so when the project is running, you can access the API documentation at `http://localhost:8000/api-docs`.


## Further Explanation
- The project uses a MySQL database to store data. You don't need to create the database manually, as the project will create the necessary tables when it starts.
- The project uses TypeORM as an ORM to facilitate interaction with the database.
- The project doesn't need seed data to be up, you can start by using the create user endpoint to create a user and go on.




