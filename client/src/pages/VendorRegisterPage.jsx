

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
  "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT",
  "Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi",
  "Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo",
  "Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

const PRODUCTS = ["Coartem","Vaseline","Paracetamol","Amoxicillin","Artemether","Chloroquine","Ibuprofen","Metronidazole"];

export default function VendorRegisterPage() {
  useEffect(() => {
    const status    = searchParams.get("status");
    const reference = searchParams.get("reference");

    if (status === "success" && reference) {
      axios.post(`${API}/api/vendors/activate-by-reference`, { reference })
        .catch(() => {});
      setStep(4);
    }
  }, []);
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(
    searchParams.get("status") === "success" ? 3 : 0
  );
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [form, setForm] = useState({
    pharmacy_name: "", owner_name: "", email: "",
    phone: "", address: "", city: "", state: "",
    password: "", confirm_password: "",
    products: [],
  });

  const set  = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleProduct = (p) => setForm(f => ({
    ...f,
    products: f.products.includes(p)
      ? f.products.filter(x => x !== p)
      : [...f.products, p],
  }));

  const submit = async () => {
  setLoading(true); setError(null);
  try {
    const { data } = await axios.post(`${API}/api/vendors/register`, {
      pharmacy_name: form.pharmacy_name,
      owner_name:    form.owner_name,
      email:         form.email,
      phone:         form.phone,
      address:       form.address,
      city:          form.city,
      state:         form.state,
      products:      form.products.filter(p => p.name && p.price > 0),
      password:      form.password,
    });
    if (data.payment_url) window.location.href = data.payment_url;
    setStep(4);
  } catch (err) {
    setError(err.response?.data?.error || "Registration failed");
  } finally { setLoading(false); }
};

  const inp = { width: "100%", background: "#111", border: "1px solid #2A2A2A", borderRadius: 7, padding: "10px 13px", fontSize: 13, color: "#fff", outline: "none", fontFamily: "inherit" };
  const lbl = { fontSize: 11, color: "#666", marginBottom: 5, display: "block" };
  const btn = { background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
  const sec = { background: "transparent", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "11px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" };

  const STEPS = ["Vendor Info", "Location", "Products", "Account & Pay", "Done"];

  return (
    <div style={{ padding: 24, maxWidth: 580, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "#E5391F", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Vendor Registration</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Become a Verified Vendor</div>
        <div style={{ fontSize: 12, color: "#555" }}>Join the Mantios verified vendor network. When a counterfeit is detected nearby, we send customers to you.</div>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: step > i ? "#E5391F" : i === step ? "rgba(229,57,31,0.15)" : "#1A1A1A", border: `1px solid ${step >= i ? "#E5391F" : "#2A2A2A"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: step > i ? "#000" : i === step ? "#E5391F" : "#555", marginBottom: 4 }}>
                {step > i ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 9, color: step >= i ? "#E5391F" : "#444", whiteSpace: "nowrap" }}>{label}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > i ? "#E5391F" : "#2A2A2A", margin: "0 6px", marginBottom: 16 }} />}
          </div>
        ))}
      </div>

      <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px" }}>

        {/* Step 0 — Vendor Info */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Vendor Information</div>
            {[
              ["Vendor Name",  "pharmacy_name", "e.g. HealthPlus Stores"],
              ["Owner / Manager Name", "owner_name", "e.g. Mr. Adebayo"],
              ["Email Address",  "email",         "vendor@email.com"],
              ["Phone Number",   "phone",          "e.g. 08012345678"],
            ].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{label}</label>
                <input placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} style={inp} />
              </div>
            ))}
            <button
              onClick={() => setStep(1)}
              disabled={!form.pharmacy_name || !form.owner_name || !form.email || !form.phone}
              style={{ ...btn, opacity: !form.pharmacy_name || !form.owner_name || !form.email || !form.phone ? 0.5 : 1, marginTop: 6 }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 1 — Location */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Vendor Location</div>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Street Address</label>
              <input placeholder="e.g. 15 Broad Street, Lagos Island" value={form.address} onChange={e => set("address", e.target.value)} style={inp} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={lbl}>City</label>
                <input placeholder="e.g. Lagos" value={form.city} onChange={e => set("city", e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>State</label>
                <select value={form.state} onChange={e => set("state", e.target.value)} style={{ ...inp, appearance: "none" }}>
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>📍 Location tip</div>
              <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>Your vendor will appear in the vendor locator when a counterfeit product is detected near your city. Make sure your address is accurate.</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(0)} style={sec}>Back</button>
              <button onClick={() => setStep(2)} disabled={!form.address || !form.city || !form.state} style={{ ...btn, opacity: !form.address || !form.city || !form.state ? 0.5 : 1 }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2 — Products & Payment */}
       {step === 2 && (
  <div>
    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Products & Prices</div>
    <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>
      Add the genuine products you stock with your selling price. Customers can pay you via Squad.
    </div>

    {/* Product list */}
    {form.products.map((p, i) => (
      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
        <input
          placeholder="Product name"
          value={p.name}
          onChange={e => {
            const updated = [...form.products];
            updated[i] = { ...updated[i], name: e.target.value };
            setForm(f => ({ ...f, products: updated }));
          }}
          style={{ ...inp, flex: 2 }} />
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 13 }}>₦</span>
          <input
            type="number"
            placeholder="Price"
            value={p.price || ""}
            onChange={e => {
              const updated = [...form.products];
              updated[i] = { ...updated[i], price: Number(e.target.value) };
              setForm(f => ({ ...f, products: updated }));
            }}
            style={{ ...inp, paddingLeft: 24 }} />
        </div>
        <button
          onClick={() => setForm(f => ({ ...f, products: f.products.filter((_, j) => j !== i) }))}
          style={{ background: "transparent", border: "1px solid #2A2A2A", color: "#555", borderRadius: 6, padding: "10px 12px", cursor: "pointer", fontSize: 16 }}>
          ×
        </button>
      </div>
    ))}

    <button
      onClick={() => setForm(f => ({ ...f, products: [...f.products, { name: "", price: 0, in_stock: true }] }))}
      style={{ width: "100%", background: "transparent", border: "2px dashed #2A2A2A", color: "#555", borderRadius: 8, padding: "10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginBottom: 20 }}>
      + Add Product
    </button>

    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={() => setStep(1)} style={sec}>Back</button>
      <button onClick={() => setStep(3)} disabled={form.products.length === 0} style={{ ...btn, opacity: form.products.length === 0 ? 0.5 : 1, flex: 1 }}>
        Continue →
      </button>
    </div>
  </div>
        )}
        {/* Step 3 — Success */}
        {/* {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(229,57,31,0.1)", border: "2px solid #E5391F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E5391F", marginBottom: 8 }}>You're on the network!</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>Your vendor will appear in the Mantios vendor locator once payment is confirmed via Squad webhook.</div>
            <div style={{ background: "#2E100B", border: "1px solid #B92D17", borderRadius: 8, padding: "14px 16px", textAlign: "left", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#E5391F", marginBottom: 8 }}>What happens next</div>
              {[
                "Squad payment confirmed via webhook",
                "Vendor listed on Mantios vendor network",
                "Customers directed to you when fake products detected nearby",
                "You receive Squad-powered payments from verified customers",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#E5391F", fontSize: 11 }}>✓</span>
                  <span style={{ fontSize: 11, color: "#666" }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/")} style={{ ...btn, width: "100%" }}>
              Back to Scanner →
            </button>
          </div>
        )} */}

        {step === 3 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Create Account & Pay</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 18 }}>Set your login password then pay the one-time listing fee.</div>

            {[
              ["Password",         "password",         "Choose a strong password", "password"],
              ["Confirm Password", "confirm_password",  "Re-enter password",       "password"],
            ].map(([label, key, ph, type]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{label}</label>
                <input type={type} placeholder={ph} value={form[key] || ""} onChange={e => set(key, e.target.value)} style={inp} />
              </div>
            ))}

            {form.password && form.confirm_password && form.password !== form.confirm_password && (
              <div style={{ fontSize: 11, color: "#E53935", marginBottom: 10 }}>Passwords do not match</div>
            )}

            {/* Payment summary */}
            <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 10, padding: "14px", marginBottom: 16, marginTop: 8 }}>
              {[
                ["Vendor",     form.pharmacy_name],
                ["Products",     `${form.products.length} listed`],
                ["Listing Fee",  "₦10,000 (one-time)"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: "#666" }}>{k}</span>
                  <span style={{ color: k === "Listing Fee" ? "#E5391F" : "#fff", fontWeight: k === "Listing Fee" ? 700 : 400 }}>{v}</span>
                </div>
              ))}
            </div>

            {error && <div style={{ fontSize: 11, color: "#E53935", marginBottom: 12, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>{error}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(2)} style={sec}>Back</button>
              <button
                onClick={submit}
                disabled={loading || !form.password || form.password !== form.confirm_password || form.password.length < 6}
                style={{ ...btn, flex: 1, opacity: loading || !form.password || form.password !== form.confirm_password || form.password.length < 6 ? 0.6 : 1 }}>
                {loading ? "Processing..." : "Pay ₦10,000 via Squad →"}
              </button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(229,57,31,0.1)", border: "2px solid #E5391F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>✓</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#E5391F", marginBottom: 8 }}>Payment Successful!</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 24 }}>
              Your vendor is now on the Mantios verified network. Customers will be directed to you when fake products are detected nearby.
            </div>

            <div style={{ background: "#2E100B", border: "1px solid #B92D17", borderRadius: 10, padding: "16px", textAlign: "left", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#E5391F", marginBottom: 10 }}>You're live on the network</div>
              {[
                "Your vendor appears in the vendor locator",
                "Customers can find and pay you via Squad",
                "You get notified when a customer is directed to you",
                "Manage your products and prices from your portal",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                  <span style={{ color: "#E5391F", fontSize: 11, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 11, color: "#666" }}>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/login")}
              style={{ width: "100%", background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
              Login to Vendor Portal →
            </button>
            <button
              onClick={() => { setStep(0); setForm({ pharmacy_name: "", owner_name: "", email: "", phone: "", address: "", city: "", state: "", password: "", confirm_password: "", products: [] }); }}
              style={{ width: "100%", background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 8, padding: "11px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Register Another Vendor
            </button>
          </div>
        )}


      </div>
    </div>
  );
}