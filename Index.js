const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const express = require("express")
const axios = require("axios")

// ====== EDIT THIS ======
const phoneNumber = "584264513787"   // তোমার WhatsApp নাম্বার (country code সহ)
const TELEGRAM_BOT_TOKEN = "8101266105:AAH3Q6UsnoVk-uOCu2wkCX-uc4qG4MpDrlU"
const TELEGRAM_CHAT_ID = "7191925896"
// ========================

const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("JB Villian Bot Running Successfully 🚀")
})

app.listen(PORT, () => console.log("🌐 Server Running on Port", PORT))

async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${8101266105:AAH3Q6UsnoVk-uOCu2wkCX-uc4qG4MpDrlU}/sendMessage`
  await axios.post(url, {
    chat_id: 7191925896,
    text: text
  })
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: ["JB-Villian", "Chrome", "1.0.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode(phoneNumber)

    console.log("🔥 Pair Code:", code)

    await sendToTelegram(`🔥 JB Villian Pair Code:\n\n${code}`)
  }

  sock.ev.on("connection.update", (update) => {
    const { connection } = update
    if (connection === "open") {
      console.log("✅ WhatsApp Connected")
      sendToTelegram("✅ WhatsApp Bot Connected Successfully")
    }
  })
}

startBot()
