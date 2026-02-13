/**
 * Throttle frame-based operations
 */
export const throttleFrames = (callback: () => void, frameInterval: number): (() => void) => {
  let frameCount = 0
  
  return () => {
    frameCount++
    if (frameCount >= frameInterval) {
      callback()
      frameCount = 0
    }
  }
}

/**
 * Throttle time-based operations
 */
export const throttleTime = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCall < wait) {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        lastCall = now
        func(...args)
      }, wait - (now - lastCall))
    } else {
      lastCall = now
      func(...args)
    }
  }
}

/**
 * Debounce operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
