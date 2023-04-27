const axios = require('axios');
const fs = require('fs');

// Read events from the file
const events = fs.readFileSync('events.jsonl', 'utf-8').split('\n').filter(Boolean);

// Send events to the server for processing
axios.post('http://localhost:8000/process-events', { events })
  .then((response) => {
    const results = response.data;
    console.log('Results:', results);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
