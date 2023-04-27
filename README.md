# Client - Server - DB

This assignment requires the creation of a Server that can perform the following tasks:

1. Save events sent from clients and authenticate the POST calls.
2. Process data into a database.
3. Serve the data from the database through HTTP GET calls.

To complete this assignment, follow these steps:

1. Read through the instructions thoroughly to understand the requirements.
2. Install Node.js and Postgres DB on your machine and ensure they are functioning correctly.
3. Begin coding.
4. Prepare the following files for submission:

   a. **server.js**: This JavaScript file contains the code for the server implementation using Node.js.

   b. **client.js**: This JavaScript file contains the code for the client implementation using Node.js.

   c. **create_table.sql**: This file includes the script required to create the necessary database table.

   d. **data_processor.js**: This JavaScript file contains the code for processing events and updating the database.

   e. **README.md**: This file provides instructions for running the application.

   f. **package.json**: This file contains the relevant packages to install.

## The Server

The server will consist of two endpoints:

1. `http://localhost:8000/liveEvent` (HTTP method: POST)

   This endpoint will receive an event from the client and save it to a file. The server will authenticate the client's calls using the 'Authorization' HTTP header. To authenticate the client, retrieve the 'Authorization' header from the request's headers and ensure it matches the word 'secret'. For more information about the 'Authorization' header, refer to this link: [Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)

2. `http://localhost:8000/userEvents/<userid>` (HTTP method: GET)

   This endpoint will return all data for a given user from the database table. Replace `<userid>` in the URL with the actual user ID (e.g., 'abc123'). The data should be returned in JSON format.

   - The server must be implemented in Node.js using the Express.js framework or any other desired framework.

## The Client

The client will send events to the server's 'liveEvent' endpoint. The events will be in JSON format and will include the following fields:

- `userId`: A string representing the user ID (e.g., 'abc123').
- `name`: A string representing the event type. Two supported events are 'add_revenue' and 'subtract_revenue'.
- `value`: An integer representing the value of the event (e.g., 432).

When sending an event from the client to the server, include the secret 'secret' with every call. Add the secret to the 'Authorization' header of the HTTP request.

The client will read the JSON events from a local file named 'events.jsonl'. Each event will be on a separate line in JSONL format. Refer to [JSON Lines](https://jsonlines.org/) for more information about the JSONL format. For example, the file may look like this:

```
{ "userId": "user1", "name": "add_revenue", "value": 98 }
{ "userId": "user1", "name": "subtract_revenue", "value": 72 }
{ "userId": "user2", "name": "add_revenue", "value": 70 }
{ "userId": "user1", "name": "add_revenue", "value": 1 }
{ "userId": "user2", "name": "subtract_revenue", "value": 12 }
```

- The client must be implemented in Node.js. It should read the events from the file and send them to the server.

