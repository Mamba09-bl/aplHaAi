import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/AlphaAi");
const ChatSchema = new mongoose.Schema({
  userEmail: String,
  messages: [
    {
      sender: { type: String, enum: ["user", "bot"], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
