import { describe, it, expect } from 'vitest'
import { createInitialState, navigationReducer } from '../navigation/router'

const START = 'scene-1'

describe('createInitialState', () => {
  it('creates state with the given start scene', () => {
    const state = createInitialState(START)
    expect(state.activeScene).toBe(START)
    expect(state.history).toEqual([])
    expect(state.transition).toBe('none')
  })
})

describe('navigationReducer', () => {
  it('navigates to a new scene and pushes current to history', () => {
    const state = createInitialState(START)
    const next = navigationReducer(state, { type: 'navigate', to: 'scene-2' }, START)
    expect(next.activeScene).toBe('scene-2')
    expect(next.history).toEqual([START])
    expect(next.transition).toBe('none')
  })

  it('navigates with a transition type', () => {
    const state = createInitialState(START)
    const next = navigationReducer(state, { type: 'navigate', to: 'scene-2', transition: 'fade' }, START)
    expect(next.activeScene).toBe('scene-2')
    expect(next.transition).toBe('fade')
  })

  it('goes back to previous scene', () => {
    const state = createInitialState(START)
    const s2 = navigationReducer(state, { type: 'navigate', to: 'scene-2' }, START)
    const s3 = navigationReducer(s2, { type: 'navigate', to: 'scene-3' }, START)
    const back = navigationReducer(s3, { type: 'back' }, START)
    expect(back.activeScene).toBe('scene-2')
    expect(back.history).toEqual([START])
  })

  it('back does nothing when history is empty', () => {
    const state = createInitialState(START)
    const result = navigationReducer(state, { type: 'back' }, START)
    expect(result).toBe(state)
  })

  it('home resets to start scene and clears history', () => {
    const state = createInitialState(START)
    const s2 = navigationReducer(state, { type: 'navigate', to: 'scene-2' }, START)
    const s3 = navigationReducer(s2, { type: 'navigate', to: 'scene-3' }, START)
    const home = navigationReducer(s3, { type: 'home' }, START)
    expect(home.activeScene).toBe(START)
    expect(home.history).toEqual([])
  })

  it('builds correct history through multiple navigations', () => {
    const state = createInitialState(START)
    const s2 = navigationReducer(state, { type: 'navigate', to: 'scene-2' }, START)
    const s3 = navigationReducer(s2, { type: 'navigate', to: 'scene-3' }, START)
    const s4 = navigationReducer(s3, { type: 'navigate', to: 'scene-4' }, START)
    expect(s4.history).toEqual([START, 'scene-2', 'scene-3'])
  })

  it('back then navigate creates correct history', () => {
    const state = createInitialState(START)
    const s2 = navigationReducer(state, { type: 'navigate', to: 'scene-2' }, START)
    const s3 = navigationReducer(s2, { type: 'navigate', to: 'scene-3' }, START)
    const back = navigationReducer(s3, { type: 'back' }, START)
    const s4 = navigationReducer(back, { type: 'navigate', to: 'scene-4' }, START)
    expect(s4.activeScene).toBe('scene-4')
    expect(s4.history).toEqual([START, 'scene-2'])
  })
})
