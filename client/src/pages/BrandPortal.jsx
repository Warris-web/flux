









import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import axios                   from "axios";

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = ["pharma", "cosmetics", "auto-parts", "food", "electronics", "general"];

export default function BrandPortal() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("products");
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState(null);
  const [form,      setForm]      = useState({
    product_name: "", nafdac_number: "",
    pantone_code: "", batch_format: "", category: "general",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const token = localStorage.getItem("vs_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/products/mine`, { headers })
      .then(r => setProducts(r.data.products))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  const addProduct = async () => {
    setSaving(true); setError(null);
    try {
      const { data } = await axios.post(`${API}/api/products`, form, { headers });
      setProducts(p => [data.product, ...p]);
      setShowModal(false);
      setForm({ product_name: "", nafdac_number: "", pantone_code: "", batch_format: "", category: "general" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add product");
    } finally { setSaving(false); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Remove this product from Mantios protection?")) return;
    await axios.delete(`${API}/api/products/${id}`, { headers });
    setProducts(p => p.filter(x => x._id !== id));
  };

  if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading...</div>;

  const inp = { width: "100%", background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: 7, padding: "10px 13px", fontSize: 13, color: "#fff", outline: "none", fontFamily: "inherit" };
  const lbl = { fontSize: 11, color: "#666", marginBottom: 5, display: "block" };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#E5391F", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Brand Management Portal</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
            {products.length} product{products.length !== 1 ? "s" : ""} protected · Unlimited plan
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          + Add Product
        </button>
      </div>

      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Products protected", value: products.length,                                          color: "#7B0027" },
          { label: "Total scans",        value: products.reduce((a, p) => a + (p.scan_count || 0), 0),   color: "#fff"    },
          { label: "Fakes detected",     value: products.reduce((a, p) => a + (p.fake_count || 0), 0),   color: "#7B0027" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #2A2A2A", marginBottom: 20 }}>
        {["products", "alerts"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "#E5391F" : "transparent"}`, color: tab === t ? "#E5391F" : "#555", padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", marginBottom: -1 }}>
            {t}
          </button>
        ))}
      </div>

      {/* Products tab */}
      {tab === "products" && (
        <div>
          {products.length === 0 ? (
            <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "56px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📦</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No products yet</div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
                Add your first product to start protecting it from counterfeits. You can add as many as you want.
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{ background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                + Add First Product
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
              {products.map((p, i) => (
                <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{p.product_name}</div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#E5391F", background: "rgba(229,57,31,0.1)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 4, padding: "2px 7px" }}>
                        {p.category?.toUpperCase() || "GENERAL"}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      style={{ background: "transparent", color: "#444", border: "none", cursor: "pointer", fontSize: 16, padding: "0 4px" }}
                      title="Remove product">
                      ×
                    </button>
                  </div>

                  {[
                    ["NAFDAC No.",     p.nafdac_number],
                    ["Pantone",        p.pantone_code  || "—"],
                    ["Batch Format",   p.batch_format  || "—"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12 }}>
                      <span style={{ color: "#555" }}>{k}</span>
                      <span style={{ color: "#888", fontFamily: "monospace" }}>{v}</span>
                    </div>
                  ))}

                  <div style={{ borderTop: "1px solid #222", paddingTop: 10, marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: "#111", borderRadius: 6, padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{p.scan_count || 0}</div>
                      <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>Scans</div>
                    </div>
                    <div style={{ background: "#111", borderRadius: 6, padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: p.fake_count > 0 ? "#E53935" : "#43A047" }}>{p.fake_count || 0}</div>
                      <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>Fakes detected</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 10, color: "#444" }}>
                    Added {new Date(p.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              ))}

              {/* Add more card */}
              <div
                onClick={() => setShowModal(true)}
                style={{ background: "transparent", border: "2px dashed #2A2A2A", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", minHeight: 200, transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#E5391F"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#2A2A2A"}>
                <div style={{ fontSize: 28, marginBottom: 8, color: "#333" }}>+</div>
                <div style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Add another product</div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>No extra charge</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alerts tab */}
      {tab === "alerts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {products.length === 0 ? (
            <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center", color: "#555" }}>
              Add products first to see alerts.
            </div>
          ) : (
            [
              { title: "Counterfeit detected — Kano North",  body: "A fake pack was scanned in Kano North market. 91% confidence. NAFDAC has been notified.",    color: "#E53935", time: "2 minutes ago"  },
              { title: "Counterfeit detected — Lagos Island", body: "Another fake detected. 3rd detection this week in Lagos Island.",                               color: "#E53935", time: "1 hour ago"    },
              { title: "Product registered successfully",     body: "Your product has been added to the Mantios verification pipeline.",                           color: "#43A047", time: "Just now"       },
            ].map((alert, i) => (
              <div key={i} style={{ background: "#141414", border: `1px solid ${alert.color}30`, borderLeft: `3px solid ${alert.color}`, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: alert.color, marginBottom: 4 }}>{alert.title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{alert.body}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#444", flexShrink: 0, marginLeft: 16 }}>{alert.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 14, padding: "28px", width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Add Product</div>
              <button onClick={() => { setShowModal(false); setError(null); }} style={{ background: "transparent", border: "none", color: "#555", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            {[
              ["Product Name",        "product_name",  "e.g. Coartem 20/120mg",   "text"],
              ["NAFDAC Reg. Number",  "nafdac_number", "e.g. A4-1234",            "text"],
              ["Pantone Colour Code", "pantone_code",  "e.g. 186C (optional)",    "text"],
              ["Batch Code Format",   "batch_format",  "e.g. MM-YYYY (optional)", "text"],
            ].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{label}</label>
                <input
                  placeholder={ph}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  style={inp} />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} style={{ ...inp, appearance: "none" }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>

            {error && (
              <div style={{ fontSize: 11, color: "#E53935", marginBottom: 14, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowModal(false); setError(null); }}
                style={{ background: "transparent", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "11px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button
                onClick={addProduct}
                disabled={saving || !form.product_name || !form.nafdac_number}
                style={{ flex: 1, background: "#7B0027", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: saving || !form.product_name || !form.nafdac_number ? 0.6 : 1 }}>
                {saving ? "Adding..." : "Add Product →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}