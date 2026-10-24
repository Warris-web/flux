// const mongoose = require("mongoose");
// const bcrypt   = require("bcryptjs");

// const UserSchema = new mongoose.Schema({
//   name:       { type: String, required: true },
//   email:      { type: String, required: true, unique: true, lowercase: true },
//   password:   { type: String, required: true },
//   role:       { type: String, enum: ["brand", "nafdac"], required: true },
//   brand_id:   { type: mongoose.Schema.Types.ObjectId, ref: "BrandRegistration" },
//   created_at: { type: Date, default: Date.now },
// });

// UserSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 12);
// });

// UserSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// module.exports = mongoose.model("User", UserSchema);
// const mongoose = require("mongoose");
// const bcrypt   = require("bcryptjs");

// const UserSchema = new mongoose.Schema({
//   name:       { type: String, required: true },
//   email:      { type: String, required: true, unique: true, lowercase: true },
//   password:   { type: String, required: true },
//   role:       { type: String, enum: ["brand", "nafdac", "vendor"], required: true },
//   ref_id:     { type: mongoose.Schema.Types.ObjectId },
//   created_at: { type: Date, default: Date.now },
// });

// UserSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 12);
// });

// UserSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["brand", "nafdac", "vendor", "user"], required: true },
  ref_id: { type: mongoose.Schema.Types.ObjectId },
  created_at: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);