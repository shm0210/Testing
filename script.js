const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", async () => {
    const message = userInput.value;
    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";

    const response = await getAIResponse(message);
    appendMessage("bot", response);
});

function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getAIResponse(message) {
    const apiKey = "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"; // Replace with your key for testing only

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-5-mini",
            messages: [{ role: "user", content: message }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}