const venom = require('venom-bot');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let qrCodeBase64 = '';

// Create WhatsApp session and capture QR code
venom
  .create({
    session: 'session-name',
    catchQR: (base64Qrimg, asciiQR) => {
      qrCodeBase64 = base64Qrimg;
      console.log('QR Received:\n', asciiQR);
    }
  })
  .then((client) => {
    start(client);
  })
  .catch((error) => {
    console.error(error);
  });

// Function to respond to WhatsApp messages
function start(client) {
  client.onMessage(async (message) => {
    if (message.body && message.isGroupMsg === false) {
      await client.sendText(message.from, `Echo: ${message.body}`);
    }
  });
}

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Bot is running on Railway!');
});

// Scan route to display the WhatsApp QR code
app.get('/scan', (req, res) => {
  if (!qrCodeBase64) {
    return res.send('⚠️ QR not generated yet. Please wait a few seconds and refresh.');
  }

  res.send(`
    <html>
      <body>
        <h2>📱 Scan this QR code with WhatsApp:</h2>
        <img src="${qrCodeBase64}" />
      </body>
    </html>
  `);
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
