# Mood Tip Microservice

This microservice responds with short positive tips based on user mood, using Gemini API or fallback defaults.

## 📌 Overview

- Language: Node.js (ESM)
- Framework: Express.js
- API: Google Gemini (Generative AI)
- Endpoint: /microtips
- Method: POST
- Auth: Bearer token via Authorization header
- Purpose: To return encouraging tips to a client application when a user is feeling sad ("😢")

## 🔐 Authentication

This microservice requires a valid token passed in the Authorization header:

Authorization: Bearer <API_TOKEN>

The expected token is stored in your `.env` file as:

`API_TOKEN=your_secure_token_here`

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
curl -X POST http://localhost:3000/microtips \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_API_TOKEN" \
 -d '{"user_id": "abc123", "mood": "😢"}'
```

Example JavaScript call:

```js
import dotenv from "dotenv";

dotenv.config();
const bearerToken = process.env.BEARER_TOKEN;

fetch("http://localhost:3000/microtips", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${bearerToken}`,
  },
  body: JSON.stringify({
    user_id: "12345",
    mood: ":cry:",
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

Client -> Microservice: POST /microtips with user_id and mood
Microservice -> Gemini API (optional): Request list of tips
Microservice -> Client: Return JSON response with tip (or 204)

## 🧪 Test

Use the provided curl example above or a simple test script to demonstrate that the endpoint works and returns a response. Ensure your .env file contains the proper API token and Gemini key.

## 🧯 Integration Mitigation Plan

- Teammate using this: Ricardo
- Bearer Token and Gemini API key have been shared via private channels
- Current status: ✅ Microservice is complete and working
- Access instructions:

  - Make a POST request to: https://api.callumpickard.com/microtips
  - Include an Authorization header and with `Bearer token`
  - Include a Content-Type header with `application/json`
  - Ensure JSON contains user_id field - `string`
  - Ensure JSON contains mood field - `UTF-8 encoded emoji`

- If the microservice does not respond:
  - Check your HTTPS response to check errors
  - Verify the Bearer Token did not fail
  - Contact me via pickardc@oregonstate.edu / canvas

Alternatively Ricardo has been provided access to the Repository and can clone it and run it locally.

This can be done:

- With the use of an .env file containing the Gemini API key:
  - This will refresh the list of responses and continually provide new responses each time the API is called
- Without the use of an .env file containing the Gemini API key:
  - This will cycle through a list of ten provided responses, and will not fail despite not making successful Gemini API calls.

## 📎 Assumptions & Notes

- This microservice currently only responds to the 😢 mood. Future support for other moods can be added easily.
- Responses are randomized but ensure no immediate repetitions.
- Uses fallback tips if Gemini API fails.
