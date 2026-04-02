"use client"

import { useEffect, useRef, useState } from "react"

interface UseAnimatedNumberOptions {
  duration?: number
}

export function useAnimatedNumber(
  value: number,
  options: UseAnimatedNumberOptions = {}
) {
  const { duration = 600 } = options
  const [animatedValue, setAnimatedValue] = useState(value)
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  )
  const previousValueRef = useRef(value)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduceMotion(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      previousValueRef.current = value
      return
    }

    const from = previousValueRef.current
    const to = value

    if (from === to) {
      return
    }

    const start = performance.now()
    let frameId = 0

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = from + (to - from) * eased

      setAnimatedValue(next)

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    previousValueRef.current = to

    return () => cancelAnimationFrame(frameId)
  }, [duration, reduceMotion, value])

  return reduceMotion ? value : animatedValue
}
