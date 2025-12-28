// ================== SELECT ELEMENTS ==================
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");
const clearChatBtn = document.getElementById("clearChatBtn");
const usernameInput = document.getElementById("usernameInput");
const saveUsernameBtn = document.getElementById("saveUsernameBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const usernameBox = document.querySelector(".username-box");

// Modal
const clearChatModal = document.getElementById("clearChatModal");
const confirmClearBtn = document.getElementById("confirmClearBtn");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const cancelClearBtn = document.getElementById("cancelClearBtn");

// ================== LOCAL STORAGE ==================
let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
let username = localStorage.getItem("chatUsername") || "";

// Hide username box if already set
if (username) usernameBox.style.display = "none";

// Render saved messages
messages.forEach(msg => renderMessage(msg));

// ================== USERNAME ==================
saveUsernameBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    if (!name) {
        shakeInput(usernameInput);
        return;
    }
    username = name;
    localStorage.setItem("chatUsername", username);
    usernameBox.style.display = "none";
});

// ================== DARK MODE ==================
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// ================== EMOJI PICKER ==================
emojiBtn.addEventListener("click", e => {
    e.stopPropagation();
    emojiPicker.style.display = emojiPicker.style.display === "flex" ? "none" : "flex";
});

emojiPicker.addEventListener("click", e => {
    if (e.target.tagName === "SPAN") {
        messageInput.value += e.target.textContent;
        messageInput.focus();
    }
});

document.addEventListener("click", e => {
    if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
        emojiPicker.style.display = "none";
    }
});

// ================== SEND MESSAGE ==================
chatForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!username) {
        alert("Please enter your name first!");
        usernameBox.style.display = "flex";
        usernameInput.focus();
        return;
    }

    const text = messageInput.value.trim();
    if (!text) {
        shakeInput(messageInput);
        return;
    }

    const userMessage = { text, type: "sent", time: getCurrentTime(), name: username };
    messages.push(userMessage);
    saveMessages();
    renderMessage(userMessage);
    messageInput.value = "";
    scrollToBottom();

    const typingIndicator = showTyping();

    setTimeout(() => {
        typingIndicator.remove();
        const botMessage = {
            text: getBotReply(text),
            type: "received",
            time: getCurrentTime(),
            name: "Bot"
        };
        messages.push(botMessage);
        saveMessages();
        renderMessage(botMessage);
        scrollToBottom();
    }, 1000 + Math.random() * 1000);
});

// ================== CLEAR CHAT MODAL ==================
clearChatBtn.addEventListener("click", () => clearChatModal.style.display = "flex");
cancelClearBtn.addEventListener("click", () => clearChatModal.style.display = "none");

confirmClearBtn.addEventListener("click", () => {
    messages = [];
    localStorage.removeItem("chatMessages");
    chatBox.innerHTML = "";
    clearChatModal.style.display = "none";
});

deleteSelectedBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".select-msg:checked");
    if (checkboxes.length === 0) {
        alert("Please select messages to delete!");
        return;
    }
    checkboxes.forEach(cb => {
        const index = cb.dataset.index;
        messages.splice(index, 1);
    });
    saveMessages();
    renderAllMessages();
    clearChatModal.style.display = "none";
});

clearChatModal.addEventListener("click", e => {
    if (e.target === clearChatModal) clearChatModal.style.display = "none";
});

// ================== RENDER & HELPERS ==================
function renderMessage(msg, index) {
    const div = document.createElement("div");
    div.className = `message ${msg.type}`;
    div.innerHTML = `<input type="checkbox" class="select-msg" data-index="${index}"> <strong>${msg.name}:</strong> ${msg.text} <div class="time">${msg.time}</div>`;
    chatBox.appendChild(div);
}

function renderAllMessages() {
    chatBox.innerHTML = "";
    messages.forEach((msg, i) => renderMessage(msg, i));
}

function saveMessages() {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function showTyping() {
    const div = document.createElement("div");
    div.className = "typing";
    div.innerText = "Bot is typing...";
    chatBox.appendChild(div);
    scrollToBottom();
    return div;
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotReply(text) {
    text = text.toLowerCase();
    if (text.includes("hi") || text.includes("hello") || text.includes("hey")) return "Hello 👋 How can I help you today?";
    if (text.includes("how are you")) return "I'm doing great, thanks! 😊 How about you?";
    if (text.includes("help")) return "Sure! I'm here to chat. What do you need help with? 🙂";
    if (text.includes("bye") || text.includes("goodbye")) return "Goodbye 👋 Have a wonderful day!";
    if (text.includes("name")) return "I'm your friendly chat bot 🤖";
    return "That's interesting! Tell me more 👍";
}

function shakeInput(input) {
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 500);
}


renderAllMessages();


































































































