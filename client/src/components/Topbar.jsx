import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const LINKS = [
  { label: "Scanner",          path: "/scan" },
  { label: "Brand onboarding", path: "/onboard" },
  { label: "Vendor network",   path: "/vendor/register" },
  // { label: "NAFDAC",           path: "/dashboard",     role: "nafdac" },
  { label: "My brands",        path: "/brand",         role: "brand" },
  { label: "Vendor portal",    path: "/vendor/portal", role: "vendor" },
];

function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-8 place-items-center rounded-full border border-neutral-300 text-neutral-600 transition-colors hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dark ? (
          <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  );
}

export default function Topbar({ themed, dark, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = LINKS.filter((l) => !l.role || user?.role === l.role);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-neutral-900 dark:bg-[#0a0a0a]/90">
      <nav className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between gap-6 px-6">
        <Logo />

        <ul className="hidden items-center gap-8 text-[16px] md:flex">
          {links.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `transition-colors hover:text-neutral-950 dark:hover:text-white ${
                    isActive ? "text-neutral-950 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 text-[14px]">
          {user ? (
            <>
              <span className="hidden text-neutral-500 sm:inline dark:text-neutral-400">{user.name}</span>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="rounded-full border border-neutral-300 px-4 py-1.5 text-neutral-600 transition-colors hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-full border border-neutral-300 px-4 py-1.5 text-neutral-600 transition-colors hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white">
              Log in
            </Link>
          )}
          {themed && <ThemeToggle dark={dark} onToggle={onToggleTheme} />}
        </div>
      </nav>
    </header>
  );
}
