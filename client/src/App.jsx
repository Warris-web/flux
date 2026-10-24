// // import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
// // import { useAuth }         from "./context/AuthContext";
// // import useTheme            from "./useTheme";
// // import Topbar              from "./components/Topbar";
// // import LandingPage         from "./pages/LandingPage";
// // import ScanPage            from "./pages/ScanPage";
// // import OnboardPage         from "./pages/OnboardPage";
// // import LoginPage           from "./pages/LoginPage";
// // import BrandPortal         from "./pages/BrandPortal";
// // import NafdacPortal        from "./pages/NafdacPortal";
// // import VendorPortal        from "./pages/VendorPortal";
// // import VendorRegisterPage  from "./pages/VendorRegisterPage";
// // import VendorLocatorPage   from "./pages/VendorLocatorPage";

// // function Protected({ role, children }) {
// //   const { user, loading } = useAuth();
// //   if (loading) return <div className="p-10 text-center text-neutral-500">Loading...</div>;
// //   if (!user || (role && user.role !== role)) return <Navigate to="/login" replace />;
// //   return children;
// // }

// // function Shell() {
// //   const { pathname } = useLocation();
// //   const [dark, toggleTheme] = useTheme();
// //   const themed = pathname === "/"; // light/dark applies to the landing page; app screens stay dark

// //   return (
// //     <div
// //       className={`min-h-screen font-sans transition-colors ${
// //         themed
// //           ? "bg-white text-neutral-950 dark:bg-black dark:text-white"
// //           : "dark bg-[#0A0A0A] text-white"
// //       }`}
// //     >
// //       <Topbar themed={themed} dark={dark} onToggleTheme={toggleTheme} />
// //       <Routes>
// //         <Route path="/"                 element={<LandingPage />} />
// //         <Route path="/scan"             element={<ScanPage />} />
// //         <Route path="/onboard"          element={<OnboardPage />} />
// //         <Route path="/login"            element={<LoginPage />} />
// //         <Route path="/vendor/register"  element={<VendorRegisterPage />} />
// //         <Route path="/vendor/locator"   element={<VendorLocatorPage />} />
// //         <Route path="/dashboard"        element={<Protected role="nafdac"><NafdacPortal /></Protected>} />
// //         <Route path="/brand"            element={<Protected role="brand"><BrandPortal /></Protected>} />
// //         <Route path="/vendor/portal"    element={<Protected role="vendor"><VendorPortal /></Protected>} />
// //         <Route path="*"                 element={<Navigate to="/" replace />} />
// //       </Routes>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <BrowserRouter>
// //       <Shell />
// //     </BrowserRouter>
// //   );
// // }

// import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import useTheme from "./useTheme";
// import Topbar from "./components/Topbar";
// import LandingPage from "./pages/LandingPage";
// import ScanPage from "./pages/ScanPage";
// import OnboardPage from "./pages/OnboardPage";
// import LoginPage from "./pages/LoginPage";
// import BrandPortal from "./pages/BrandPortal";
// import NafdacPortal from "./pages/NafdacPortal";
// import VendorPortal from "./pages/VendorPortal";
// import VendorRegisterPage from "./pages/VendorRegisterPage";
// import VendorLocatorPage from "./pages/VendorLocatorPage";

// function Protected({ children, role = null }) {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return <div className="p-10 text-center text-neutral-500">Loading...</div>;

//   if (!user) {
//     return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//   }

//   if (role && user.role !== role) {
//     return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//   }

//   return children;
// }

// function Shell() {
//   const { pathname } = useLocation();
//   const [dark, toggleTheme] = useTheme();
//   const themed = pathname === "/";

//   return (
//     <div
//       className={`min-h-screen font-sans transition-colors ${
//         themed
//           ? "bg-white text-neutral-950 dark:bg-black dark:text-white"
//           : "dark bg-[#0A0A0A] text-white"
//       }`}
//     >
//       <Topbar themed={themed} dark={dark} onToggleTheme={toggleTheme} />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route
//           path="/scan"
//           element={
//             <Protected>
//               <ScanPage />
//             </Protected>
//           }
//         />
//         <Route path="/onboard" element={<OnboardPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/vendor/register" element={<VendorRegisterPage />} />
//         <Route path="/vendor/locator" element={<VendorLocatorPage />} />
//         <Route path="/dashboard" element={<Protected role="nafdac"><NafdacPortal /></Protected>} />
//         <Route path="/brand" element={<Protected role="brand"><BrandPortal /></Protected>} />
//         <Route path="/vendor/portal" element={<Protected role="vendor"><VendorPortal /></Protected>} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Shell />
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import useTheme from "./useTheme";
import Topbar from "./components/Topbar";
import LandingPage from "./pages/LandingPage";
import ScanPage from "./pages/ScanPage";
import OnboardPage from "./pages/OnboardPage";
import LoginPage from "./pages/LoginPage";
import UserRegisterPage from "./pages/UserRegisterPage";
import BrandPortal from "./pages/BrandPortal";
import NafdacPortal from "./pages/NafdacPortal";
import VendorPortal from "./pages/VendorPortal";
import VendorRegisterPage from "./pages/VendorRegisterPage";
import VendorLocatorPage from "./pages/VendorLocatorPage";

function Protected({ children, role = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-10 text-center text-neutral-500">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function Shell() {
  const { pathname } = useLocation();
  const [dark, toggleTheme] = useTheme();
  const themed = pathname === "/";

  return (
    <div
      className={`min-h-screen font-sans transition-colors ${
        themed
          ? "bg-white text-neutral-950 dark:bg-black dark:text-white"
          : "dark bg-[#0A0A0A] text-white"
      }`}
    >
      <Topbar themed={themed} dark={dark} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user/register" element={<UserRegisterPage />} />
        <Route path="/onboard" element={<OnboardPage />} />
        <Route path="/vendor/register" element={<VendorRegisterPage />} />
        <Route path="/vendor/locator" element={<VendorLocatorPage />} />

        <Route
          path="/scan"
          element={
            <Protected role="user">
              <ScanPage />
            </Protected>
          }
        />

        <Route path="/dashboard" element={<Protected role="nafdac"><NafdacPortal /></Protected>} />
        <Route path="/brand" element={<Protected role="brand"><BrandPortal /></Protected>} />
        <Route path="/vendor/portal" element={<Protected role="vendor"><VendorPortal /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}