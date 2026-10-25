import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import axios                   from "axios";

const API = import.meta.env.VITE_API_URL;

export default function VendorPortal() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [vendor,    setVendor]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("products");
  const [editing,   setEditing]   = useState(false);
  const [products,  setProducts]  = useState([]);
  const [saving,    setSaving]    = useState(false);

  const token   = localStorage.getItem("vs_token");
  const headers = { Authorization: `Bearer ${token}` };



  useEffect(() => {
    axios.get(`${API}/api/vendors/me`, { headers })
      .then(r => {
        setVendor(r.data.vendor);
        setProducts(r.data.vendor.products || []);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  const saveProducts = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`${API}/api/vendors/me/products`, { products }, { headers });
      setVendor(data.vendor);
      setProducts(data.vendor.products || []);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.error || "Save failed");
    } finally { setSaving(false); }
  };

  // const updateProduct = (i, key, val) => {
  //   const updated = [...products];
  //   updated[i] = { ...updated[i], [key]: val };
  //   setProducts(updated);
  // };

  // const addProduct = () => setProducts(p => [...p, { name: "", price: 0, in_stock: true }]);

    const addProduct = () =>
  setProducts((p) => [
    ...p,
    {
      name: "",
      price: 0,
      delivery_fee: 0,
      in_stock: true,
    },
  ]);

const updateProduct = (i, key, val) => {
  const updated = [...products];
  updated[i] = { ...updated[i], [key]: val };
  setProducts(updated);
};


  const removeProduct = (i) => setProducts(p => p.filter((_, j) => j !== i));

  if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading vendor portal...</div>;
  if (!vendor) return null;

  const inp = { background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: 6, padding: "7px 10px", fontSize: 12, color: "#fff", outline: "none", fontFamily: "inherit" };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#E5391F", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Vendor Portal</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{vendor.pharmacy_name}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{vendor.address}, {vendor.city} · {vendor.phone}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: vendor.status === "active" ? "#43A047" : "#F5A623", fontWeight: 700, textTransform: "uppercase", background: vendor.status === "active" ? "rgba(67,160,71,0.1)" : "rgba(245,166,35,0.1)", border: `1px solid ${vendor.status === "active" ? "#43A047" : "#F5A623"}`, borderRadius: 6, padding: "4px 10px", display: "inline-block" }}>
            {vendor.status === "active" ? "✓ Active on network" : "Pending activation"}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Products listed",      value: vendor.products?.length || 0,  color: "#E5391F" },
          { label: "Customers directed",   value: vendor.orders_count || 0,      color: "#fff"    },
          { label: "Revenue via Paystack",    value: `₦${(vendor.revenue || 0).toLocaleString()}`, color: "#43A047" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #2A2A2A", marginBottom: 20 }}>
        {["products", "orders", "settings"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "#E5391F" : "transparent"}`, color: tab === t ? "#E5391F" : "#555", padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", marginBottom: -1 }}>
            {t}
          </button>
        ))}
      </div>

      {/* Products tab */}
    {tab === "products" && (
  <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>Your Products & Prices</div>
      <div style={{ display: "flex", gap: 8 }}>
        {editing && (
          <>
            <button onClick={() => { setEditing(false); setProducts(vendor.products || []); }}
              style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 7, padding: "7px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
            <button onClick={saveProducts} disabled={saving}
              style={{ background: "#E5391F", color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
        <button
          onClick={() => {
            setEditing(true);
            setProducts(p => [...p, { name: "", price: 0, in_stock: true }]);
          }}
          style={{ background: "#E5391F", color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          + Add Product
        </button>
        {!editing && products.length > 0 && (
          <button onClick={() => setEditing(true)}
            style={{ background: "transparent", color: "#E5391F", border: "1px solid rgba(229,57,31,0.3)", borderRadius: 7, padding: "7px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            Edit Prices
          </button>
        )}
      </div>
    </div>

    {products.length === 0 ? (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No products listed yet</div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>Add the genuine products you stock with their prices. Customers pay you via Paystack.</div>
        <button
          onClick={() => {
            setEditing(true);
            setProducts([{ name: "", price: 0, in_stock: true }]);
          }}
          style={{ background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          + Add First Product
        </button>
      </div>
    ) : (
      <>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 130px 110px 40px", gap: 10, padding: "6px 10px", marginBottom: 6 }}>
          {["Product Name", "Price (₦)", "Delivery (₦)", "In Stock", ""].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
          ))}
        </div>

       {products.map((p, i) => (
  <div
    key={i}
    style={{ display: "grid", gridTemplateColumns: "1fr 130px 130px 110px 40px", gap: 10, padding: "10px", background: i % 2 === 0 ? "#111" : "transparent", borderRadius: 6, marginBottom: 8 }}>
                  {editing ? (
              <>
                <input
                  value={p.name}
                  placeholder="Product name"
                  onChange={e => updateProduct(i, "name", e.target.value)}
                  style={{ background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#fff", outline: "none", fontFamily: "inherit", width: "100%" }}
                />

                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 12 }}>₦</span>
                  <input
                    type="number"
                    value={p.price || ""}
                    placeholder="0"
                    onChange={e => updateProduct(i, "price", Number(e.target.value))}
                    style={{ background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: 6, padding: "8px 10px", paddingLeft: 22, fontSize: 12, color: "#fff", outline: "none", fontFamily: "inherit", width: "100%" }}
                  />
                </div>

                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 12 }}>₦</span>
                  <input
                    type="number"
                    value={p.delivery_fee || ""}
                    placeholder="0"
                    onChange={e => updateProduct(i, "delivery_fee", Number(e.target.value))}
                    style={{ background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: 6, padding: "8px 10px", paddingLeft: 22, fontSize: 12, color: "#fff", outline: "none", fontFamily: "inherit", width: "100%" }}
                  />
                </div>

                <button
                  onClick={() => updateProduct(i, "in_stock", !p.in_stock)}
                  style={{ background: p.in_stock ? "rgba(67,160,71,0.1)" : "rgba(229,57,53,0.1)", color: p.in_stock ? "#43A047" : "#E53935", border: `1px solid ${p.in_stock ? "#43A047" : "#E53935"}`, borderRadius: 6, padding: "7px 10px", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "inherit" }}
                >
                  {p.in_stock ? "In Stock" : "Out of Stock"}
                </button>

                <button
                  onClick={() => removeProduct(i)}
                  style={{ background: "transparent", border: "1px solid #2A2A2A", color: "#555", borderRadius: 6, padding: "7px", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, color: "#fff" }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "#E5391F", fontWeight: 600 }}>₦{(p.price || 0).toLocaleString()}</div>
                <div style={{ fontSize: 13, color: "#fff" }}>₦{(p.delivery_fee || 0).toLocaleString()}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: p.in_stock ? "#43A047" : "#E53935" }}>
                  {p.in_stock ? "✓ In Stock" : "Out of Stock"}
                </div>
                <div />
              </>
            )}
          </div>
        ))}

        {editing && (
          <button
            onClick={addProduct}
            style={{ width: "100%", background: "transparent", border: "2px dashed #2A2A2A", color: "#555", borderRadius: 8, padding: "11px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginTop: 10, transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#E5391F"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#2A2A2A"}>
            + Add Another Product
          </button>
        )}
      </>
    )}
  </div>
)}

      {/* Orders tab */}
      {/* {tab === "orders" && (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Incoming Orders via Paystack</div>
          <div style={{ padding: "32px 0", textAlign: "center", color: "#555" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>No orders yet</div>
            <div style={{ fontSize: 11 }}>When customers scan a fake product near you, they'll be directed here. Paystack payments will appear as they come in.</div>
          </div>
        </div>
      )} */}
      {tab === "orders" && (
  <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Incoming Customer Orders</div>
    <div style={{ fontSize: 11, color: "#555", marginBottom: 20 }}>Customers directed here after scanning a fake product near you</div>

    <div style={{ background: "rgba(229,57,31,0.05)", border: "1px solid rgba(229,57,31,0.15)", borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: "#E5391F", fontWeight: 600, marginBottom: 4 }}>How it works</div>
      <div style={{ fontSize: 11, color: "#666", lineHeight: 1.7 }}>
        1. Customer scans a fake product near your location<br/>
        2. Mantios directs them to your vendor<br/>
        3. They pay via Paystack and get a receipt code<br/>
        4. They show you the code — you verify and hand over the product<br/>
        5. Payment arrives in your Paystack account automatically
      </div>
    </div>

    {/* Mock recent orders — replace with real data when Paystack webhooks fire */}
    {vendor.orders_count > 0 ? (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Receipt Code", "Product", "Amount", "Status", "Time"].map(h => (
              <th key={h} style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 10px", textAlign: "left", borderBottom: "1px solid #222" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #1A1A1A" }}>
            <td style={{ padding: "10px", fontSize: 12, color: "#E5391F", fontFamily: "monospace" }}>VS-ABC123</td>
            <td style={{ padding: "10px", fontSize: 12, color: "#fff" }}>Coartem</td>
            <td style={{ padding: "10px", fontSize: 12, color: "#43A047", fontWeight: 600 }}>₦4,500</td>
            <td style={{ padding: "10px" }}><span style={{ fontSize: 10, color: "#43A047", background: "rgba(67,160,71,0.1)", padding: "2px 8px", borderRadius: 4 }}>Paid</span></td>
            <td style={{ padding: "10px", fontSize: 11, color: "#444" }}>2m ago</td>
          </tr>
        </tbody>
      </table>
    ) : (
      <div style={{ padding: "32px 0", textAlign: "center", color: "#555" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>No orders yet</div>
        <div style={{ fontSize: 11, lineHeight: 1.6 }}>
          Once customers scan fake products near <strong style={{ color: "#fff" }}>{vendor.city}</strong> and get directed to you, their orders appear here with receipt codes to verify.
        </div>
      </div>
    )}
  </div>
)}

      {/* Settings tab */}
      {tab === "settings" && (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Account Settings</div>
          {[
            ["Vendor Name",  vendor.pharmacy_name],
            ["Owner Name",     vendor.owner_name],
            ["Email",          vendor.email],
            ["Phone",          vendor.phone],
            ["Address",        `${vendor.address}, ${vendor.city}, ${vendor.state}`],
            ["Network Status", vendor.status],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #1A1A1A", fontSize: 13 }}>
              <span style={{ color: "#555" }}>{k}</span>
              <span style={{ color: k === "Network Status" ? (v === "active" ? "#43A047" : "#F5A623") : "#fff", textTransform: k === "Network Status" ? "capitalize" : "none" }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}