// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// const corsOptions = {
//   origin: ["http://localhost:5173", "http://localhost:5174"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173' || 'https://app.mantios.ng',
//   credentials: true
// }));
// app.use(express.json({ limit: "10mb" }));

// app.use("/api/auth",      require("./routes/auth"));
// app.use("/api/scan",      require("./routes/scan"));
// app.use("/api/brands",    require("./routes/brands"));
// app.use("/api/squad",     require("./routes/squad"));
// app.use("/api/dashboard", require("./routes/dashboard"));
// app.use("/api/vendors", require("./routes/vendors"));
// app.use("/api/products", require("./routes/products"));


// app.get("/", (req, res) => res.json({ status: "VeraScann API running" }));

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(process.env.PORT, () =>
//       console.log(`Server running on port ${process.env.PORT}`)
//     );
//   })
//   .catch((err) => console.error("MongoDB error:", err));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173" || "https://app.mantios.ng",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/scan", require("./routes/scan"));
app.use("/api/brands", require("./routes/brands"));
app.use("/api/paystack", require("./routes/squad"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/vendors", require("./routes/vendors"));
app.use("/api/products", require("./routes/products"));

app.get("/", (req, res) => res.json({ status: "VeraScann API running" }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
