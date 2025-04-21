console.log("🟢 psytalk.js cargado correctamente (modo streaming)");

document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const terminalOutput = document.getElementById("terminal-output");

  let history = [];

  function addMessage(role, content) {
    const msg = document.createElement("div");
    msg.className = "msg";

    if (role === "assistant") {
      msg.innerHTML = `<span style="color:#ff4444;">🤖 IA: ${content}</span>`;
    } else if (role === "user") {
      msg.textContent = `🧠 Tú: ${content}`;
    } else {
      msg.textContent = `💾 Sistema: ${content}`;
    }

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

    addMessage("user", message);
    addToHistory("user", message);
    inputField.value = "";

    const systemMsg = addMessage("system", "🌀 Canalizando respuesta...");
    const responseMsg = document.createElement("div");
    responseMsg.className = "msg";
    responseMsg.innerHTML = `<span style="color:#ff4444;">🤖 IA: </span>`;
    terminalOutput.appendChild(responseMsg);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    let buffer = "";

    try {
      const res = await fetch("/api/psytalk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        responseMsg.innerHTML = `<span style="color:#ff4444;">🤖 IA: ${buffer}</span>`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }

      addToHistory("assistant", buffer.trim());
    } catch (err) {
      console.error("❌ Error de streaming:", err);
      responseMsg.innerHTML = `<span style="color:#ff4444;">⚠️ Error de conexión con la IA.</span>`;
    }

    systemMsg.remove();
  }

  sendButton.addEventListener("click", () => sendMessage());
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
