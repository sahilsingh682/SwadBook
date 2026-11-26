interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textClassName?: string;
}

export function BrandLogo({ size = 'md', showText = true, textClassName = '' }: BrandLogoProps) {
  const dimensions = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="inline-flex items-center gap-2.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        className={`${dimensions} rounded-xl shadow-sm flex-shrink-0`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sb-logo-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="55%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#sb-logo-bg)" />
        <rect x="6" y="6" width="52" height="52" rx="12" stroke="#FEF3C7" strokeOpacity="0.32" strokeWidth="1.5" />
        <path
          d="M32 23C28.5 19.5 22.5 18.5 17 19.5V43.5C22.5 42.5 28.5 43.5 32 47C35.5 43.5 41.5 42.5 47 43.5V19.5C41.5 18.5 35.5 19.5 32 23Z"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M32 23V47" stroke="#FDE68A" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M47 13L48.4 16L51.4 17.4L48.4 18.8L47 21.8L45.6 18.8L42.6 17.4L45.6 16L47 13Z" fill="#FDE68A" />
      </svg>
      {showText && (
        <span className={`font-display ${textSize} font-bold tracking-tight ${textClassName}`}>
          Swad<span className="text-primary">Book</span>
        </span>
      )}
    </div>
  );
}
