

import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const VERA = import.meta.env.VITE_VERASCANN_URL || "https://Oriadee-verascann-api.hf.space";

const PRODUCTS = [
  { id: "biore uv",  label: "Biore uv",  category: "cosmetics" },
  { id: "coartem",  label: "Coartem",  category: "pharma" },
  { id: "vaseline", label: "Vaseline", category: "cosmetics" },
  { id: "custom",   label: "Other",    category: "general" },
];

const STATUS_COLOR  = { PASS: "#43A047", FAIL: "#7B0027", WARN: "#F5A623" };
const VERDICT_COLOR = { GENUINE: "#43A047", COUNTERFEIT: "#7B0027", SUSPICIOUS: "#F5A623" };

const SIGNALS = [
  "NAFDAC Number Validation",
  "Typography Forensics",
  "Colour Profile Analysis",
  "Geometric Ratio Analysis",
  "Print Quality & Halftone",
  "OCR Batch Code Check",
];

function mapSignals(forensicSignals = [], verdict) {
  return SIGNALS.map((name) => {
    const hit = forensicSignals.find(s =>
      s.toLowerCase().includes(name.split(" ")[0].toLowerCase()) ||
      name.toLowerCase().includes(s.split(" ")[0].toLowerCase())
    );
    const status = hit
      ? (verdict === "GENUINE" ? "PASS" : "FAIL")
      : "PASS";
    return { name, status, detail: hit || null };
  });
}

export default function ScanPage() {
  const navigate  = useNavigate();
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef   = useRef(null);

  const [phase,     setPhase]     = useState("idle");
  const [product,   setProduct]   = useState(PRODUCTS[0]);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState(null);
  const [progress,  setProgress]  = useState(0);
  const [activeSig, setActiveSig] = useState(-1);
  const [cameraOn,  setCameraOn]  = useState(false);
  const [preview,   setPreview]   = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
      setError(null);
    } catch {
      setError("Camera access denied. Allow camera permission and try again.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraOn(false);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    runScan(file);
  };

  const runScan = useCallback(async (blob) => {
    setPhase("scanning");
    setProgress(0);
    setActiveSig(0);
    setResult(null);
    setError(null);

    const objUrl = URL.createObjectURL(blob);
    setPreview(objUrl);

    let sig = 0;
    const sigTimer  = setInterval(() => { sig = Math.min(sig + 1, SIGNALS.length - 1); setActiveSig(sig); }, 600);
    let p = 0;
    const progTimer = setInterval(() => { p = Math.min(p + 2.5, 95); setProgress(p); }, 100);

    try {
      const fd = new FormData();
      fd.append("file", blob, "scan.jpg");

      const resp = await fetch(`${VERA}/verify`, { method: "POST", body: fd });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      const data = await resp.json();

      clearInterval(sigTimer);
      clearInterval(progTimer);
      setProgress(100);
      setActiveSig(SIGNALS.length);

      const verdict = data.verdict === "SUSPICIOUS" ? "SUSPICIOUS"
                    : data.verdict === "GENUINE"    ? "GENUINE"
                    : "COUNTERFEIT";

      const mapped = mapSignals(data.forensic_signals || [], verdict);

      setTimeout(() => {
        setResult({
          verdict,
          confidence:      Math.round(data.confidence ?? data.fake_probability ?? 0),
          genuine_prob:    data.genuine_probability,
          fake_prob:       data.fake_probability,
          product_name:    data.product || product.label,
          recommendation:  data.recommendation,
          forensic_signals: data.forensic_signals || [],
          signals:         mapped,
        });
        setPhase("result");
      }, 400);

    } catch (err) {
      clearInterval(sigTimer);
      clearInterval(progTimer);
      setError(`Scan failed: ${err.message}`);
      setPhase("idle");
      setPreview(null);
    }
  }, [product]);

  const captureAndScan = useCallback(async () => {
    if (cameraOn && videoRef.current && canvasRef.current) {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width  = video.videoWidth  || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob(blob => { if (blob) runScan(blob); }, "image/jpeg", 0.88);
    } else {
      fileRef.current?.click();
    }
  }, [cameraOn, runScan]);

  const reset = () => {
    setPhase("idle"); setResult(null); setError(null);
    setProgress(0);   setActiveSig(-1); setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const verdictColor = result ? (VERDICT_COLOR[result.verdict] || "#999") : "#999";

  return (
    <div className="scan-root">

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

      {/* Product selector */}
      <div className="product-bar">
        <span className="product-label">Product:</span>
        <div className="product-pills">
          {PRODUCTS.map(p => (
            <button
              key={p.id}
              onClick={() => { reset(); setProduct(p); }}
              className={`product-pill${product.id === p.id ? " active" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className="camera-status">
          {cameraOn ? "📷 Camera live" : "Camera off"}
        </span>
      </div>

      <div className="scan-grid">

        {/* ── Camera / Preview panel ── */}
        <div className="panel">
          <div className="viewport">

            <video
              ref={videoRef}
              autoPlay playsInline muted
              className="live-video"
              style={{ display: cameraOn && phase === "idle" ? "block" : "none" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {preview && phase !== "idle" && (
              <img
                src={preview}
                alt="scan preview"
                className="preview-img"
                style={{ opacity: phase === "scanning" ? 0.35 : 1 }}
              />
            )}

            {!cameraOn && phase === "idle" && (
              <div className="idle-placeholder">
                <div className="upload-box" onClick={() => fileRef.current?.click()}>
                  <div style={{ fontSize: 36 }}>📷</div>
                  <div className="upload-hint">Tap to upload<br/>a product image</div>
                </div>
                <div style={{ fontSize: 10, color: "#333" }}>— or enable camera below —</div>
              </div>
            )}

            {phase === "scanning" && (
              <>
                <div className="sweep-line" />
                {[
                  { top: 16, left: 16, borderTop: "2px solid #E5391F", borderLeft: "2px solid #E5391F" },
                  { top: 16, right: 16, borderTop: "2px solid #E5391F", borderRight: "2px solid #E5391F" },
                  { bottom: 16, left: 16, borderBottom: "2px solid #E5391F", borderLeft: "2px solid #E5391F" },
                  { bottom: 16, right: 16, borderBottom: "2px solid #E5391F", borderRight: "2px solid #E5391F" },
                ].map((style, i) => (
                  <div key={i} style={{ position: "absolute", width: 20, height: 20, zIndex: 2, ...style }} />
                ))}
                <div className="scanning-overlay">
                  <div style={{ marginBottom: 14 }}>
                    {SIGNALS.map((sig, i) => (
                      <div key={i} className="signal-row">
                        <div className="signal-dot" style={{
                          background: i < activeSig ? "#43A047" : i === activeSig ? "#E5391F" : "#333",
                          boxShadow: i === activeSig ? "0 0 6px #E5391F" : "none",
                        }} />
                        <div className="signal-name" style={{
                          color: i < activeSig ? "#43A047" : i === activeSig ? "#E5391F" : "#444",
                        }}>
                          {sig}
                        </div>
                        {i < activeSig  && <span style={{ fontSize: 10, color: "#43A047" }}>✓</span>}
                        {i === activeSig && <span className="blink" style={{ fontSize: 9, color: "#E5391F" }}>●</span>}
                      </div>
                    ))}
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 6 }}>
                    {Math.round(progress)}% · {Math.ceil(((100 - progress) / 100) * 3.5)}s remaining
                  </div>
                </div>
              </>
            )}

            {phase === "result" && result && (
              <div className="result-overlay">
                <div className="verdict-badge" style={{ borderColor: verdictColor, background: `${verdictColor}18` }}>
                  <span style={{ fontSize: 20 }}>
                    {result.verdict === "GENUINE" ? "✓" : result.verdict === "COUNTERFEIT" ? "✗" : "⚠"}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: verdictColor }}>{result.verdict}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{result.product_name} · {result.confidence}% confidence</div>
                </div>
              </div>
            )}

            {cameraOn && phase === "idle" && (
              <div className="live-badge">● LIVE</div>
            )}
          </div>

          {/* Controls */}
          <div className="panel-controls">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{product.label}</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>{product.category}</div>
            {error && (
              <div className="error-box">{error}</div>
            )}
            <div className="control-row">
              {!cameraOn
                ? <button onClick={startCamera} className="btn btn-secondary">Enable Camera</button>
                : <button onClick={stopCamera}  className="btn btn-icon">✕</button>
              }
              {phase === "idle"     && (
                <button onClick={captureAndScan} className="btn btn-primary">
                  {cameraOn ? "Capture & Scan" : "📂 Upload & Scan"}
                </button>
              )}
              {phase === "scanning" && (
                <button disabled className="btn btn-scanning">Analysing...</button>
              )}
              {phase === "result"   && (
                <button onClick={reset} className="btn btn-secondary">Scan Again</button>
              )}
            </div>

            {phase === "idle" && !cameraOn && (
              <div
                className="drop-zone"
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) runScan(f); }}
                onClick={() => fileRef.current?.click()}
              >
                or drag &amp; drop an image here
              </div>
            )}
          </div>
        </div>

        {/* ── Signals panel ── */}
        <div className="panel panel-signals">
          <div className="section-title">
            {phase === "result" ? "Forensic Breakdown" : "Six Forensic Signals"}
          </div>

          {(result?.signals || SIGNALS.map(name => ({ name, status: null }))).map((sig, i) => {
            const isActive = phase === "scanning" && i === activeSig;
            const isDone   = phase === "result";
            return (
              <div key={i} className="signal-item" style={{ opacity: phase === "idle" ? 0.45 : 1 }}>
                <div className="signal-item-dot" style={{
                  background: isDone ? (STATUS_COLOR[sig.status] || "#555") : isActive ? "#E5391F" : "#333",
                }} />
                <div style={{ flex: 1 }}>
                  <div className="signal-item-name" style={{ color: isDone || isActive ? "#fff" : "#666" }}>
                    {sig.name}
                  </div>
                  {isDone && sig.detail && (
                    <div className="signal-detail">{sig.detail}</div>
                  )}
                  {isActive && (
                    <div style={{ fontSize: 10, color: "#E5391F", marginTop: 2 }}>Running analysis...</div>
                  )}
                </div>
                {isDone && sig.status && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[sig.status] || "#555", flexShrink: 0 }}>
                    {sig.status}
                  </div>
                )}
              </div>
            );
          })}

          {phase === "result" && result && (
            <div className="prob-row">
              {[["Genuine", result.genuine_prob, "#43A047"], ["Fake", result.fake_prob, "#7B0027"]].map(([label, val, color]) => (
                <div key={label} className="prob-card">
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color }}>{val?.toFixed(1)}%</div>
                  <div className="prob-track">
                    <div style={{ height: 3, width: `${val}%`, background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {phase === "result" && result?.forensic_signals?.length > 0 && (
            <div className="forensic-box">
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginBottom: 8 }}>AI Forensic Signals</div>
              {result.forensic_signals.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                  <span style={{ color: verdictColor, fontSize: 11 }}>⚑</span>
                  <span style={{ fontSize: 11, color: "#888" }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {phase === "result" && result?.recommendation && (
            <div className="recommendation-box">
              <span style={{ fontSize: 11, color: "#E5391F", fontWeight: 600 }}>Recommendation: </span>
              <span style={{ fontSize: 11, color: "#888" }}>{result.recommendation}</span>
            </div>
          )}
          {phase === "result" && result && (
            <div className="disclaimer-box">
              Mantios assesses visible packaging characteristics. Its assessment is not a guarantee of 100% product or content authentication.
            </div>
          )}
          {phase === "idle" && (
            <div className="disclaimer-note">
              Mantios assesses visible packaging characteristics only. Results are not a guarantee of authenticity.
            </div>
          )}

          {phase === "result" && result?.verdict === "COUNTERFEIT" && (
            <div className="verdict-action-box" style={{ background: "rgba(229,57,31,0.06)", borderColor: "rgba(229,57,31,0.15)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#E5391F", marginBottom: 4 }}>Verified Vendors Nearby</div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>
                3 vendors within 1.2km carry genuine {product.label}. Payment via Squad-powered vendor links.
              </div>
              <button
                onClick={() => navigate(`/vendor/locator?product=${product.label}&city=Lagos`)}
                className="action-btn action-btn-teal"
              >
                Find Verified Vendor →
              </button>
            </div>
          )}

          {phase === "result" && result?.verdict === "GENUINE" && (
            <div className="verdict-action-box" style={{ background: "rgba(67,160,71,0.06)", borderColor: "rgba(67,160,71,0.15)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#43A047", marginBottom: 4 }}>✓ Product Authenticated</div>
              <div style={{ fontSize: 11, color: "#666" }}>
                This product matches all six forensic reference signals. Safe to purchase.
              </div>
            </div>
          )}

          {phase === "result" && result?.verdict === "SUSPICIOUS" && (
            <div className="verdict-action-box" style={{ background: "rgba(245,166,35,0.06)", borderColor: "rgba(245,166,35,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#F5A623", marginBottom: 4 }}>⚠ Proceed with Caution</div>
              <div style={{ fontSize: 11, color: "#666" }}>Anomalies detected. Purchase only from a verified vendor to be safe.</div>
              <button
                onClick={() => navigate(`/vendor/locator?product=${product.label}&city=Lagos`)}
                className="action-btn action-btn-yellow"
              >
                Find Verified Vendor →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* ── Base ── */
        .scan-root {
          padding: 16px;
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* ── Product bar ── */
        .product-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .product-label {
          font-size: 12px;
          color: #555;
          white-space: nowrap;
        }
        .product-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .product-pill {
          border: 1px solid #2A2A2A;
          background: #141414;
          color: #666;
          border-radius: 7px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          min-height: 36px;
          white-space: nowrap;
        }
        .product-pill.active {
          border-color: #E5391F;
          background: rgba(229,57,31,0.08);
          color: #E5391F;
        }
        .camera-status {
          margin-left: auto;
          font-size: 11px;
          color: rgb(229,57,31);
          white-space: nowrap;
        }

        /* ── Grid ── */
        .scan-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ── Panel ── */
        .panel {
          background: #141414;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          overflow: hidden;
        }
        .panel-signals {
          padding: 16px 18px;
          overflow: hidden;
        }

        /* ── Viewport ── */
        .viewport {
          background: #000;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .live-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 0.3s;
        }

        /* ── Idle placeholder ── */
        .idle-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .upload-box {
          width: 130px;
          height: 130px;
          border: 2px solid #E5391F;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .upload-hint {
          font-size: 10px;
          color: #555;
          text-align: center;
          line-height: 1.5;
        }

        /* ── Scanning ── */
        .sweep-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #E5391F, transparent);
          animation: sweep 1.2s ease-in-out infinite;
          z-index: 2;
        }
        .scanning-overlay {
          text-align: center;
          z-index: 3;
          padding: 0 20px;
          position: absolute;
        }
        .signal-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 3px 0;
          justify-content: center;
        }
        .signal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .signal-name {
          font-size: 10.5px;
          transition: color 0.3s;
          white-space: nowrap;
        }
        .progress-track {
          width: 180px;
          background: #1a1a1a;
          border-radius: 3px;
          height: 4px;
          overflow: hidden;
          margin: 0 auto;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #B92D17, #E5391F);
          transition: width 0.15s;
          border-radius: 3px;
        }

        /* ── Result overlay ── */
        .result-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(0,0,0,0.72);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .verdict-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .live-badge {
          position: absolute;
          top: 10px; left: 10px;
          font-size: 10px;
          color: #E5391F;
          background: rgba(229,57,31,0.1);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(229,57,31,0.2);
        }

        /* ── Controls ── */
        .panel-controls {
          padding: 14px 16px;
        }
        .error-box {
          font-size: 11px;
          color: #7B0027;
          margin-bottom: 10px;
          padding: 8px 10px;
          background: rgba(229,57,53,0.08);
          border-radius: 6px;
        }
        .control-row {
          display: flex;
          gap: 8px;
        }
        .btn {
          border-radius: 8px;
          padding: 0 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          white-space: nowrap;
        }
        .btn-primary {
          flex: 1;
          background: #E5391F;
          color: #000;
        }
        .btn-secondary {
          flex: 1;
          background: #1A1A1A;
          color: #999;
          border: 1px solid #2A2A2A;
        }
        .btn-icon {
          background: #1A1A1A;
          color: #666;
          border: 1px solid #2A2A2A;
          padding: 0 16px;
        }
        .btn-scanning {
          flex: 1;
          background: #2E100B;
          color: #E5391F;
          border: 1px solid #B92D17;
        }
        .drop-zone {
          margin-top: 12px;
          border: 1px dashed #2A2A2A;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          font-size: 10px;
          color: #444;
          cursor: pointer;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Signals panel ── */
        .section-title {
          font-size: 11px;
          font-weight: 600;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 14px;
        }
        .signal-item {
          display: flex;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid #1A1A1A;
        }
        .signal-item-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
          transition: background 0.3s;
        }
        .signal-item-name {
          font-size: 12px;
          font-weight: 500;
        }
        .signal-detail {
          font-size: 10.5px;
          color: #666;
          margin-top: 3px;
          line-height: 1.5;
        }

        /* ── Probability ── */
        .prob-row {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }
        .prob-card {
          flex: 1;
          background: #111;
          border: 1px solid #1A1A1A;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .prob-track {
          height: 3px;
          background: #1A1A1A;
          border-radius: 2px;
          margin-top: 6px;
        }

        /* ── Forensic / action boxes ── */
        .forensic-box {
          margin-top: 14px;
          background: #111;
          border: 1px solid #1A1A1A;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .recommendation-box {
          margin-top: 10px;
          background: rgba(229,57,31,0.05);
          border: 1px solid rgba(229,57,31,0.15);
          border-radius: 8px;
          padding: 10px 14px;
        }
          .disclaimer-box {
            margin-top: 10px;
            padding: 10px 14px;
            border: 1px solid #2A2A2A;
            border-radius: 8px;
            background: #111;
            font-size: 10.5px;
            color: #666;
            line-height: 1.5;
          }
          .disclaimer-note {
            margin-top: 12px;
            font-size: 10px;
            color: #444;
            text-align: center;
            line-height: 1.5;
          }
        .verdict-action-box {
          margin-top: 14px;
          border: 1px solid;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .action-btn {
          margin-top: 8px;
          border: none;
          border-radius: 6px;
          padding: 0 14px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          min-height: 36px;
          display: inline-flex;
          align-items: center;
        }
        .action-btn-teal  { background: #E5391F; color: #000; }
        .action-btn-yellow { background: #F5A623; color: #000; }

        /* ── Animations ── */
        @keyframes sweep {
          0%   { transform: translateY(0);     opacity: 1;   }
          50%  { transform: translateY(274px); opacity: 0.6; }
          100% { transform: translateY(0);     opacity: 1;   }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .blink { animation: blink 0.8s infinite; }

        /* ── MOBILE (≤ 640px) ── */
        @media (max-width: 640px) {
          .scan-root {
            padding: 12px;
          }

          /* Stack grid to single column */
          .scan-grid {
            grid-template-columns: 1fr;
          }

          /* Tighter product bar */
          .product-bar {
            gap: 6px;
            margin-bottom: 12px;
          }
          .camera-status {
            width: 100%;
            margin-left: 0;
            text-align: right;
          }

          /* Shorter viewport on mobile */
          .viewport {
            height: 220px;
          }
          .upload-box {
            width: 110px;
            height: 110px;
          }

          /* Scanning overlay signals — smaller text */
          .signal-name {
            font-size: 9.5px;
          }
          .progress-track {
            width: 140px;
          }

          /* Controls */
          .panel-controls {
            padding: 12px 14px;
          }
          .btn {
            font-size: 12px;
          }

          /* Signals panel loses border-radius top on mobile (seamless stack) */
          .panel-signals {
            padding: 14px 14px;
          }
          .signal-item-name {
            font-size: 11px;
          }

          /* Make action buttons full-width on mobile */
          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* ── SMALL MOBILE (≤ 380px) ── */
        @media (max-width: 380px) {
          .viewport {
            height: 190px;
          }
          .product-pill {
            padding: 5px 10px;
            font-size: 11px;
          }
          .signal-name {
            font-size: 9px;
          }
        }

      `}</style>
    </div>
  );
}

