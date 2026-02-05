# Nexus Backend API

**Technical Documentation**

---

## Overview

Nexus is a competitive coding platform backend built with Node.js and Express. It provides a gamified learning experience through XP-based progression, levels, and coding challenges. The system evaluates code submissions, tracks user progress, and manages a level-based problem hierarchy.

**Tech Stack:** Node.js, Express v5, MongoDB, Mongoose, JWT Authentication, Bcrypt

**Key Features:**

- User authentication with JWT and cookies
- XP system with transaction history
- Progressive level unlocking
- Code submission evaluation supporting C++/Java/Python/JavaScript
- Secure password hashing

---

## API Endpoints

### Authentication API - `/api/auth`

| Method   | Endpoint             | Description                                      | Auth      | Returns                     |
| -------- | -------------------- | ------------------------------------------------ | --------- | --------------------------- |
| **POST** | `/api/auth/register` | Register new user with username, email, password | Public    | User object with JWT cookie |
| **POST** | `/api/auth/login`    | Authenticate user and set JWT cookie             | Public    | User data with auth token   |
| **POST** | `/api/auth/logout`   | Clear authentication cookie                      | Protected | Success message             |

**Request Body (register):**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Request Body (login):**

```json
{
  "email": "string",
  "password": "string"
}
```

---

### Levels API - `/api/levels`

| Method  | Endpoint                   | Description                             | Auth      | Returns                    |
| ------- | -------------------------- | --------------------------------------- | --------- | -------------------------- |
| **GET** | `/api/levels`              | Get all available levels                | Protected | Array of level objects     |
| **GET** | `/api/levels/:levelNumber` | Get specific level details and problems | Protected | Level object with problems |

**Level Response:**

```json
{
  "levelNumber": "number",
  "name": "string",
  "requiredXP": "number",
  "problems": ["Problem"],
  "isUnlocked": "boolean"
}
```

---

### Submissions API - `/api/submissions`

| Method   | Endpoint                         | Description                         | Auth      | Returns                        |
| -------- | -------------------------------- | ----------------------------------- | --------- | ------------------------------ |
| **POST** | `/api/submissions`               | Submit code solution for evaluation | Protected | Submission object with status  |
| **GET**  | `/api/submissions/:submissionId` | Get submission result and details   | Protected | Submission with runtime/memory |

**Submit Request:**

```json
{
  "problemId": "ObjectId",
  "levelNumber": "number",
  "language": "cpp|java|python|javascript",
  "code": "string"
}
```

**Status Values:**

- `PENDING` - evaluating
- `ACCEPTED` - passed all tests
- `WRONG_ANSWER` - failed tests
- `ERROR` - runtime error

---

### Experience Points API - `/api/xp`

| Method  | Endpoint          | Description                       | Auth      | Returns                  |
| ------- | ----------------- | --------------------------------- | --------- | ------------------------ |
| **GET** | `/api/xp/history` | Get user's XP transaction history | Protected | Array of XP transactions |

**XP Transaction:**

```json
{
  "amount": "number",
  "reason": "string",
  "submissionId": "ObjectId",
  "createdAt": "Date"
}
```

XP is automatically awarded on successful submissions and updates user's totalXP and level progression.

---

## Data Models

### User

Stores user accounts and progression tracking.

| Field             | Type            | Description                     | Constraints      |
| ----------------- | --------------- | ------------------------------- | ---------------- |
| `username`        | String          | Unique username, trimmed        | Required, Unique |
| `email`           | String          | Lowercase email address         | Required, Unique |
| `passwordHash`    | String          | Bcrypt hashed password          | Required         |
| `totalXP`         | Number          | Accumulated experience points   | Default: 0       |
| `currentLevel`    | Number          | Current unlocked level          | Default: 1       |
| `completedLevels` | Array\<Number\> | List of completed level numbers | Default: []      |
| `timestamps`      | Date            | createdAt, updatedAt            | Auto-generated   |

---

### Problem

Defines coding challenges with test cases and difficulty ratings.

| Field         | Type            | Description                      | Constraints    |
| ------------- | --------------- | -------------------------------- | -------------- |
| `title`       | String          | Problem title                    | Required       |
| `description` | String          | Full problem description         | Required       |
| `difficulty`  | String          | Easy, Medium, or Hard            | Required, Enum |
| `tags`        | Array\<String\> | Topic tags (arrays, strings, DP) | Optional       |
| `constraints` | String          | Input constraints and limits     | Optional       |
| `examples`    | Array\<Object\> | Sample input/output/explanation  | Optional       |
| `testCases`   | Array\<Object\> | input, expectedOutput, isHidden  | Required       |
| `levelNumber` | Number          | Associated level                 | Required       |

**Test Case Structure:**

```json
{
  "input": "string",
  "expectedOutput": "string",
  "isHidden": "boolean"
}
```

---

### Submission

Records user code submissions with evaluation results.

| Field         | Type     | Description                         | Constraints      |
| ------------- | -------- | ----------------------------------- | ---------------- |
| `userId`      | ObjectId | Reference to User                   | Required         |
| `problemId`   | ObjectId | Reference to Problem                | Required         |
| `levelNumber` | Number   | Level context                       | Required         |
| `language`    | String   | cpp, java, python, javascript       | Required, Enum   |
| `code`        | String   | User submitted code                 | Required         |
| `status`      | String   | PENDING/ACCEPTED/WRONG_ANSWER/ERROR | Default: PENDING |
| `runtime`     | String   | Execution time                      | Nullable         |
| `memory`      | String   | Memory usage                        | Nullable         |

---

### Level

Defines progression tiers and XP requirements.

| Field         | Type   | Description                 | Constraints      |
| ------------- | ------ | --------------------------- | ---------------- |
| `levelNumber` | Number | Sequential level identifier | Required, Unique |
| `name`        | String | Level name/title            | Required         |
| `requiredXP`  | Number | XP needed to unlock         | Required         |
| `description` | String | Level description           | Optional         |

---

### XPTransaction

Audit log of all XP changes for users.

| Field          | Type     | Description                           | Constraints    |
| -------------- | -------- | ------------------------------------- | -------------- |
| `userId`       | ObjectId | Reference to User                     | Required       |
| `amount`       | Number   | XP points added                       | Required       |
| `reason`       | String   | Description of why XP was awarded     | Required       |
| `submissionId` | ObjectId | Reference to Submission if applicable | Optional       |
| `createdAt`    | Date     | Transaction timestamp                 | Auto-generated |

---

### Match

Tracks competitive coding matches between users.

| Field          | Type              | Description            | Constraints |
| -------------- | ----------------- | ---------------------- | ----------- |
| `participants` | Array\<ObjectId\> | User IDs in match      | Required    |
| `problemId`    | ObjectId          | Problem being solved   | Required    |
| `startTime`    | Date              | Match start timestamp  | Required    |
| `endTime`      | Date              | Match completion time  | Optional    |
| `winnerId`     | ObjectId          | User who won the match | Optional    |
| `results`      | Object            | Match outcome data     | Optional    |

---

## Authentication & Security

### JWT Cookie-Based Authentication

The API uses JWT tokens stored in HTTP-only cookies for stateless authentication. Tokens are generated on login and verified via middleware on protected routes.

- **Token Storage:** JWT stored in secure, HTTP-only cookies
- **Password Security:** Bcrypt hashing with salt rounds before storage
- **Protected Routes:** Middleware validates JWT on all protected endpoints
- **Cookie Parser:** Express cookie-parser middleware extracts tokens from requests

### Protected Route Pattern

All routes except `/api/auth/register` and `/api/auth/login` require authentication. The `requireAuth` middleware extracts the JWT from cookies, verifies it, and attaches the user to the request object. Requests without valid tokens return 401 Unauthorized.

---

## Environment Configuration

Required environment variables for running the backend:

| Variable         | Description                 | Example/Default                     |
| ---------------- | --------------------------- | ----------------------------------- |
| `MONGODB_URI`    | MongoDB connection string   | `mongodb://localhost:27017/nexus`   |
| `JWT_SECRET`     | Secret key for signing JWTs | Required (use strong random string) |
| `JWT_EXPIRES_IN` | Token expiration time       | `7d` (7 days)                       |
| `PORT`           | Server port                 | `3000`                              |
| `NODE_ENV`       | Environment mode            | `development` \| `production`       |

**Example `.env` file:**

```env
MONGODB_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your-super-secret-key-here-min-32-chars
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

---

## Project Structure

The backend follows a modular MVC architecture:

```
backend/
├── src/
│   ├── config/          # Database configuration (db.js)
│   ├── routes/          # Express route definitions for each module
│   ├── controllers/     # Request handlers and response logic
│   ├── services/        # Business logic and data processing
│   ├── models/          # Mongoose schemas and models
│   ├── middleware/      # Authentication and validation middleware
│   └── app.js           # Express app configuration
├── scripts/             # Database seeding scripts
│   ├── seedLevels.js    # Populate levels
│   └── seedProblems.js  # Populate problems
├── index.js             # Application entry point
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables (not in repo)
```

---

## Installation & Setup

### Prerequisites

- Node.js v18+ and npm
- MongoDB v6+ (local or Atlas)
- Git for version control

### Quick Start

**1. Clone repository and install dependencies**

```bash
git clone https://github.com/rohitxcodes/Nexus.git
cd Nexus/backend
npm install
```

**2. Create `.env` file with required variables** (see Environment Configuration)

**3. Seed database with initial data**

```bash
node scripts/seedLevels.js
node scripts/seedProblems.js
```

**4. Start development server**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

---

## Dependencies

| Package         | Version | Purpose                          |
| --------------- | ------- | -------------------------------- |
| `express`       | ^5.2.1  | Web application framework        |
| `mongoose`      | ^9.1.5  | MongoDB object modeling          |
| `jsonwebtoken`  | ^9.0.3  | JWT token generation/validation  |
| `bcryptjs`      | ^3.0.3  | Password hashing                 |
| `cookie-parser` | ^1.4.7  | Parse HTTP cookies               |
| `cors`          | ^2.8.6  | CORS middleware                  |
| `axios`         | ^1.13.4 | HTTP client                      |
| `dotenv`        | ^17.2.3 | Environment variables            |
| `nodemon`       | ^3.1.11 | Dev auto-reload (dev dependency) |

---

## Development Scripts

Available npm scripts in `package.json`:

```bash
npm run dev     # Start development server with nodemon
npm test        # Run tests (to be implemented)
```

---

## Error Handling

### Standard Error Response Format

All API errors return a consistent JSON structure:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

### Common HTTP Status Codes

| Status Code | Meaning               | When Used                         |
| ----------- | --------------------- | --------------------------------- |
| 200         | OK                    | Successful GET/POST/PUT request   |
| 201         | Created               | Resource successfully created     |
| 400         | Bad Request           | Invalid input data or parameters  |
| 401         | Unauthorized          | Missing or invalid authentication |
| 403         | Forbidden             | Insufficient permissions          |
| 404         | Not Found             | Resource doesn't exist            |
| 500         | Internal Server Error | Unexpected server error           |

---

## API Response Examples

### Successful Registration

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "totalXP": 0,
      "currentLevel": 1,
      "completedLevels": []
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Submission Result

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "problemId": "507f1f77bcf86cd799439013",
    "levelNumber": 1,
    "language": "python",
    "status": "ACCEPTED",
    "runtime": "0.45s",
    "memory": "14.2MB",
    "createdAt": "2024-02-05T07:30:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "AUTHENTICATION_REQUIRED",
  "message": "You must be logged in to access this resource"
}
```

---

## Code Evaluation Flow

The submission evaluation process follows these steps:

1. **Submission Received** - User submits code via POST `/api/submissions`
2. **Validation** - Check user authentication, problem exists, language supported
3. **Status Set to PENDING** - Submission saved with PENDING status
4. **Code Execution** - Code runs against test cases in isolated environment
5. **Result Comparison** - Output compared with expected results
6. **Status Update** - Status updated to ACCEPTED/WRONG_ANSWER/ERROR
7. **XP Award** - If ACCEPTED, XP is calculated and awarded to user
8. **Level Check** - User's level progression is evaluated and updated if needed
9. **Response Returned** - Submission result sent back to client

---

## Security Best Practices

### Implemented Security Measures

- **Password Hashing:** All passwords hashed with bcrypt before storage (never stored in plain text)
- **JWT Authentication:** Stateless token-based authentication with expiration
- **HTTP-Only Cookies:** Tokens stored in HTTP-only cookies (not accessible via JavaScript)
- **Input Validation:** All user inputs validated before processing
- **MongoDB Injection Prevention:** Mongoose schema validation prevents injection attacks
- **CORS Configuration:** Properly configured cross-origin resource sharing

### Recommendations for Production

- Use HTTPS for all connections
- Set strong JWT_SECRET (minimum 32 characters, random)
- Configure rate limiting to prevent brute force attacks
- Enable MongoDB authentication
- Use environment-specific configurations
- Implement request logging and monitoring
- Regular security audits and dependency updates

---

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

The project includes tests for:

- Authentication flows (register, login, logout)
- Protected route access control
- Submission processing
- XP calculation and awarding
- Level progression logic

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**

- Verify MongoDB is running: `mongod --version`
- Check MONGODB_URI in `.env` file
- Ensure MongoDB service is started

**JWT Token Invalid**

- Check JWT_SECRET matches between sessions
- Verify token hasn't expired (JWT_EXPIRES_IN)
- Clear cookies and login again

**Port Already in Use**

- Change PORT in `.env` file
- Kill process using port: `lsof -ti:3000 | xargs kill -9`

**Module Not Found**

- Run `npm install` to install dependencies
- Check package.json for correct versions

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Contact & Support

**Repository:** [https://github.com/rohitxcodes/Nexus](https://github.com/rohitxcodes/Nexus)

**Author:** rohitxcodes

---

_Nexus Backend API Documentation v1.0_
