// const mongoose = require("mongoose");

// const BrandRegistrationSchema = new mongoose.Schema({
//   company_name:    { type: String, required: true },
//   product_name:    { type: String, required: true },
//   nafdac_number:   { type: String, required: true },
//   pantone_code:    { type: String },
//   batch_format:    { type: String },
//   contact_email:   { type: String, required: true },
//   squad_reference: { type: String },
//   status:          { type: String, enum: ["pending", "active"], default: "pending" },
//   created_at:      { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("BrandRegistration", BrandRegistrationSchema);

// const mongoose = require("mongoose");

// const BrandRegistrationSchema = new mongoose.Schema({
//   company_name:    { type: String, required: true },
//   contact_email:   { type: String, required: true },
//   squad_reference: { type: String },
//   status:          { type: String, enum: ["pending", "active"], default: "pending" },
//   created_at:      { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("BrandRegistration", BrandRegistrationSchema);


const mongoose = require("mongoose");

const BrandRegistrationSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  contact_email: { type: String, required: true },
  paystack_reference: { type: String },
  status: { type: String, enum: ["pending", "active"], default: "pending" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BrandRegistration", BrandRegistrationSchema);
