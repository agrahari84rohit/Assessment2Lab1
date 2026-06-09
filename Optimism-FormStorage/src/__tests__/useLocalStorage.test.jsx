/** @vitest-environment jsdom */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('restores a saved value and updates storage', () => {
    localStorage.setItem('name', 'Ava')

    const { result } = renderHook(() => useLocalStorage('name', ''))

    expect(result.current[0]).toBe('Ava')

    act(() => {
      result.current[1]('Jordan')
    })

    expect(localStorage.getItem('name')).toBe('Jordan')
  })

  it('uses the initial value when no saved data exists', () => {
    const { result } = renderHook(() => useLocalStorage('serviceNumber', 'SN-001'))

    expect(result.current[0]).toBe('SN-001')
  })
})
