console.log("🟢 psytalk.js cargado correctamente");

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
  }

  function addToHistory(role, content) {
    history.push({ role, content });
    if (history.length > 8) {
      history = history.slice(-8); // mantener solo los últimos 8
    }
  }

  async function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    addMessage("user", message);
    addToHistory("user", message);
    inputField.value = "";

    const responseMsg = document.createElement("div");
    responseMsg.className = "msg";
    responseMsg.textContent = "💾 Sistema: 🌀 Streaming IA...";
    terminalOutput.appendChild(responseMsg);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    try {
      const res = await fetch("/api/psytalk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history })
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }

      // parsear como JSON solo al final
      try {
        const parsed = JSON.parse(fullResponse);
        const reply = parsed.reply || "Sin respuesta...";
        responseMsg.textContent = `🤖 IA: ${reply}`;
        addToHistory("assistant", reply);
      } catch (err) {
        console.error("❌ Error al parsear JSON:", err);
        responseMsg.textContent = `🤖 IA: ${fullResponse}`;
        addToHistory("assistant", fullResponse);
      }

    } catch (err) {
      console.error("❌ Error de conexión:", err);
      responseMsg.textContent = "💾 Sistema: ⚠️ Error de conexión.";
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  sendButton.addEventListener("click", () => sendMessage());
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
