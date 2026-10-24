import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ScanFrame from "../components/ScanFrame";

const API = import.meta.env.VITE_API_URL;

const STEPS = [
  ["Point your camera", "Open Mantios and aim at any product packaging. No QR codes, no special hardware."],
  ["We check six signals", "Typography, colour, print quality, geometry, label text and surface texture, compared together."],
  ["Get a verdict", "Genuine, suspicious or counterfeit, with the evidence behind it and a confidence score."],
];

const AUDIENCES = [
  { who: "Consumers", desc: "Scan before you buy. If a fake is detected, find verified vendors nearby.", cta: "Scan a product", to: "/scan" },
  { who: "Brands",    desc: "Register your products and get alerts when counterfeits show up, and where.", cta: "Onboard your brand", to: "/onboard" },
  { who: "Vendors",   desc: "Join the verified network. Get customers sent to you when fakes are found nearby.", cta: "Join the network", to: "/vendor/register" },
];

const muted = "text-neutral-500 dark:text-neutral-400";

export default function LandingPage() {
  const [stats, setStats] = useState(null); // real numbers only, no placeholders

  useEffect(() => {
    axios.get(`${API}/api/dashboard/stats`).then((r) => setStats(r.data.stats)).catch(() => {});
  }, []);

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 hidden size-[700px] rounded-full blur-3xl dark:block"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 65%)" }}
      />

      {/* Hero */}
      <section className="relative mx-auto flex max-w-[1240px] flex-col items-center px-6 pb-24 pt-[62px] text-center">
        <h1 className="max-w-[960px] text-[40px] font-normal leading-[1.17] tracking-[-0.02em] sm:text-[56px]">
          Verify authenticity of skincare and cosmetic products
        </h1>
        <p className={`mt-6 max-w-[600px] text-[16px] leading-[25px] ${muted}`}>
          Mantios identifies suspicious packaging inconsistencies in skincare and cosmetic products,
          helping consumers make more informed purchasing decisions
        </p>
        <Link
          to="/scan"
          className="mt-[41px] inline-flex h-[47px] items-center rounded-full bg-neutral-950 px-[59px] text-[16px] text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
        >
          Scan a product now
        </Link>
        <div className="mt-[63px]"><ScanFrame /></div>
      </section>

      {/* Live stats — only when the API answers */}
      {stats && (
        <section className="relative mx-auto max-w-[1240px] px-6 pb-24">
          <dl className="grid grid-cols-2 gap-y-8 border-y border-neutral-200 py-10 text-center md:grid-cols-4 dark:border-neutral-900">
            {[
              ["Products scanned", stats.total_scans],
              ["Counterfeits detected", stats.counterfeits_detected],
              ["Verified vendors", stats.active_vendors],
              ["Brands protected", stats.active_brands],
            ].map(([label, value]) => (
              <div key={label}>
                <dd className="text-[40px] leading-none tracking-tight">{value?.toLocaleString() ?? "–"}</dd>
                <dt className={`mt-2 text-[14px] ${muted}`}>{label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* How it works */}
      {/* <section className="relative mx-auto max-w-[1240px] px-6 pb-24">
        <h2 className="max-w-[560px] text-[32px] leading-tight tracking-[-0.02em] sm:text-[40px]">
          A verdict in about four seconds.
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map(([title, desc], i) => (
            <li key={title} className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
              <div className={`text-[14px] ${muted}`}>Step {i + 1}</div>
              <div className="mt-3 text-[20px]">{title}</div>
              <p className={`mt-2 text-[16px] leading-[25px] ${muted}`}>{desc}</p>
            </li>
          ))}
        </ol>
      </section> */}

      {/* Audiences */}
      {/* <section className="relative mx-auto max-w-[1240px] px-6 pb-24">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-3 dark:border-neutral-900 dark:bg-neutral-900">
          {AUDIENCES.map(({ who, desc, cta, to }) => (
            <div key={who} className="flex flex-col bg-white p-8 dark:bg-black">
              <div className="text-[24px] tracking-tight">{who}</div>
              <p className={`mt-3 flex-1 text-[16px] leading-[25px] ${muted}`}>{desc}</p>
              <Link to={to} className="mt-8 self-start rounded-full border border-neutral-300 px-5 py-2 text-[15px] transition-colors hover:bg-neutral-950 hover:text-white dark:border-neutral-800 dark:hover:bg-white dark:hover:text-black">
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className={`relative mx-auto max-w-[1240px] px-6 pb-10 text-[14px] ${muted}`}>
        Payments on Mantios are processed securely by Squad.
      </footer> */}
    </main>
  );
}
