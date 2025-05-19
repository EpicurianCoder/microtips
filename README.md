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

The expected token is stored in your .env file as:

API_TOKEN=your_secure_token_here

## 📬 How to REQUEST Data

Make a POST request to the /microtips endpoint with the following JSON body:

{
"user_id": "abc123",
"mood": "😢"
}

Example curl call:

curl -X POST http://localhost:3000/microtips \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_API_TOKEN" \
 -d '{"user_id": "abc123", "mood": "😢"}'

## 📥 How to RECEIVE Data

If mood is "😢", the response will contain a positive tip:

{
"user_id": "abc123",
"timestamp": "2025-05-19T23:32:00.123Z",
"tip": "Take a 10-minute walk and notice five things you see."
}

If mood is anything else, the service will respond with HTTP 204 No Content and an empty body.

## 📈 UML Sequence Diagram

Client -> Microservice: POST /microtips with user_id and mood
Microservice -> Gemini API (optional): Request list of tips
Microservice -> Client: Return JSON response with tip (or 204)

## 🧪 Test

Use the provided curl example above or a simple test script to demonstrate that the endpoint works and returns a response. Ensure your .env file contains the proper API token and Gemini key.

## 🧯 Integration Mitigation Plan

- Teammate using this: Ricardo
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

## 📎 Assumptions & Notes

- This microservice currently only responds to the 😢 mood. Future support for other moods can be added easily.
- Responses are randomized but ensure no immediate repetitions.
- Uses fallback tips if Gemini API fails.
