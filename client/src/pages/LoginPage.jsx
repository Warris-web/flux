// // import { useState }       from "react";
// // import { useNavigate }    from "react-router-dom";
// // import { useAuth }        from "../context/AuthContext";

// // export default function LoginPage() {
// //   const { login }   = useAuth();
// //   const navigate    = useNavigate();
// //   const [tab,       setTab]      = useState("brand");
// //   const [email,     setEmail]    = useState("");
// //   const [password,  setPassword] = useState("");
// //   const [loading,   setLoading]  = useState(false);
// //   const [error,     setError]    = useState(null);

// //   const ROLES = [
// //     { id: "brand",  label: "Brand"          },
// //     { id: "vendor", label: "Vendor"         },
// //     // { id: "nafdac", label: "NAFDAC Officer" },
// //   ];

// //   const REDIRECTS = { brand: "/brand", vendor: "/vendor/portal", nafdac: "/dashboard" };

// //   const handleLogin = async () => {
// //     setLoading(true); setError(null);
// //     try {
// //       const user = await login(email, password);
// //       navigate(REDIRECTS[user.role] || "/");
// //     } catch (err) {
// //       setError(err.response?.data?.error || "Invalid email or password");
// //     } finally { setLoading(false); }
// //   };

// //   const inp = {
// //     width: "100%", background: "#111", border: "1px solid #2A2A2A",
// //     borderRadius: 7, padding: "11px 13px", fontSize: 13, color: "#fff",
// //     outline: "none", fontFamily: "inherit",
// //   };

// //   return (
// //     <div style={{ minHeight: "calc(100vh - 74px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
// //       <div style={{ width: "100%", maxWidth: 420 }}>
// //         <div style={{ textAlign: "center", marginBottom: 28 }}>
// //           <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
// //             Mantios Portal
// //           </div>
// //           <div style={{ fontSize: 12, color: "#555" }}>Secure access for authorized users</div>
// //         </div>

// //         {/* Role tabs */}
// //         <div style={{ display: "flex", background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
// //           {ROLES.map(r => (
// //             <button key={r.id} onClick={() => { setTab(r.id); setError(null); setEmail(""); setPassword(""); }}
// //               style={{ flex: 1, background: tab === r.id ? "#E5391F" : "transparent", color: tab === r.id ? "#000" : "#666", border: "none", borderRadius: 7, padding: "8px 4px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
// //               {r.label}
// //             </button>
// //           ))}
// //         </div>

// //         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px" }}>
// //           <div style={{ marginBottom: 18 }}>
// //             <div style={{ fontSize: 10, fontWeight: 700, color: "#E5391F", background: "rgba(229,57,31,0.1)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 4, padding: "3px 8px", display: "inline-block", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
// //               {ROLES.find(r => r.id === tab)?.label} Login
// //             </div>
// //           </div>

// //           <div style={{ marginBottom: 14 }}>
// //             <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Email</label>
// //             <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inp} />
// //           </div>

// //           <div style={{ marginBottom: 20 }}>
// //             <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Password</label>
// //             <input type="password" value={password} onChange={e => setPassword(e.target.value)}
// //               placeholder="Enter your password" style={inp}
// //               onKeyDown={e => e.key === "Enter" && handleLogin()} />
// //           </div>

// //           {error && (
// //             <div style={{ fontSize: 11, color: "#E53935", marginBottom: 14, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6, border: "1px solid rgba(229,57,53,0.2)" }}>
// //               {error}
// //             </div>
// //           )}

// //           <button onClick={handleLogin} disabled={loading || !email || !password}
// //             style={{ width: "100%", background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: loading || !email || !password ? 0.6 : 1 }}>
// //             {loading ? "Signing in..." : "Sign In →"}
// //           </button>

// //           {/* Register links */}
// //           <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1A1A1A", display: "flex", justifyContent: "center", gap: 16 }}>
// //             {tab === "brand" && (
// //               <span style={{ fontSize: 11, color: "#555" }}>
// //                 New brand? <span onClick={() => navigate("/onboard")} style={{ color: "#E5391F", cursor: "pointer" }}>Register here →</span>
// //               </span>
// //             )}
// //             {tab === "vendor" && (
// //               <span style={{ fontSize: 11, color: "#555" }}>
// //                 New vendor? <span onClick={() => navigate("/vendor/register")} style={{ color: "#E5391F", cursor: "pointer" }}>Join the network →</span>
// //               </span>
// //             )}
// //             {tab === "nafdac" && (
// //               <span style={{ fontSize: 11, color: "#555" }}>
// //                 Contact admin for NAFDAC access credentials.
// //               </span>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [tab, setTab] = useState("brand");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const ROLES = [
//     { id: "brand", label: "Brand" },
//     { id: "vendor", label: "Vendor" },
//   ];

//   const REDIRECTS = {
//     brand: "/brand",
//     vendor: "/vendor/portal",
//     nafdac: "/dashboard",
//   };

//   const handleLogin = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const user = await login(email, password);

//       const redirectTo = location.state?.from || REDIRECTS[user.role] || "/";
//       navigate(redirectTo, { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.error || "Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inp = {
//     width: "100%",
//     background: "#111",
//     border: "1px solid #2A2A2A",
//     borderRadius: 7,
//     padding: "11px 13px",
//     fontSize: 13,
//     color: "#fff",
//     outline: "none",
//     fontFamily: "inherit",
//   };

//   return (
//     <div style={{ minHeight: "calc(100vh - 74px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
//       <div style={{ width: "100%", maxWidth: 420 }}>
//         <div style={{ textAlign: "center", marginBottom: 28 }}>
//           <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
//             Mantios Portal
//           </div>
//           <div style={{ fontSize: 12, color: "#555" }}>Secure access for authorized users</div>
//         </div>

//         <div style={{ display: "flex", background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
//           {ROLES.map(r => (
//             <button
//               key={r.id}
//               onClick={() => {
//                 setTab(r.id);
//                 setError(null);
//                 setEmail("");
//                 setPassword("");
//               }}
//               style={{
//                 flex: 1,
//                 background: tab === r.id ? "#E5391F" : "transparent",
//                 color: tab === r.id ? "#000" : "#666",
//                 border: "none",
//                 borderRadius: 7,
//                 padding: "8px 4px",
//                 fontSize: 11,
//                 fontWeight: 700,
//                 cursor: "pointer",
//               }}
//             >
//               {r.label}
//             </button>
//           ))}
//         </div>

//         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px" }}>
//           <div style={{ marginBottom: 18 }}>
//             <div style={{ fontSize: 10, fontWeight: 700, color: "#E5391F", background: "rgba(229,57,31,0.1)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 4, padding: "3px 8px", display: "inline-block" }}>
//               {ROLES.find(r => r.id === tab)?.label} Login
//             </div>
//           </div>

//           <div style={{ marginBottom: 14 }}>
//             <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Email</label>
//             <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inp} />
//           </div>

//           <div style={{ marginBottom: 20 }}>
//             <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               style={inp}
//               onKeyDown={e => e.key === "Enter" && handleLogin()}
//             />
//           </div>

//           {error && (
//             <div style={{ fontSize: 11, color: "#E53935", marginBottom: 14, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6, border: "1px solid rgba(229,57,53,0.2)" }}>
//               {error}
//             </div>
//           )}

//           <button
//             onClick={handleLogin}
//             disabled={loading || !email || !password}
//             style={{
//               width: "100%",
//               background: "#E5391F",
//               color: "#fff",
//               border: "none",
//               borderRadius: 8,
//               padding: 12,
//               fontSize: 13,
//               fontWeight: 700,
//               cursor: "pointer",
//               fontFamily: "inherit",
//               opacity: loading || !email || !password ? 0.7 : 1,
//             }}
//           >
//             {loading ? "Signing in..." : "Sign In →"}
//           </button>

//           <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1A1A1A", display: "flex", justifyContent: "center", gap: 16 }}>
//             {tab === "brand" && (
//               <span style={{ fontSize: 11, color: "#555" }}>
//                 New brand? <span onClick={() => navigate("/onboard")} style={{ color: "#E5391F", cursor: "pointer" }}>Register here →</span>
//               </span>
//             )}
//             {tab === "vendor" && (
//               <span style={{ fontSize: 11, color: "#555" }}>
//                 New vendor? <span onClick={() => navigate("/vendor/register")} style={{ color: "#E5391F", cursor: "pointer" }}>Join the network →</span>
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ROLES = [
    { id: "user", label: "User" },
    { id: "brand", label: "Brand" },
    { id: "vendor", label: "Vendor" },
  ];

  const REDIRECTS = {
    user: "/scan",
    brand: "/brand",
    vendor: "/vendor/portal",
    nafdac: "/dashboard",
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);

      const redirectTo = location.state?.from || REDIRECTS[user.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
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
    <div style={{ minHeight: "calc(100vh - 74px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            Mantios Portal
          </div>
          <div style={{ fontSize: 12, color: "#555" }}>Secure access for authorized users</div>
        </div>

        <div style={{ display: "flex", background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
          {ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => {
                setTab(r.id);
                setError(null);
                setEmail("");
                setPassword("");
              }}
              style={{
                flex: 1,
                background: tab === r.id ? "#E5391F" : "transparent",
                color: tab === r.id ? "#000" : "#666",
                border: "none",
                borderRadius: 7,
                padding: "8px 4px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#E5391F", background: "rgba(229,57,31,0.1)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 4, padding: "3px 8px", display: "inline-block" }}>
              {ROLES.find(r => r.id === tab)?.label} Login
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inp} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: "#666", marginBottom: 5, display: "block" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inp}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && (
            <div style={{ fontSize: 11, color: "#E53935", marginBottom: 14, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6, border: "1px solid rgba(229,57,53,0.2)" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{
              width: "100%",
              background: "#E5391F",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: 12,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              opacity: loading || !email || !password ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1A1A1A", display: "flex", justifyContent: "center", gap: 16 }}>
            {tab === "brand" && (
              <span style={{ fontSize: 11, color: "#555" }}>
                New brand? <span onClick={() => navigate("/onboard")} style={{ color: "#E5391F", cursor: "pointer" }}>Register here →</span>
              </span>
            )}

            {tab === "vendor" && (
              <span style={{ fontSize: 11, color: "#555" }}>
                New vendor? <span onClick={() => navigate("/vendor/register")} style={{ color: "#E5391F", cursor: "pointer" }}>Join the network →</span>
              </span>
            )}

            {tab === "user" && (
              <span style={{ fontSize: 11, color: "#555" }}>
                New user? <span onClick={() => navigate("/user/register")} style={{ color: "#E5391F", cursor: "pointer" }}>Create account →</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}