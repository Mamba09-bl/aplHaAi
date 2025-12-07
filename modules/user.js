import mongoose from "mongoose";

const SignUpSchema = new mongoose.Schema({
  Username: String,
  email: { type: String, unique: true },
  password: String,
  provider: String,
  providerId: String,
  freeMessagesUsed: { type: Number, default: 0 },
  hasPaid: { type: Boolean, default: false },
});

export default mongoose.models.SignUp || mongoose.model("SignUp", SignUpSchema);
