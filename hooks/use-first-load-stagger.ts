"use client"

import { useState } from "react"

const STORAGE_KEY = "finboard_dashboard_stagger_seen"

export function useFirstLoadStagger() {
  const [shouldAnimate] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }

    const hasSeenAnimation = window.sessionStorage.getItem(STORAGE_KEY)
    if (hasSeenAnimation) {
      return false
    }

    window.sessionStorage.setItem(STORAGE_KEY, "1")
    return true
  })

  return shouldAnimate
}
