const fs = require('fs');

function createTable(pool) {
  const createTableQuery = fs.readFileSync('create_table.sql', 'utf-8');
  pool
    .query(createTableQuery)
    .then(() => {
      console.log('Table created successfully');
      processEvents(pool);
    })
    .catch((error) => {
      console.error('Error creating table:', error);
    });
}

function processEvents(pool) {
  const events = fs.readFileSync('events.jsonl', 'utf-8').split('\n');
  const processedEvents = [];

  const processEvent = (event) => {
    return new Promise((resolve, reject) => {
      if (event.trim() !== '') {
        try {
          const parsedEvent = JSON.parse(event);
          const { userId, name, value } = parsedEvent;
          const query =
            'INSERT INTO users_revenue (user_id, revenue) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET revenue = users_revenue.revenue + EXCLUDED.revenue';
          const values = [
            userId,
            name === 'add_revenue' ? value : -value,
          ];

          pool
            .query(query, values)
            .then(() => {
              console.log('Event processed:', parsedEvent);
              processedEvents.push(parsedEvent);
              resolve();
            })
            .catch((error) => {
              console.error('Error processing event:', error);
              reject(error);
            });
        } catch (error) {
          console.error('Error parsing event:', error);
          reject(error);
        }
      } else {
        resolve();
      }
    });
  };

  const processNextEvent = (index) => {
    if (index < events.length) {
      processEvent(events[index])
        .then(() => {
          processNextEvent(index + 1);
        })
        .catch((error) => {
          console.error('Error processing event:', error);
          processNextEvent(index + 1);
        });
    }
  };

  processNextEvent(0);

  return processedEvents;
}

module.exports = {
  createTable,
  processEvents,
};
