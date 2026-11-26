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
          <linearGradient id="zaika-logo-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="55%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="zaika-logo-gold" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#zaika-logo-bg)" />
        <rect x="6" y="6" width="52" height="52" rx="12" stroke="url(#zaika-logo-gold)" strokeOpacity="0.35" strokeWidth="1.5" />
        <path
          d="M20 21H43L21 43H44"
          stroke="#FFFFFF"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46 13L47.6 16.4L51 18L47.6 19.6L46 23L44.4 19.6L41 18L44.4 16.4L46 13Z"
          fill="#FDE68A"
        />
      </svg>
      {showText && (
        <span className={`font-display ${textSize} font-bold tracking-tight ${textClassName}`}>
          Zai<span className="text-primary">ka</span>
        </span>
      )}
    </div>
  );
}
