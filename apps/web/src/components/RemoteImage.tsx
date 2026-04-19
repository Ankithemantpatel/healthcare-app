import React from "react";

const DEFAULT_FALLBACK_SRC = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#164e63" />
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="url(#bg)" />
    <circle cx="320" cy="140" r="52" fill="#67e8f9" fill-opacity="0.25" />
    <rect x="180" y="222" width="280" height="18" rx="9" fill="#e2e8f0" fill-opacity="0.72" />
    <rect x="230" y="252" width="180" height="14" rx="7" fill="#cbd5e1" fill-opacity="0.6" />
  </svg>
`)}`;

type RemoteImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  src?: string;
  wrapperClassName?: string;
  fallbackSrc?: string;
};

const RemoteImage: React.FC<RemoteImageProps> = ({
  src,
  alt,
  className,
  wrapperClassName,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  onLoad,
  onError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = React.useState(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setIsLoaded(false);
  }, [src, fallbackSrc]);

  return (
    <div
      className={`relative overflow-hidden bg-slate-900/60 ${wrapperClassName ?? ""}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-800/70" />
      )}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        className={`${className ?? ""} transition-opacity duration-200 ${isLoaded ? "opacity-100" : "opacity-0"}`.trim()}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            return;
          }

          setIsLoaded(true);
          onError?.(event);
        }}
      />
    </div>
  );
};

export default RemoteImage;
