import Image from "next/image"
import type { FC, CSSProperties } from "react"

interface LogoProps {
  /**
   * pixel – default neon pixelated variant
   * monochrome – fill/stroke set to current text color
   */
  variant?: "pixel" | "monochrome"
  /**
   * width/height in pixels; defaults to 128
   */
  size?: number
  /**
   * Optional CSS color override (ignored for pixel variant)
   */
  color?: string
  className?: string
  style?: CSSProperties
}

const LogoPW: FC<LogoProps> = ({ variant = "pixel", size = 128, color, className = "", style }) => {
  if (variant === "pixel") {
    // raster PNG for pixel neon look to avoid SVG stroke aliasing
    return (
      <Image
        src="/images/logo-pixel-wisdom.png"
        alt="It From Bit logo"
        width={size}
        height={size}
        className={className}
        style={style}
        priority={false}
      />
    )
  }

  // monochrome: inline SVG so we can inherit currentColor or custom color
  const strokeColor = color || "currentColor"
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-label="It From Bit logo"
      className={className}
      style={style}
      fill="none"
      stroke={strokeColor}
      strokeWidth="8"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {/* Concentric pixel rings */}
      <circle cx="256" cy="256" r="96" strokeDasharray="16 8" />
      <circle cx="256" cy="256" r="152" strokeDasharray="16 8" />
      
      {/* Central axis with hidden initials */}
      <path d="M256 64 v128 h48" />
      <path d="M256 64 v384" />
      <path d="M224 448 l32 32 l32 -32" />
      
      {/* Binary halo */}
      <defs>
        <path id={`haloPath-${size}`} d="M256 48 a208 208 0 1 1 -0.01 0" />
      </defs>
      <text
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="20"
        letterSpacing="4"
        fill={strokeColor}
      >
        <textPath href={`#haloPath-${size}`} startOffset="0">
          01001001 01000010 • 01001001 01000010 •
        </textPath>
      </text>
    </svg>
  )
}

export default LogoPW 