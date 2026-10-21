













































































import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const RISK_COLOR = { HIGH: "#E53935", MEDIUM: "#F5A623", LOW: "#43A047" };
const V_COLOR = { GENUINE: "#43A047", COUNTERFEIT: "#E53935", SUSPICIOUS: "#F5A623" };

function NigeriaMap({ heatmap }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const REGION_COORDS = {
    "Kano North":     { lat: 12.0022, lng: 8.5920 },
    "Lagos Island":   { lat: 6.4541,  lng: 3.3947 },
    "Onitsha":        { lat: 6.1420,  lng: 6.7870 },
    "Abuja Central":  { lat: 9.0579,  lng: 7.4951 },
    "Port Harcourt":  { lat: 4.8156,  lng: 7.0498 },
    "Ibadan":         { lat: 7.3775,  lng: 3.9470 },
  };

  const RISK_LEAFLET_COLOR = {
    HIGH:   { fill: "#E53935", glow: "rgba(229,57,53,0.35)" },
    MEDIUM: { fill: "#F5A623", glow: "rgba(245,166,35,0.35)" },
    LOW:    { fill: "#43A047", glow: "rgba(67,160,71,0.35)" },
  };

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && heatmap?.length) {
      addMarkers();
    }
  }, [heatmap, mapInstanceRef.current]);

  function initMap() {
    const L = window.L;
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [9.082, 8.6753],
      zoom: 6,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 19 }
    ).addTo(map);

    L.control.attribution({ prefix: false })
      .addAttribution('© <a href="https://carto.com/">CARTO</a>')
      .addTo(map);

    mapInstanceRef.current = map;
    addMarkers();
  }

  function addMarkers() {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const maxCount = Math.max(...heatmap.map((h) => h.count));

    heatmap.forEach((zone) => {
      const coords = REGION_COORDS[zone.region];
      if (!coords) return;

      const colors = RISK_LEAFLET_COLOR[zone.risk] || RISK_LEAFLET_COLOR.LOW;
      const size = 16 + Math.round((zone.count / maxCount) * 28); // 16–44px
      const pulseSize = size + 16;

      const html = `
        <div style="position:relative;width:${size}px;height:${size}px;">
          <div style="
            position:absolute;
            top:50%;left:50%;
            transform:translate(-50%,-50%);
            width:${pulseSize}px;height:${pulseSize}px;
            border-radius:50%;
            background:${colors.glow};
            animation:nafdac-pulse 2s ease-in-out infinite;
          "></div>
          <div style="
            position:absolute;
            top:50%;left:50%;
            transform:translate(-50%,-50%);
            width:${size}px;height:${size}px;
            border-radius:50%;
            background:${colors.fill};
            border:2px solid rgba(255,255,255,0.6);
            display:flex;align-items:center;justify-content:center;
            font-size:${size > 28 ? 11 : 9}px;
            font-weight:700;
            color:#fff;
            font-family:monospace;
            box-shadow:0 0 12px ${colors.glow};
            cursor:pointer;
          ">${zone.count}</div>
        </div>
      `;

      const icon = L.divIcon({
        html,
        className: "",
        iconSize: [pulseSize, pulseSize],
        iconAnchor: [pulseSize / 2, pulseSize / 2],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon }).addTo(map);

      marker.on("click", () => {
        setSelected(zone);
      });

      marker.bindTooltip(
        `<div style="background:#111;border:1px solid #333;border-radius:6px;padding:8px 12px;color:#fff;font-family:monospace;font-size:12px;line-height:1.6">
          <strong style="color:${colors.fill}">${zone.region}</strong><br/>
          Scans: <strong>${zone.count}</strong><br/>
          Product: ${zone.product}<br/>
          Risk: <span style="color:${colors.fill};font-weight:700">${zone.risk}</span>
        </div>`,
        { permanent: false, direction: "top", offset: [0, -10], opacity: 1, className: "nafdac-tooltip" }
      );
    });
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Inject pulse animation */}
      <style>{`
        @keyframes nafdac-pulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          50%      { transform: translate(-50%,-50%) scale(1.5); opacity: 0.2; }
        }
        .nafdac-tooltip .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>

      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: 420,
          borderRadius: 10,
          overflow: "hidden",
          background: "#0d0d0d",
        }}
      />

      {/* Selected zone detail card */}
      {selected && (
        <div style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(14,14,14,0.96)",
          border: `1px solid ${RISK_COLOR[selected.risk]}40`,
          borderRadius: 10,
          padding: "14px 18px",
          minWidth: 200,
          zIndex: 1000,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{selected.region}</div>
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: RISK_COLOR[selected.risk],
                background: `${RISK_COLOR[selected.risk]}18`,
                border: `1px solid ${RISK_COLOR[selected.risk]}`,
                borderRadius: 4, padding: "2px 6px",
                textTransform: "uppercase",
              }}>{selected.risk}</span>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
            >×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Row label="Scans this week" value={<strong style={{ color: RISK_COLOR[selected.risk], fontSize: 20 }}>{selected.count}</strong>} />
            <Row label="Top product" value={selected.product} />
          </div>
          {selected.risk === "HIGH" && (
            <button style={{
              marginTop: 12, width: "100%",
              background: "#E53935", color: "#fff",
              border: "none", borderRadius: 7,
              padding: "8px 0", fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Deploy Field Team →
            </button>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 12, right: 12,
        background: "rgba(14,14,14,0.92)",
        border: "1px solid #2A2A2A",
        borderRadius: 8, padding: "10px 14px",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
      }}>
        <div style={{ fontSize: 10, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>Risk Level</div>
        {[["HIGH", "#E53935"], ["MEDIUM", "#F5A623"], ["LOW", "#43A047"]].map(([label, color]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
            <span style={{ fontSize: 10, color: "#999", fontWeight: 600 }}>{label}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #222", marginTop: 8, paddingTop: 8 }}>
          <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Bubble size = scan count</div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "#666" }}>{label}</span>
      <span style={{ fontSize: 12, color: "#ccc" }}>{value}</span>
    </div>
  );
}

export default function NafdacPortal() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [tab,     setTab]     = useState("overview");
  const [stats,   setStats]   = useState(null);
  const [vendors, setVendors] = useState([]);
  const [brands,  setBrands]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert,   setAlert]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vs_token");
    Promise.all([
      axios.get(`${API}/api/dashboard/stats`),
      axios.get(`${API}/api/vendors/`,  { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/api/brands/`,   { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([s, v, b]) => {
        setStats(s.data.stats);
        setVendors(v.data.vendors);
        setBrands(b.data.brands);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  const activateVendor = async (id) => {
    const token = localStorage.getItem("vs_token");
    await axios.post(`${API}/api/vendors/activate`,
      { vendor_id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setVendors(v => v.map(x => x._id === id ? { ...x, status: "active" } : x));
  };

  const activateBrand = async (id) => {
    const token = localStorage.getItem("vs_token");
    await axios.patch(`${API}/api/brands/${id}/activate`, {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBrands(b => b.map(x => x._id === id ? { ...x, status: "active" } : x));
  };

  if (loading) return (
    <div style={{ padding: 40, color: "#555", textAlign: "center" }}>
      Loading intelligence data...
    </div>
  );
  if (!stats) return null;

  const TABS = ["overview", "scans", "vendors", "brands"];

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>NAFDAC Intelligence Dashboard</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Full administrative access · Nigeria-wide intelligence</div>
        </div>
        <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "10px 16px", textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#F5A623", marginBottom: 2 }}>ACCESS LEVEL</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>NAFDAC Officer · Full Admin</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #2A2A2A", marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "transparent", border: "none",
            borderBottom: `2px solid ${tab === t ? "#F5A623" : "transparent"}`,
            color: tab === t ? "#F5A623" : "#555",
            padding: "10px 18px", fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
            textTransform: "capitalize", marginBottom: -1,
          }}>
            {t}
            {t === "vendors" && <span style={{ marginLeft: 6, fontSize: 10, background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 10, padding: "1px 6px", color: "#666" }}>{vendors.length}</span>}
            {t === "brands"  && <span style={{ marginLeft: 6, fontSize: 10, background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 10, padding: "1px 6px", color: "#666" }}>{brands.length}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Total scans",    value: stats.total_scans.toLocaleString(),             color: "#E5391F" },
              { label: "Counterfeits",   value: stats.counterfeits_detected.toLocaleString(),   color: "#E53935" },
              { label: "Active brands",  value: `${stats.active_brands}/${stats.total_brands}`, color: "#F5A623" },
              { label: "Active vendors", value: `${stats.active_vendors}/${stats.total_vendors}`, color: "#60A5FA" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>{m.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Alert */}
          {alert && (
            <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.25)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#E53935", marginBottom: 4 }}>⚠ Active Alert — Kano North</div>
                <div style={{ fontSize: 11, color: "#666" }}>34 fake Coartem scans this week. Concentration rising. Recommend immediate field deployment.</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                <button onClick={() => setAlert(false)} style={{ background: "#E53935", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Deploy Team →</button>
                <button onClick={() => setAlert(false)} style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 12px", fontSize: 11, cursor: "pointer" }}>Dismiss</button>
              </div>
            </div>
          )}

          {/* ── HEATMAP CARD: Map + Text List ── */}
          <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>

            {/* Card header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Counterfeit Concentration Heatmap</div>
                <div style={{ fontSize: 11, color: "#555" }}>Real-time geographic intelligence · Click any marker for details</div>
              </div>
              <div style={{ fontSize: 10, color: "#43A047", background: "rgba(67,160,71,0.1)", border: "1px solid rgba(67,160,71,0.3)", borderRadius: 4, padding: "4px 8px" }}>● LIVE</div>
            </div>

            {/* Real Leaflet map */}
            <NigeriaMap heatmap={stats.heatmap} />

            {/* Divider */}
            <div style={{ borderTop: "1px solid #222", margin: "20px 0 16px" }} />

            {/* Original text rows — full fidelity */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(() => {
                const maxCount = Math.max(...stats.heatmap.map(h => h.count));
                return stats.heatmap.map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Region name */}
                    <div style={{ width: 120, fontSize: 12, color: "#999", flexShrink: 0 }}>{row.region}</div>
                    {/* Bar */}
                    <div style={{ flex: 1, background: "#111", borderRadius: 4, height: 10, overflow: "hidden" }}>
                      <div style={{
                        width: `${(row.count / maxCount) * 100}%`,
                        height: "100%",
                        background: RISK_COLOR[row.risk],
                        borderRadius: 4,
                        transition: "width 1s",
                      }} />
                    </div>
                    {/* Count */}
                    <div style={{ width: 32, fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right", flexShrink: 0 }}>{row.count}</div>
                    {/* Risk badge */}
                    <div style={{
                      width: 65, fontSize: 10, fontWeight: 700,
                      color: RISK_COLOR[row.risk],
                      textAlign: "center",
                      background: `${RISK_COLOR[row.risk]}15`,
                      border: `1px solid ${RISK_COLOR[row.risk]}`,
                      borderRadius: 4, padding: "2px 6px", flexShrink: 0,
                    }}>{row.risk}</div>
                    {/* Product */}
                    <div style={{ width: 110, fontSize: 11, color: "#555", flexShrink: 0 }}>{row.product}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── SCANS ── */}
      {tab === "scans" && (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recent Scan Activity</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Product", "Region", "Verdict", "Confidence", "Time"].map(h => (
                  <th key={h} style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", padding: "6px 10px", textAlign: "left", borderBottom: "1px solid #222" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent_activity.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1A1A1A" }}>
                  <td style={{ padding: "10px", fontSize: 12, color: "#fff" }}>{row.product}</td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#666" }}>{row.region}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: V_COLOR[row.verdict], background: `${V_COLOR[row.verdict]}18`, padding: "3px 8px", borderRadius: 4 }}>{row.verdict}</span>
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#666" }}>{row.confidence}%</td>
                  <td style={{ padding: "10px", fontSize: 11, color: "#444" }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── VENDORS ── */}
      {tab === "vendors" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Vendor Network Management</div>
            <div style={{ fontSize: 12, color: "#555" }}>{vendors.filter(v => v.status === "active").length} active · {vendors.filter(v => v.status === "pending").length} pending approval</div>
          </div>
          {vendors.length === 0 ? (
            <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center", color: "#555" }}>No vendors registered yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {vendors.map((v, i) => (
                <div key={i} style={{ background: "#141414", border: `1px solid ${v.status === "active" ? "rgba(67,160,71,0.2)" : "#2A2A2A"}`, borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{v.pharmacy_name}</div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: v.status === "active" ? "#43A047" : "#F5A623", background: v.status === "active" ? "rgba(67,160,71,0.1)" : "rgba(245,166,35,0.1)", border: `1px solid ${v.status === "active" ? "#43A047" : "#F5A623"}`, borderRadius: 4, padding: "2px 6px", textTransform: "uppercase" }}>{v.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{v.address}, {v.city}, {v.state}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(v.products || []).map((p, j) => (
                        <span key={j} style={{ fontSize: 10, color: "#555", background: "#111", border: "1px solid #222", borderRadius: 4, padding: "2px 6px" }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                    <a href={`tel:${v.phone}`} style={{ background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 12px", fontSize: 11, textDecoration: "none" }}>📞</a>
                    {v.status === "pending" && (
                      <button onClick={() => activateVendor(v._id)} style={{ background: "#43A047", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Activate →
                      </button>
                    )}
                    {v.status === "active" && (
                      <span style={{ fontSize: 11, color: "#43A047", padding: "8px 12px" }}>✓ Active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BRANDS ── */}
      {tab === "brands" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Brand Registration Management</div>
            <div style={{ fontSize: 12, color: "#555" }}>{brands.filter(b => b.status === "active").length} active · {brands.filter(b => b.status === "pending").length} pending</div>
          </div>
          {brands.length === 0 ? (
            <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center", color: "#555" }}>No brands registered yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {brands.map((b, i) => (
                <div key={i} style={{ background: "#141414", border: `1px solid ${b.status === "active" ? "rgba(229,57,31,0.2)" : "#2A2A2A"}`, borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{b.product_name}</div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: b.status === "active" ? "#E5391F" : "#F5A623", background: b.status === "active" ? "rgba(229,57,31,0.1)" : "rgba(245,166,35,0.1)", border: `1px solid ${b.status === "active" ? "#E5391F" : "#F5A623"}`, borderRadius: 4, padding: "2px 6px", textTransform: "uppercase" }}>{b.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{b.company_name} · {b.contact_email}</div>
                    <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>NAFDAC: {b.nafdac_number}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                    {b.status === "pending" && (
                      <button onClick={() => activateBrand(b._id)} style={{ background: "#E5391F", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Activate →
                      </button>
                    )}
                    {b.status === "active" && (
                      <span style={{ fontSize: 11, color: "#E5391F", padding: "8px 12px" }}>✓ Protected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}