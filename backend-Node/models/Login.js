import mongoose from "mongoose";
import bcrypt from "bcrypt";

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["Student", "HOD", "TPO", "Admin"], 
    required: true 
  }
}, { timestamps: true });

// Hash password before saving
loginSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
loginSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Login = mongoose.model("Login", loginSchema);
export default Login;
