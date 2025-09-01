"use client"

import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Example breakpoint for mobile
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      handleResize() // Set initial value
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return isMobile
}
