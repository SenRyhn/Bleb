const { default : WabotSocket,useMultiFileAuthState } = require("@whiskeysockets/baileys")
const Pino = require("pino");
const pair = process.argv.includes("-code-pairing");

(async function connect() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const senr = WabotSocket({
        logger: Pino({ level: "silent" }), browser: ["Chrome (Linux)", "", ""], auth: state, printQRInTerminal: !pair, defaultQueryTimeoutMs: undefined, syncFullHistory: false
    });
    if(pair && !senr.user && !senr.authState.creds.registered) {
        const question = (pertanyaan) => new Promise((resolve) => {
          const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout})
        readline.question(pertanyaan, answer => { resolve(answer)
        readline.close()
        })
        })
        const phoneNumber = await question("(Example: +628123456789)\n=> Enter your Whatsapp Number: +")
        setTimeout(async function() {
        const pairingCode = await senr.requestPairingCode(phoneNumber)
        console.log("=> Your pairing code is:", pairingCode)
      }, 3000)
      }
    senr.ev.on("connection.update", c => {
        const { connection, lastDisconnect } = c;
        if(connection === "close") {
            console.log(`Koneksi terputus.\nterakhir terputus pada: ${lastDisconnect}`);
            connect();
        }
        if(connection === "open") {
            console.log(`Koneksi tersambung pada: +${senr.user.id.split(":")[0]}`)
        }
    })
    senr.ev.on("creds.update", saveCreds);
})()