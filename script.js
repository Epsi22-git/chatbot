const socket = io();
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
        displayUserMessage(message);
        socket.emit("userMessage", message);
        userInput.value = "";
    }
});

socket.on("botReply", (botReply) => {
    displayBotMessage(botReply);
});

function displayUserMessage(message) {
    const userMessageElement = document.createElement("div");
    userMessageElement.classList.add("message", "user-message");
    userMessageElement.textContent = message;
    chatBox.appendChild(userMessageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayBotMessage(message) {
    const botMessageElement = document.createElement("div");
    botMessageElement.classList.add("message", "bot-message");
    botMessageElement.textContent = message;
    chatBox.appendChild(botMessageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
