import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys"

import P from "pino"
import fs from "fs"

const BOT_NAME = "jb villian"
const OWNER = "JB PAPA 71"
let antilink = false

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState("./session")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["JB-PAPA-71", "Chrome", "1.0.0"]
  })

  // 🔥 Pair Code System
  if (!sock.authState.creds.registered) {
    const number = "584264513787" // এখানে নিজের নাম্বার
    const code = await sock.requestPairingCode(number)
    console.log("\n🔥 YOUR PAIR CODE:\n", code, "\n")
  }

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {
    if (update.connection === "open") {
      console.log("✅ Bot Connected Successfully")
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const sender = msg.key.participant || from
    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    // 🔥 Auto React
    await sock.sendMessage(from, {
      react: { text: "🔥", key: msg.key }
    })

    // 🔥 MENU
    if (body === ".menu") {
      await sock.sendMessage(from, {
        image: fs.readFileSync("https://files.catbox.moe/427sq3.jpg"),
        caption: `👑 ${JB_villian}

Owner: ${JB papa 71}

Commands:
.menu
.kick
.promote
.demote
.antilink on
.antilink off`
      })
    }

    // 🔥 AntiLink On Off
    if (body === ".antilink on") {
      antilink = true
      await sock.sendMessage(from, { text: "✅ AntiLink Enabled" })
    }

    if (body === ".antilink off") {
      antilink = false
      await sock.sendMessage(from, { text: "❌ AntiLink Disabled" })
    }

    // 🔥 AntiLink System
    if (antilink && body?.includes("chat.whatsapp.com")) {
      await sock.sendMessage(from, { text: "🚫 Group Link Not Allowed!" })
      await sock.groupParticipantsUpdate(from, [sender], "remove")
    }

    // 🔥 Kick
    if (body === ".kick") {
      await sock.groupParticipantsUpdate(from, [sender], "remove")
    }

    // 🔥 Promote
    if (body === ".promote") {
      await sock.groupParticipantsUpdate(from, [sender], "promote")
    }

    // 🔥 Demote
    if (body === ".demote") {
      await sock.groupParticipantsUpdate(from, [sender], "demote")
    }

  })
}

startBot()
