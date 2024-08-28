# Personal Budget API

This is a Node.js and Express API for managing a personal budget using Envelope Budgeting principles. The API allows users to create, read, update, and delete budget envelopes, transfer funds between envelopes, and supports user authentication with JWT.

## Features

- Create, read, update, and delete budget envelopes
- Transfer funds between envelopes
- User authentication with JWT
- Validation with Joi for request data
- Centralized error handling with custom error types

## Endpoints

### User Authentication

**Register a New User**

- **POST /auth/register**

  Request body:

  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

  Response:

  ```json
  {
    "message": "User registered successfully",
    "userId": 1
  }
  ```

**Login**

- **POST /auth/login**

  Request body:

  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

  Response:

  ```json
  {
    "message": "Login successful",
    "token": "your_jwt_token"
  }
  ```

### Envelope Management

All envelope-related routes are protected and require a valid JWT token. Include the token in the `Authorization` header as `Bearer <your_jwt_token>`.

**Create Envelope**

- **POST /envelopes**

  Request Body:

  ```json
  {
    "title": "Groceries",
    "budget": 500
  }
  ```

  Response:

  ```json
  {
    "message": "Envelope created successfully",
    "envelope": {
      "id": 1,
      "title": "Groceries",
      "budget": 500
    }
  }
  ```

**Get All Envelopes**

- **GET /envelopes**

  Response:

  ```json
  {
    "envelopes": [
      {
        "id": 1,
        "title": "Groceries",
        "budget": 500
      },
      {
        "id": 2,
        "title": "Dining Out",
        "budget": 200
      }
    ]
  }
  ```

**Get Envelope by ID**

- **GET /envelopes/:id**

  Response:

  ```json
  {
    "id": 1,
    "title": "Groceries",
    "budget": 500
  }
  ```

**Update Envelope**

- **PUT /envelopes/:id**

  Request body:

  ```json
  {
    "title": "Groceries",
    "budget": 600
  }
  ```

  Response:

  ```json
  {
    "message": "Envelope updated successfully",
    "envelope": {
      "id": 1,
      "title": "Groceries",
      "budget": 600
    }
  }
  ```

**Delete Envelope**

- **DELETE /envelopes/:id**

  Response:

  ```json
  {
    "message": "Envelope deleted successfully"
  }
  ```

**Transfer Funds Between Envelopes**

- **POST /envelopes/transfer/:from/:to**

  Request body:

  ```json
  {
    "amount": 100
  }
  ```

  Response:

  ```json
  {
    "message": "Transfer completed successfully",
    "fromEnvelope": {
      "id": 1,
      "title": "Groceries",
      "budget": 400
    },
    "toEnvelope": {
      "id": 2,
      "title": "Dining Out",
      "budget": 300
    }
  }
  ```

## Running the Project

1. **Clone the Repository:**

```bash
git clone https://github.com/makrischaralampos/personal-budget.git
```

2. **Install Dependencies:**

```bash
cd personal-budget
npm install
```

3. **Set Environment Variables:**

Create a `.env` file in the root of your project and add the following:

```bash
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

4. **Start the Server:**

```bash
node server.js
```

The server will run on `http://localhost:3000`.

## Testing

Use Postman or similar tools to test the API endpoints. Make sure to include the JWT token in the `Authorization` header for protected routes.

## License

This project is licensed undet the MIT License - see the [LICENSE](/LICENSE) file for details.
