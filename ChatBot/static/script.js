document.addEventListener("DOMContentLoaded", () => {
  const chatList = document.querySelector(".chat-list");
  const typingInput = document.querySelector(".typing-input");
  const sendMessageButton = document.querySelector("#send-message-button");
  const suggestions = document.querySelectorAll(".suggestion"); // Get all suggestions

  // Add event listeners to suggestions
  suggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      const text = suggestion.querySelector(".text").innerText; // Get the text inside the suggestion
      sendMessage(text); // Send the text to chat
    });
  });

  // Add event listener for the send button
  sendMessageButton.addEventListener("click", (event) => {
    event.preventDefault();
    const message = typingInput.value.trim();
    if (message) {
      sendMessage(message); // Send the typed message
    }
  });

  // Function to send a message
  async function sendMessage(message) {
    // Display user's message
    addMessageToChat("You", message);

    // Clear the input field
    typingInput.value = "";

    // Send the message to the backend
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();

      // Display bot's reply
      addMessageToChat("Gemini", data.reply);
    } catch (error) {
      console.error("Error:", error);
      addMessageToChat("Error", "Failed to get a response. Please try again.");
    }
  }

  // Function to add a message to the chat list
  function addMessageToChat(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender === "You" ? "outgoing" : "incoming");

    const content = `
      <div class="message-content">
        <strong>${sender}:</strong>
        <span class="text">${message}</span>
      </div>
    `;
    messageElement.innerHTML = content;
    chatList.appendChild(messageElement);

    // Scroll to the latest message
    chatList.scrollTop = chatList.scrollHeight;
  }
});
