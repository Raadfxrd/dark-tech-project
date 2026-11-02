// The story is a timeline over scroll progress p (0 at the top of the story, 1 at its end).
// A track is [[p, value], ...] sorted by p; between two keys the value eases (smoothstep).
// With `step` (reduced motion) it cuts halfway instead of moving.

// Which keys p falls between and how far: [i, j, e] blends keys[i] into keys[j] by e.
export function segment(p, keys, step = false) {
  if (p <= keys[0][0]) return [0, 0, 0]
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i][0], b = keys[i + 1][0]
    if (p > b) continue
    const t = (p - a) / (b - a)
    return [i, i + 1, step ? (t < 0.5 ? 0 : 1) : t * t * (3 - 2 * t)]
  }
  const last = keys.length - 1
  return [last, last, 0]
}

export function value(p, keys, step = false) {
  const [i, j, e] = segment(p, keys, step)
  return keys[i][1] + (keys[j][1] - keys[i][1]) * e
}

// Caption opacity: 1 inside [a, b], fading in over `fade` after a and out over `fade` before b.
export function windowOpacity(p, [a, b], fade) {
  return Math.min(1, Math.max(0, Math.min(p - a, b - p) / fade))
}
