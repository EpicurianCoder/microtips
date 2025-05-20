## 🧯 Integration Mitigation Plan

Currently the service is running on a dedicated Linux server (RaspberryPi in my home) and is running a CloudFare tunnel, and is using my personal domain (callumpickard.com). To improve security, this service is using a bearer token.

- Teammate using this: **Ricardo Porras**
- Bearer Token has been shared via private channel
- Current status: Microservice is complete and working ✅

### Access instructions:

- Make a POST request to: https://api.callumpickard.com/microtips

  - Include an Authorization header and with `Bearer token`

  - Include a Content-Type header with `application/json`

  - Ensure JSON contains user_id field - `string`

  - Ensure JSON contains mood field - `UTF-8 encoded emoji`

### If the microservice does not respond:

- Check your HTTPS response for errors

  - Verify the Bearer Token did not fail (401 Response Status)

- Notify me by 05/21/2025 23:59 should the service not function accordingly.

- Contact me via discord / canvas / OSU email

### GitHub Repo

https://github.com/EpicurianCoder/microtips

Alternatively Ricardo has been provided access to the Repository and can clone it and run it locally.

The only major change being that the endpoint would become `localhost:3000/microtips` when running the server locally

This can be cloned and successfully run locally **WITH** and **WITHOUT** the Gemini API key.

- **With** the use of an .env file containing the Gemini API key:

  - Each time half of the list has been used, a call to the Gemini API will refresh the list of responses, ensuring no repetition.

- **Without** the use of an .env file containing the Gemini API key:

  - This will fall back on the hardcoded responses when the call to the Gemini API fails.

Alternatively, another GEMINI API key can be added to the .env file and the calls to the gemini should execute successfully, provided the API key has been set up and enabled.

## 📎 Assumptions & Notes

- This microservice currently only responds to the 😢 mood. Future support for other moods can be added easily.
- Responses are randomized but ensure no immediate repetitions.
- Uses fallback tips if Gemini API fails.
