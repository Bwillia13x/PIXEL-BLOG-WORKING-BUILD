"use client"

import { useEffect, useState } from "react"

/**
 * HeaderSpacer – invisible block element that guarantees page content starts
 * _below_ the fixed nav-bar. It measures the first <header> element it finds
 * at runtime, stores that value in the CSS custom property `--nav-height`, and
 * then renders a div with the same height so flow-layout naturally pushes the
 * rest of the document down.
 *
 * This avoids hard-coding pixel offsets and automatically adapts to different
 * break-points or a collapsed mobile header.
 */
const HeaderSpacer = () => {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement | null
    if (!header) return

    const update = () => {
      const h = Math.ceil(header.getBoundingClientRect().height)
      document.documentElement.style.setProperty("--nav-height", `${h}px`)
      setHeight(h)
    }

    // Initial measurement
    update()

    // Re-measure on resize – handles orientation changes & viewport resizes
    window.addEventListener("resize", update)
    // Re-measure when header finishes a collapse / expand transition
    header.addEventListener("transitionend", update)

    return () => {
      window.removeEventListener("resize", update)
      header.removeEventListener("transitionend", update)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{ height: height ?? "var(--nav-height)", flexShrink: 0 }}
      data-testid="header-spacer"
    />
  )
}

export default HeaderSpacer