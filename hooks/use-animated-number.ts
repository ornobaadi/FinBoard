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
  const previousValueRef = useRef(value)

  useEffect(() => {
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
  }, [duration, value])

  return animatedValue
}
