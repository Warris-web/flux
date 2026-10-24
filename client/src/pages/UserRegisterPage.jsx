import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!form.name || !form.email || !form.password) {
        throw new Error("Please fill in all fields");
      }

      if (form.password !== form.confirm_password) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post(`${API}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "user",
      });

      if (data.token) {
        localStorage.setItem("vs_token", data.token);
      }

      navigate("/scan");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#111",
    border: "1px solid #2A2A2A",
    borderRadius: 7,
    padding: "11px 13px",
    fontSize: 13,
    color: "#fff",
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "#E5391F", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
          User Registration
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Create your scanner account</div>
        <div style={{ fontSize: 12, color: "#555" }}>
          Sign up to scan products and verify authenticity before you buy.
        </div>
      </div>

      <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px" }}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Full Name</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Ada Okafor" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Email</label>
          <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Password</label>
          <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Choose a strong password" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Confirm Password</label>
          <input type="password" value={form.confirm_password} onChange={e => set("confirm_password", e.target.value)} placeholder="Re-enter password" style={inputStyle} />
        </div>

        {error && (
          <div style={{ fontSize: 11, color: "#E53935", marginBottom: 12, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            background: "#E5391F",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating account..." : "Create Account →"}
        </button>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "#555" }}>
          Already have an account? <span onClick={() => navigate("/login")} style={{ color: "#E5391F", cursor: "pointer" }}>Login here →</span>
        </div>
      </div>
    </div>
  );
}