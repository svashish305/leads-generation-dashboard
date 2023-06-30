# Leads Generation Dashboard

This MERN stack app demonstrates a webhook endpoint on server that receives lead and displays it on client.

Backend is deployed on Render [here](https://lead-generation.onrender.com).

Frontend is deployed on Render [here](https://leads-generation-frontend.onrender.com).

## Curl command to submit lead to webhook endpoint

We can use the following curl command to submit a lead to the webhook endpoint.
Webhook endpoint is `https://lead-generation.onrender.com/api/v1/webhook/<userId>` where userId denotes the webhook endpoint for that user.
The token can be found in login/signup api response or in localStorage.

```bash
curl --location --request POST 'https://lead-generation.onrender.com/api/v1/webhook/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4ODA1MTI2OSwiZXhwIjoxNjg4MzEwNDY5fQ.FmEK9IR9MW4A5mvan_nBko_Ce87VmXIZHV1rsGCXBdk' \
--data-raw '{
  "name": "Tony Stark",
  "email": "tony@avengers.com",
  "phone": "+16262223333",
  "otherFields": {
    "address": "Avengers Headquarters",
    "income": "A lot"
  }
}'
```
