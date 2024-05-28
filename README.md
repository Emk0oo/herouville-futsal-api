# Futsal API

This API is designed for managing a Futsal club's operations, including user authentication, articles management, product management, and payment processing.

You can find in database collection the admin user, here the credentials: 
admin@root.fr	
adminmdp

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Articles](#articles)
  - [Products](#products)
  - [Users](#users)
  - [Payment](#payment)
- [Error Handling](#error-handling)
- [License](#license)

## Features

- **User Authentication**
  - User registration and login
  - Password reset functionality
  - JWT-based authentication
- **Articles Management**
  - CRUD operations for articles
- **Products Management**
  - CRUD operations for products
  - Image upload support
- **Users Management**
  - Update user email and password
  - Delete user accounts (admin only)
- **Shopping Cart**
  - Add, update, and remove items from the cart
- **Payment Integration**
  - Stripe integration for payment processing

## Technologies Used

- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens)
- Multer (for image uploads)
- Stripe (for payment processing)
- dotenv (for environment variables)

## Getting Started

### Prerequisites

- Node.js and npm installed
- MySQL database

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/futsal-api.git
    cd futsal-api
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env.local` file in the root directory and configure your environment variables:

    ```env
    PORT=4000
    DATABASE_HOST=your-database-host
    DATABASE_USER=your-database-user
    DATABASE_PASSWORD=your-database-password
    DATABASE_NAME=your-database-name
    JWT_SECRET=your-jwt-secret
    MAILER_EMAIL=your-email
    MAILER_PASSWORD=your-email-password
    STRIPE_SECRET_KEY=your-stripe-secret-key
    STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-keyù*
    ```

2. Set up your MySQL database and run the provided SQL script to create the necessary tables.

### Running the API

Start the server:

```bash
npm start-api
```

## API Endpoints

### Authentication

- **POST /auth/register**
  - Registers a new user.
- **POST /auth/login**
  - Logs in a user.
- **POST /auth/forgot-password**
  - Sends a password reset email.
- **POST /auth/reset-password/**
  - Resets the user's password using the token.

### Articles

- **GET /article**
  - Retrieves all articles.
- **GET /article/**
  - Retrieves a single article by ID.
- **POST /article**
  - Creates a new article.
- **PUT /article/**
  - Updates an article by ID.
- **DELETE /article/**
  - Deletes an article by ID.

### Products

- **GET /product**
  - Retrieves all products.
- **GET /product/**
  - Retrieves a single product by ID.
- **POST /product**
  - Creates a new product.
- **PUT /product/**
  - Updates a product by ID.
- **DELETE /product/**
  - Deletes a product by ID.

### Users

- **GET /user**
  - Retrieves all users (admin only).
- **GET /user/**
  - Retrieves a single user by ID.
- **PUT /user/email**
  - Updates the user's email.
- **PUT /user/password**
  - Updates the user's password.
- **DELETE /user/**
  - Deletes a user (admin only).

### Payment

- **POST /payment/create-checkout-session**
  - Creates a Stripe checkout session.

## Error Handling

The API uses consistent error handling and returns appropriate HTTP status codes and error messages for different scenarios, such as:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

## License

This project is licensed under the MIT License.
