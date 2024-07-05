// index.js

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/:date_string?', (req, res) => {
  let dateString = req.params.date_string;

  if (!dateString) {
    const now = new Date();
    res.json({ unix: now.getTime(), utc: now.toUTCString() });
  } else {
    let date;
    // Check if the date string is a valid number (timestamp)
    if (!isNaN(dateString)) {
      date = new Date(parseInt(dateString));
    } else {
      date = new Date(dateString);
    }

    if (date.toString() === 'Invalid Date') {
      res.json({ error: 'Invalid Date' });
    } else {
      res.json({ unix: date.getTime(), utc: date.toUTCString() });
    }
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
