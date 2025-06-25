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
  const fillColor = color || "currentColor"
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-label="It From Bit logo"
      className={className}
      style={{ color: fillColor, ...style }}
    >
      <use href="/images/logo-pixel-wisdom.svg#rings" />
      <use href="/images/logo-pixel-wisdom.svg#axis" />
      <use href="/images/logo-pixel-wisdom.svg#haloPath" />
    </svg>
  )
}

export default LogoPW 