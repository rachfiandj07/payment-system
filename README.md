# Ara Research

## Description

This is a NestJS project built with TypeScript for a Micro Lending Company's Accounts Receivable Management System. It builds backend API services for a micro-lending company's web application, optimizing their accounts receivable management.

## Features

- **NestJS**: A progressive Node.js framework for building server-side applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Prisma**: ORM for database access.
- **BullMQ**: For handling background jobs and queues.
- **Redis**: In-memory data structure store used for caching and queuing.
- **Docker**: For containerizing the application and its dependencies.
- **Swagger**: API documentation available at `/api-docs`.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 18.x or later
- **Docker**: Version 20.x or later
- **NPM**: Version 9.x or later
- **Docker Compose**: Version 1.27.x or later

## Installation

1. **Unzip the folder**

    - Windows

      ```bash
      powershell -command "Expand-Archive -Path 'filename.zip' -DestinationPath 'destination\folder'"
      ```
    - Mac

      ```bash
      unzip filename.zip
      ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Setup environment variables:**

   Create a `.env` file in the root directory and configure your environment variables:

    ```dotenv
    DATABASE_URL=postgres://user:password@localhost:5432/yourdatabase
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```

4. **Run migrations:**

    Apply database migrations using Prisma:

    ```bash
    npm run migrate:start
    ```

5. **Run Docker Compose:**

    To start the project with Docker, run:

    ```bash
    docker-compose up -d
    ```

## Configuration

### Configuration Files

- **`src/config`**: Contains configuration files for various services.
- **`.env`**: Environment variables used by the application.

### Configuration Parameters

- **Database**: Configured via `DATABASE_URL` in the `.env` file.
- **Redis**: Configured via `REDIS_HOST` and `REDIS_PORT` in the `.env` file.

## Usage

1. **Run the application locally:**

    ```bash
    npm run start
    ```

2. **Access the application:**

    Navigate to `http://localhost:3000` in your browser or use tools like `curl` or Postman to interact with your API.

3. **Run the application in development mode:**

    ```bash
    npm run start:dev
    ```

4. **Build the application:**

    ```bash
    npm run build
    ```

5. **Run database migrations:**

    - **Apply migrations:**

      ```bash
      npm run migrate:start
      ```

    - **Reset and reapply all migrations:**

      ```bash
      npm run migrate:reset
      ```

6. **Run tests:**

    ```bash
    npm run test
    ```

## API Documentation

The project uses Swagger for API documentation. You can access the Swagger UI at:

- **URL**: `http://localhost:3000/api-docs`

This provides interactive documentation of all API endpoints, including request parameters, responses, and other details.

## Database Design

- **URL**: `https://dbdiagram.io/d/66c3a6348b4bb5230e84b5c2`

![DB Schema](./assets/db-design.png)

## System Design High Level

![ARA System Design Payment Link](./assets/ARA-System-Design-Payment-Link.png)

## Testing

The project uses Jest for testing. To run tests, use:

```bash
npm run test
