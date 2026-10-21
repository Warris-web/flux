// Swap <Tube /> for your product image: <img src="/tube.png" className="h-[250px]" alt="" />
function Tube() {
  return (
    <svg width="124" height="250" viewBox="0 0 124 250" aria-hidden="true">
      <defs>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0" stopColor="#3b2a6e" /><stop offset=".35" stopColor="#6b4fb0" />
          <stop offset=".7" stopColor="#5a3f9c" /><stop offset="1" stopColor="#2f2260" />
        </linearGradient>
        <linearGradient id="gold" x1="0" x2="1">
          <stop offset="0" stopColor="#8a6a1f" /><stop offset=".4" stopColor="#e9d27a" /><stop offset="1" stopColor="#8a6a1f" />
        </linearGradient>
      </defs>
      <rect width="124" height="12" fill="#4a3585" />
      <path d="M0 12H124L112 196H12Z" fill="url(#body)" />
      <path d="M12 196H112L108 245Q62 252 16 245Z" fill="url(#gold)" />
      <text x="62" y="72" textAnchor="middle" fontSize="11" letterSpacing="2" fill="#cfc5ea" opacity=".85">BRAND</text>
      <rect x="40" y="82" width="44" height="1.5" fill="#e9d27a" opacity=".8" />
      <text x="62" y="104" textAnchor="middle" fontSize="6" letterSpacing="1" fill="#cfc5ea" opacity=".6">BODY LOTION</text>
    </svg>
  );
}

const corner = "absolute size-[58px] border-neutral-300 dark:border-neutral-800";

export default function ScanFrame() {
  return (
    <div className="relative mx-auto h-[244px] w-[232px]" aria-hidden="true">
      <span className={`${corner} left-0 top-0 rounded-tl-lg border-l border-t`} />
      <span className={`${corner} right-0 top-0 rounded-tr-lg border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 rounded-bl-lg border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 rounded-br-lg border-b border-r`} />
      <div className="absolute inset-0 grid place-items-center"><Tube /></div>
      <div className="absolute -left-[17px] -right-[17px] top-1/2 animate-scan border-t border-dashed border-red-600" />
    </div>
  );
}
