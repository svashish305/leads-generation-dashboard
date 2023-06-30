# Leads Generation Dashboard

This MERN stack app demonstrates a webhook endpoint on server that receives lead and displays it on client.

Backend is deployed on Render [here](https://lead-generation.onrender.com).

Frontend is deployed on Render [here](https://leads-generation-frontend.onrender.com).

## Curl command to submit lead to webhook endpoint

We can use the following curl command to submit a lead to the webhook endpoint.
{webhook-url}: Replace this with the actual URL of the webhook endpoint. For example, it would be http://localhost:3000/api/v1/webhook/1 or https://lead-generation.onrender.com/api/v1/webhook/1 where 1 is the user ID.
{jwt-token}: Replace this with the JWT token that grants authorization to send leads to the webhook endpoint. You can obtain the JWT token from the signup or login API responses or from the local storage in the application tab of the browser.

```bash
curl --location --request POST '{webhook-url}' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {jwt-token}' \
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

An example curl request:
  
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
