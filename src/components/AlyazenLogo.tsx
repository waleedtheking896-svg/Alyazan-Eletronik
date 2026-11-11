export default function AlyazenLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="ALYAZEN logo">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7D774" />
          <stop offset="50%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#8A6A12" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0B0B0B" />
      <path d="M32 7 L52 14 V31 C52 44 43 53 32 57 C21 53 12 44 12 31 V14 Z" fill="none" stroke="url(#gold)" strokeWidth="3.5" />
      <path d="M32 11.5 L48 17 V31 C48 41.5 41 49 32 52.5 C23 49 16 41.5 16 31 V17 Z" fill="none" stroke="#B8B8B8" strokeWidth="1" />
      <path d="M36 17 L23 35 H31 L28 47 L41 28 H33 Z" fill="url(#gold)" stroke="#D9D9D9" strokeWidth="0.8" />
    </svg>
  );
}
