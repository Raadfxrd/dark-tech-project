import { test } from 'node:test'
import assert from 'node:assert/strict'
import { segment, value, windowOpacity } from './timeline.js'

const keys = [[0.2, 0], [0.4, 10], [0.6, 10], [0.8, 0]]

test('holds the first and last value outside the keys', () => {
  assert.equal(value(0, keys), 0)
  assert.equal(value(1, keys), 0)
  assert.equal(value(0.5, keys), 10)
})

test('eases between keys and is exact at them', () => {
  assert.ok(Math.abs(value(0.3, keys) - 5) < 1e-9) // smoothstep is symmetric around the middle
  assert.ok(value(0.25, keys) < 2.5) // and slow at the start
  assert.equal(value(0.4, keys), 10)
  assert.deepEqual(segment(0.7, keys).slice(0, 2), [2, 3])
})

test('step mode cuts halfway', () => {
  assert.equal(value(0.29, keys, true), 0)
  assert.equal(value(0.31, keys, true), 10)
})

test('caption windows fade at both ends', () => {
  assert.equal(windowOpacity(0.1, [0.2, 0.5], 0.05), 0)
  assert.ok(Math.abs(windowOpacity(0.225, [0.2, 0.5], 0.05) - 0.5) < 1e-9)
  assert.equal(windowOpacity(0.35, [0.2, 0.5], 0.05), 1)
  assert.equal(windowOpacity(0.5, [0.2, 0.5], 0.05), 0)
  assert.equal(windowOpacity(0, [-1, 0.1], 0.05), 1)
})
