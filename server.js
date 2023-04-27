const express = require('express');
const fs = require('fs');
const { Pool } = require('pg');
const { createTable, processEvents } = require('./data_processor');

const app = express();
const port = 8000;

// Create a connection pool to the Postgres database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finonex',
  password: 'jhAa1988!',
  port: 5432,
});

// Read the SQL script file and execute it to create the table
createTable(pool);

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to authenticate client calls
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader === 'secret') {
    next();
  } else {
    res.sendStatus(401);
  }
};

// Endpoint to save events to a file
app.post('/liveEvent', authenticate, (req, res) => {
    const event = req.body;
    const formattedEvent = JSON.stringify(event, null, 2) + '\n';
    fs.appendFileSync('events.jsonl', formattedEvent);
    processEvents(pool); // Process the event immediately after saving
    res.status(200).json({
      message: 'Event saved successfully',
      event,
    });
  });


// Endpoint to process events
app.post('/process-events', authenticate, (req, res) => {
  const events = fs.readFileSync('events.jsonl', 'utf-8').split('\n');
  const processingResult = processEvents(pool, events);
  res.status(200).json(processingResult);
});

// Endpoint to get user events from the database
app.get('/userEvents/:userid', authenticate, (req, res) => {
  const userId = req.params.userid;

  const query = 'SELECT * FROM users_revenue WHERE user_id = $1';
  const values = [userId];

  pool.query(query, values)
    .then((result) => {
      const userEvents = result.rows;
      res.json(userEvents);
    })
    .catch((error) => {
      console.error('Error fetching user events:', error);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
