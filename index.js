const venom = require('venom-bot');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

venom
  .create({
    session: 'session-name',
  })
  .then((client) => {
    start(client);
  })
  .catch((error) => {
    console.error(error);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.body && message.isGroupMsg === false) {
      await client.sendText(message.from, `Echo: ${message.body}`);
    }
  });
}

app.get('/', (req, res) => {
  res.send('WhatsApp Bot is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
