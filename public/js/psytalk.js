console.log("🟢 psytalk.js cargado correctamente (modo streaming)");

document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const terminalOutput = document.getElementById("terminal-output");

  let history = [];

  function addMessage(role, content) {
    const msg = document.createElement("div");
    msg.className = "msg";
    msg.textContent = `${role === "user" ? "🧠 Tú" : role === "assistant" ? "🤖 IA" : "💾 Sistema"}: ${content}`;
    terminalOutput.appendChild(msg);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return msg;
  }

  function addToHistory(role, content) {
    history.push({ role, content });
    if (history.length > 8) {
      history = history.slice(-8);
    }
  }

  async function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    const userMsg = addMessage("user", message);
    addToHistory("user", message);
    inputField.value = "";

    const responseMsg = addMessage("assistant", "");
    addMessage("system", "🌀 Canalizando respuesta...");

    try {
      const res = await fetch("/api/psytalk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        responseMsg.textContent = `🤖 IA: ${buffer}`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }

      addToHistory("assistant", buffer.trim());
    } catch (err) {
      console.error("❌ Error de streaming:", err);
      addMessage("system", "⚠️ Error de conexión.");
    }
  }

  sendButton.addEventListener("click", () => sendMessage());
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
