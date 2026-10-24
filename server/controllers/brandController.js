// // // // const axios = require("axios");
// // // // const BrandRegistration = require("../models/BrandRegistration");

// // // // exports.registerBrand = async (req, res) => {
// // // //   try {
// // // //     const {
// // // //       company_name, product_name, nafdac_number,
// // // //       pantone_code, batch_format, contact_email,
// // // //     } = req.body;

// // // //     if (!company_name || !product_name || !nafdac_number || !contact_email) {
// // // //       return res.status(400).json({ error: "Missing required fields" });
// // // //     }

// // // //     // Create pending registration first
// // // //     const brand = await BrandRegistration.create({
// // // //       company_name, product_name, nafdac_number,
// // // //       pantone_code, batch_format, contact_email,
// // // //       status: "pending",
// // // //     });

// // // //     // If no Squad keys, return success with mock payment
// // // //     if (!process.env.SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY.trim() === "") {
// // // //       return res.json({
// // // //         success:     true,
// // // //         mock:        true,
// // // //         brand_id:    brand._id,
// // // //         payment_url: null,
// // // //         message:     "Brand registered. Add Squad keys to .env for live payment.",
// // // //       });
// // // //     }

// // // //     // Initiate Squad payment
// // // //       const squadRes = await axios.post(
// // // //       `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
// // // //       {
// // // //         amount:          "5000000",
// // // //         email:           contact_email,
// // // //         currency:        "NGN",
// // // //         initiate_type:   "inline",
// // // //         transaction_ref: `VS-${brand._id}`,
// // // //         callback_url:    "http://localhost:5173/onboard?status=success",
// // // //         pass_charge:     false,
// // // //         customer_name:   company_name,
// // // //       },
// // // //       {
// // // //         headers: {
// // // //           Authorization:  `Bearer ${process.env.SQUAD_SECRET_KEY}`,
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //       }
// // // //     );

// // // //     await BrandRegistration.findByIdAndUpdate(brand._id, {
// // // //       squad_reference: squadRes.data?.data?.transaction_ref || `VS-${brand._id}`,
// // // //     });

// // // //     return res.json({
// // // //       success:     true,
// // // //       brand_id:    brand._id,
// // // //       payment_url: squadRes.data?.data?.checkout_url || null,
// // // //       reference:   squadRes.data?.data?.transaction_ref,
// // // //     });

// // // //   } catch (err) {
// // // //     console.error("Brand register error:", err.response?.data || err.message);
// // // //     return res.status(500).json({ error: "Registration failed", detail: err.message });
// // // //   }
// // // // };

// // // // exports.getBrands = async (req, res) => {
// // // //   try {
// // // //     const brands = await BrandRegistration.find().sort({ created_at: -1 });
// // // //     return res.json({ success: true, brands });
// // // //   } catch (err) {
// // // //     return res.status(500).json({ error: err.message });
// // // //   }
// // // // };

// // // const axios             = require("axios");
// // // const crypto            = require("crypto");
// // // const BrandRegistration = require("../models/BrandRegistration");
// // // const User              = require("../models/User");
// // // const { sendWelcomeEmail } = require("../config/mailer");

// // // exports.registerBrand = async (req, res) => {
// // //   try {
// // //     const {
// // //       company_name, product_name, nafdac_number,
// // //       pantone_code, batch_format, contact_email,
// // //     } = req.body;

// // //     if (!company_name || !product_name || !nafdac_number || !contact_email)
// // //       return res.status(400).json({ error: "Missing required fields" });

// // //     // Check if brand already registered
// // //     const existing = await BrandRegistration.findOne({ contact_email, product_name });
// // //     if (existing)
// // //       return res.status(400).json({ error: "This product is already registered for this email" });

// // //     // Create brand registration
// // //     const brand = await BrandRegistration.create({
// // //       company_name, product_name, nafdac_number,
// // //       pantone_code, batch_format, contact_email,
// // //       status: "pending",
// // //     });

// // //     // Auto-create brand user account if doesn't exist
// // //     let tempPassword = null;
// // //     let userCreated  = false;

// // //     const existingUser = await User.findOne({ email: contact_email });
// // //     if (!existingUser) {
// // //       // Generate a readable temp password
// // //       tempPassword = crypto.randomBytes(4).toString("hex").toUpperCase();
// // //       await User.create({
// // //         name:     company_name,
// // //         email:    contact_email,
// // //         password: tempPassword,
// // //         role:     "brand",
// // //         brand_id: brand._id,
// // //       });
// // //       userCreated = true;
// // //     }

// // //     // If no Squad keys — return mock
// // //     if (!process.env.SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY.trim() === "") {
// // //       // Still send welcome email if user was created
// // //       if (userCreated && tempPassword) {
// // //         try {
// // //           await sendWelcomeEmail({
// // //             to:       contact_email,
// // //             name:     company_name,
// // //             product:  product_name,
// // //             email:    contact_email,
// // //             password: tempPassword,
// // //           });
// // //         } catch (mailErr) {
// // //           console.warn("Email send failed:", mailErr.message);
// // //         }
// // //       }
// // //       return res.json({
// // //         success:      true,
// // //         mock:         true,
// // //         brand_id:     brand._id,
// // //         payment_url:  null,
// // //         user_created: userCreated,
// // //         message:      "Brand registered. Add Squad keys for live payment.",
// // //       });
// // //     }

// // //     // Initiate Squad payment
// // //     const squadRes = await axios.post(
// // //       `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
// // //       {
// // //         amount:          "5000000",
// // //         email:           contact_email,
// // //         currency:        "NGN",
// // //         initiate_type:   "inline",
// // //         transaction_ref: `VS-${brand._id}`,
// // //         callback_url:    `${process.env.CLIENT_URL}/onboard?status=success`,
// // //         pass_charge:     false,
// // //         customer_name:   company_name,
// // //       },
// // //       {
// // //         headers: {
// // //           Authorization:  `Bearer ${process.env.SQUAD_SECRET_KEY}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //       }
// // //     );

// // //     await BrandRegistration.findByIdAndUpdate(brand._id, {
// // //       squad_reference: squadRes.data?.data?.transaction_ref || `VS-${brand._id}`,
// // //     });

// // //     // Send welcome email with credentials
// // //     if (userCreated && tempPassword) {
// // //       try {
// // //         await sendWelcomeEmail({
// // //           to:       contact_email,
// // //           name:     company_name,
// // //           product:  product_name,
// // //           email:    contact_email,
// // //           password: tempPassword,
// // //         });
// // //       } catch (mailErr) {
// // //         console.warn("Email send failed:", mailErr.message);
// // //       }
// // //     }

// // //     return res.json({
// // //       success:      true,
// // //       brand_id:     brand._id,
// // //       payment_url:  squadRes.data?.data?.checkout_url || null,
// // //       reference:    squadRes.data?.data?.transaction_ref,
// // //       user_created: userCreated,
// // //     });

// // //   } catch (err) {
// // //     console.error("Brand register error:", err.response?.data || err.message);
// // //     return res.status(500).json({ error: "Registration failed", detail: err.message });
// // //   }
// // // };

// // // exports.getBrands = async (req, res) => {
// // //   try {
// // //     const brands = await BrandRegistration.find().sort({ created_at: -1 });
// // //     return res.json({ success: true, brands });
// // //   } catch (err) {
// // //     return res.status(500).json({ error: err.message });
// // //   }
// // // };
// // const axios             = require("axios");
// // const BrandRegistration = require("../models/BrandRegistration");
// // const User              = require("../models/User");
// // const crypto            = require("crypto");
// // const { sendWelcomeEmail } = require("../config/mailer");

// // exports.registerBrand = async (req, res) => {
// //   try {
// //     const { company_name, contact_email } = req.body;

// //     if (!company_name || !contact_email)
// //       return res.status(400).json({ error: "Company name and email required" });

// //     // Check if already onboarded
// //     const existingBrand = await BrandRegistration.findOne({ contact_email });
// //     if (existingBrand) {
// //       return res.status(400).json({
// //         error: "This email already has an active brand account. Please login to add more products.",
// //       });
// //     }

// //     // Create brand registration
// //     const brand = await BrandRegistration.create({
// //       company_name,
// //       contact_email,
// //       status: "pending",
// //     });

// //     // Auto-create user account
// //     let tempPassword = null;
// //     const existingUser = await User.findOne({ email: contact_email });
// //     if (!existingUser) {
// //       tempPassword = crypto.randomBytes(4).toString("hex").toUpperCase();
// //       await User.create({
// //         name:     company_name,
// //         email:    contact_email,
// //         password: tempPassword,
// //         role:     "brand",
// //         brand_id: brand._id,
// //       });
// //     }

// //     // No Squad keys — mock flow
// //     if (!process.env.SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY.trim() === "") {
// //       if (tempPassword) {
// //         try {
// //           await sendWelcomeEmail({
// //             to: contact_email, name: company_name,
// //             email: contact_email, password: tempPassword,
// //           });
// //         } catch (e) { console.warn("Email failed:", e.message); }
// //       }
// //       return res.json({
// //         success: true, mock: true,
// //         brand_id: brand._id, payment_url: null,
// //       });
// //     }

// //     // Squad payment
// //     const squadRes = await axios.post(
// //       `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
// //       {
// //         amount:          "5000000",
// //         email:           contact_email,
// //         currency:        "NGN",
// //         initiate_type:   "inline",
// //         transaction_ref: `VS-${brand._id}`,
// //         callback_url:    `${process.env.CLIENT_URL || "http://localhost:5173"}/onboard?status=success`,
// //         pass_charge:     false,
// //         customer_name:   company_name,
// //       },
// //       {
// //         headers: {
// //           Authorization:  `Bearer ${process.env.SQUAD_SECRET_KEY}`,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );

// //     await BrandRegistration.findByIdAndUpdate(brand._id, {
// //       squad_reference: squadRes.data?.data?.transaction_ref,
// //     });

// //     if (tempPassword) {
// //       try {
// //         await sendWelcomeEmail({
// //           to: contact_email, name: company_name,
// //           email: contact_email, password: tempPassword,
// //         });
// //       } catch (e) { console.warn("Email failed:", e.message); }
// //     }

// //     return res.json({
// //       success:     true,
// //       brand_id:    brand._id,
// //       payment_url: squadRes.data?.data?.checkout_url || null,
// //       reference:   squadRes.data?.data?.transaction_ref,
// //     });

// //   } catch (err) {
// //     console.error("Brand register error:", err.response?.data || err.message);
// //     return res.status(500).json({ error: "Registration failed", detail: err.message });
// //   }
// // };

// // exports.getBrands = async (req, res) => {
// //   try {
// //     const brands = await BrandRegistration.find().sort({ created_at: -1 });
// //     return res.json({ success: true, brands });
// //   } catch (err) {
// //     return res.status(500).json({ error: err.message });
// //   }
// // };
// const axios             = require("axios");
// const BrandRegistration = require("../models/BrandRegistration");
// const User              = require("../models/User");

// exports.registerBrand = async (req, res) => {
//   try {
//     const { company_name, contact_email, password } = req.body;

//     if (!company_name || !contact_email || !password)
//       return res.status(400).json({ error: "Company name, email and password required" });

//     if (password.length < 6)
//       return res.status(400).json({ error: "Password must be at least 6 characters" });

//     // Check existing
//     const existingUser = await User.findOne({ email: contact_email });
//     if (existingUser)
//       return res.status(400).json({ error: "An account with this email already exists. Please login." });

//     const existingBrand = await BrandRegistration.findOne({ contact_email });
//     if (existingBrand)
//       return res.status(400).json({ error: "This email already has a brand account. Please login." });

//     // Create brand registration — pending until Squad payment
//     const brand = await BrandRegistration.create({
//       company_name,
//       contact_email,
//       status: "pending",
//     });

//     // Create user account with chosen password
//     await User.create({
//       name:     company_name,
//       email:    contact_email,
//       password: password,
//       role:     "brand",
//       ref_id:   brand._id,
//     });

//     // No Squad keys — mock
//     if (!process.env.SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY.trim() === "") {
//       // Activate immediately for dev
//       await BrandRegistration.findByIdAndUpdate(brand._id, { status: "active" });
//       return res.json({
//         success:     true,
//         mock:        true,
//         brand_id:    brand._id,
//         payment_url: null,
//       });
//     }

//     // Initiate Squad payment
//     const squadRes = await axios.post(
//       `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
//       {
//         amount:          "5000000",
//         email:           contact_email,
//         currency:        "NGN",
//         initiate_type:   "inline",
//         transaction_ref: `VS-${brand._id}`,
//         callback_url:    `${process.env.CLIENT_URL || "http://localhost:5173"}/onboard?status=success`,
//         pass_charge:     false,
//         customer_name:   company_name,
//       },
//       {
//         headers: {
//           Authorization:  `Bearer ${process.env.SQUAD_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     await BrandRegistration.findByIdAndUpdate(brand._id, {
//       squad_reference: squadRes.data?.data?.transaction_ref,
//     });

//     return res.json({
//       success:     true,
//       brand_id:    brand._id,
//       payment_url: squadRes.data?.data?.checkout_url || null,
//       reference:   squadRes.data?.data?.transaction_ref,
//     });

//   } catch (err) {
//     console.error("Brand register error:", err.response?.data || err.message);
//     return res.status(500).json({ error: "Registration failed", detail: err.message });
//   }
// };

// exports.getBrands = async (req, res) => {
//   try {
//     const brands = await BrandRegistration.find().sort({ created_at: -1 });
//     return res.json({ success: true, brands });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// exports.activateByEmail = async (req, res) => {
//   try {
//     const { contact_email } = req.body;
//     if (!contact_email)
//       return res.status(400).json({ error: "Email required" });

//     const brand = await BrandRegistration.findOneAndUpdate(
//       { contact_email },
//       { status: "active" },
//       { new: true }
//     );

//     if (!brand)
//       return res.status(404).json({ error: "Brand not found" });

//     return res.json({ success: true, brand });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };
// exports.activateByReference = async (req, res) => {
//   try {
//     const { reference } = req.body;
//     if (!reference) return res.status(400).json({ error: "Reference required" });

//     const brandId = reference.replace("VS-", "").split("?")[0];

//     const brand = await BrandRegistration.findByIdAndUpdate(
//       brandId,
//       { status: "active", squad_reference: reference },
//       { new: true }
//     );

//     if (!brand) return res.status(404).json({ error: "Brand not found" });

//     return res.json({ success: true, brand });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

const axios = require("axios");
const BrandRegistration = require("../models/BrandRegistration");
const User = require("../models/User");

exports.registerBrand = async (req, res) => {
  try {
    const { company_name, contact_email, password } = req.body;

    if (!company_name || !contact_email || !password)
      return res.status(400).json({ error: "Company name, email and password required" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ email: contact_email });
    if (existingUser)
      return res.status(400).json({ error: "An account with this email already exists. Please login." });

    const existingBrand = await BrandRegistration.findOne({ contact_email });
    if (existingBrand)
      return res.status(400).json({ error: "This email already has a brand account. Please login." });

    const brand = await BrandRegistration.create({
      company_name,
      contact_email,
      status: "pending",
    });

    await User.create({
      name: company_name,
      email: contact_email,
      password,
      role: "brand",
      ref_id: brand._id,
    });

    if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY.trim() === "") {
      await BrandRegistration.findByIdAndUpdate(brand._id, { status: "active" });
      return res.json({
        success: true,
        mock: true,
        brand_id: brand._id,
        payment_url: null,
      });
    }

    const paystackRes = await axios.post(
      `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        amount: "5000000",
        email: contact_email,
        currency: "NGN",
        reference: `VS-${brand._id}`,
        callback_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/onboard?status=success`,
        metadata: {
          brand_id: brand._id,
          company_name,
        },
        customer: {
          email: contact_email,
          name: company_name,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    await BrandRegistration.findByIdAndUpdate(brand._id, {
      paystack_reference: paystackRes.data?.data?.reference || `VS-${brand._id}`,
    });

    return res.json({
      success: true,
      brand_id: brand._id,
      payment_url: paystackRes.data?.data?.authorization_url || null,
      reference: paystackRes.data?.data?.reference,
    });
  } catch (err) {
    console.error("Brand register error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Registration failed", detail: err.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await BrandRegistration.find().sort({ created_at: -1 });
    return res.json({ success: true, brands });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.activateByEmail = async (req, res) => {
  try {
    const { contact_email } = req.body;
    if (!contact_email)
      return res.status(400).json({ error: "Email required" });

    const brand = await BrandRegistration.findOneAndUpdate(
      { contact_email },
      { status: "active" },
      { new: true }
    );

    if (!brand)
      return res.status(404).json({ error: "Brand not found" });

    return res.json({ success: true, brand });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.activateByReference = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ error: "Reference required" });

    const brandId = reference.replace("VS-", "").split("?")[0];

    const brand = await BrandRegistration.findByIdAndUpdate(
      brandId,
      { status: "active", paystack_reference: reference },
      { new: true }
    );

    if (!brand) return res.status(404).json({ error: "Brand not found" });

    return res.json({ success: true, brand });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
