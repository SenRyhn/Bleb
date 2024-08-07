module.exports = (senr, messages) => {
    const m = messages;
    if(!m.message) return;
    const [type] = Object.keys(m.message);
    console.log(type)
    const text = 
    type === "extendedTextMessage" ? m.message.extendedTextMessage.text : type === "conversation" ? m.message.conversation.text : "";
    const prefix = ".";
    if(!text || ( text && !text.startsWith(prefix))) return;
    const cmd = text.substring(1).split(" ")[0].trim().toLowercase;
    const args = text.replace(/^(.*?)\s+\b/g, "");
    require("../case.js")(senr, m, type, text, cmd, args);
}