import { useEffect, useState } from "react";

const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches;

export default function useTheme() {
  const [dark, setDark] = useState(() => {
    const t = localStorage.getItem("theme");
    return t ? t === "dark" : systemDark();
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, () => setDark((d) => !d)];
}
