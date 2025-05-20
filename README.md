# Mood Tip Microservice

This microservice responds with short positive tips based on user mood, using Gemini API or fallback defaults.

## 📌 Overview

- Language: Node.js
- Framework: Express.js
- Endpoint: /microtips
- Method: POST
- Auth: Bearer token via Authorization header
- Purpose: To return encouraging tips to a client application when a user is feeling sad ("😢")

## 🔐 Authentication

This microservice requires a valid token passed in the Authorization header:

Authorization: Bearer <MICROTIPS_TOKEN>

The expected token is stored in your `.env` file as:

`MICROTIPS_TOKEN=your_secure_token_here`

## 📬 How to REQUEST Data

Make a POST request to the /microtips endpoint with the following JSON body:

```js
{
"user_id": "abc123",
"mood": "😢"
}
```

Example curl call:

```bash
curl -X POST http://api.callumpickard.com/microtips \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer MICROTIPS_TOKEN" \
 -d '{"user_id": "abc123", "mood": "😢"}'
```

Example JavaScript call:

```js
import dotenv from "dotenv";

dotenv.config();
const bearerToken = process.env.MICROTIPS_TOKEN;

fetch("http://api.callumpickard.com/microtips", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${bearerToken}`,
  },
  body: JSON.stringify({
    user_id: "12345",
    mood: "😢",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

## 📥 How to RECEIVE Data

If mood is "😢", the response will contain a positive tip:

```js
{
"user_id": "abc123",
"timestamp": "2025-05-19T23:32:00.123Z",
"tip": "Take a 10-minute walk and notice five things you see."
}
```

## 📡 API Responses

The microservice may return the following HTTP status codes:

| Status Code               | Meaning                  | Description                                                                                     |
| ------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| 200 OK                    | Success                  | A tip is returned in the JSON response body when mood is "😢".                                  |
| 204 No Content            | No tip needed            | The mood provided did not trigger a tip response (e.g., mood is not "😢").                      |
| 400 Bad Request           | Invalid request body     | The request body is missing required fields like `user_id` or `mood`.                           |
| 401 Unauthorized          | Invalid or missing token | The `Authorization` header was missing or did not match the expected value.                     |
| 500 Internal Server Error | Server error             | Unexpected failure occurred while processing the request. Fallback tips will be used if needed. |

## 📈 UML Sequence Diagram

![UML Sequence Diagram](./diagram2.png)

## 🧪 Test

Use the provided curl example above or a simple test script to demonstrate that the endpoint works and returns a response. Ensure your .env file contains the proper API token.
