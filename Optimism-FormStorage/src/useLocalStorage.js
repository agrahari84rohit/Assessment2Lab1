import { useEffect, useState } from 'react'

// Custom hook that stores a value in localStorage and restores it on refresh.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(key)

    return storedValue !== null ? storedValue : initialValue
  })

  useEffect(() => {
    window.localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}
