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

## Running the app locally

To run the Leads Generation Dashboard locally, follow these steps:
Clone the project repository:

```bash
git clone https://github.com/svashish305/leads-generation-dashboard
```

Install the required npm packages for both the client and server:

```bash
cd client && npm install
cd ../server && npm install
```

Start the server:

```bash
cd server && npm run dev
```

Start the client:

```bash
cd ../client && npm run dev
```

Access the application in your browser by visiting http://localhost:5173.

To run the tests, use the following commands:

Server tests:

```bash
cd server && npm run test
```

Client tests:

```bash
cd client && npm run test
```

These commands will execute the respective test suites for the server and client applications.
First step is to signup a new account, then it takes to the loggedin user's lead dashboard, where you can confirm the webhook url.
Once that's done, a realtime table row will show on a new lead event.
If webhook url isn't confirmed, then the new leads will be shown in the dashboard upon every reload.
