// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect('mongodb+srv://epsi22charle:PGtWPyOX9YnGsurw@bot.veo1e.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected...");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Schema for storing messages in MongoDB
const messageSchema = new mongoose.Schema({
    userMessage: String,
    botReply: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

// Serve the HTML, CSS, and JS files
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// API to get chat history
app.get("/messages", async (req, res) => {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Set up Socket.io for real-time communication
const io = socketIo(server);
io.on("connection", (socket) => {
    console.log("User connected");

    // Handle messages from the client
    socket.on("userMessage", async (message) => {
        const botReply = await generateBotReply(message);
        
        // Save the conversation in MongoDB
        const newMessage = new Message({ userMessage: message, botReply });
        await newMessage.save();

        // Emit the bot's response back to the client
        socket.emit("botReply", botReply);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Function to generate bot replies
async function generateBotReply(userMessage) {
    // Simple bot logic
    if (userMessage.toLowerCase().includes("hello")) {
        return "Hello! How can I assist you today?";
    } else if (userMessage.toLowerCase().includes("how are you")) {
        return "I'm good, thank you for asking!";
    } else {
        return "Sorry, I didn't understand that.";
    }
}
