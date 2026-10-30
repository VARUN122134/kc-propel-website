/**
 * Camera choreography across the page.
 *
 * Positions are expressed in *screen* terms rather than world units, so the
 * composition holds at any viewport size:
 *   fracX  -1 = left edge, 0 = centre, +1 = right edge
 *   fracY  -1 = top edge,  0 = centre, +1 = bottom edge
 *   size   object diameter as a fraction of viewport height
 *
 * Rotation stays shallow on purpose: the diagram is a flat ring stack, so a
 * deep tumble would foreshorten it into a line. z carries the slow drift.
 */
export interface Keyframe {
  p: number;
  fracX: number;
  fracY: number;
  size: number;
  opacity: number;
  rot: [number, number, number];
}

export const KEYFRAMES: Keyframe[] = [
  // hero — the diagram sits in the right column, where the SVG used to be
  { p: 0.0,   fracX: 0.45,  fracY: 0.115, size: 0.52, opacity: 1.0,  rot: [0.0, 0.12, 0.0] },
  { p: 0.06,  fracX: 0.52,  fracY: 0.02,  size: 0.46, opacity: 0.75, rot: [0.0, 0.1, 0.1] },

  // statement — a quiet drift to the right margin
  { p: 0.10,  fracX: 0.58,  fracY: -0.18, size: 0.34, opacity: 0.16, rot: [0.06, 0.08, 0.2] },
  { p: 0.15,  fracX: 0.52,  fracY: -0.24, size: 0.30, opacity: 0.14, rot: [0.1, 0.06, 0.3] },

  // what we do — cards own the screen, the object is barely there
  { p: 0.20,  fracX: 0.58,  fracY: -0.10, size: 0.28, opacity: 0.10, rot: [0.12, 0.04, 0.4] },

  // how we propel — dark chapter, light hairlines, large and quiet behind the list
  { p: 0.248, fracX: 0.16,  fracY: 0.00,  size: 0.68, opacity: 0.20, rot: [0.08, 0.1, 0.5] },
  { p: 0.292, fracX: 0.10,  fracY: 0.00,  size: 0.72, opacity: 0.22, rot: [0.06, 0.12, 0.6] },

  // campaigns — the rail is the moment; the diagram is a light companion
  { p: 0.320, fracX: 0.40,  fracY: -0.30, size: 0.32, opacity: 0.50, rot: [0.1, 0.14, 0.72] },
  { p: 0.400, fracX: 0.34,  fracY: -0.30, size: 0.30, opacity: 0.46, rot: [0.12, 0.12, 0.84] },
  { p: 0.480, fracX: 0.30,  fracY: -0.30, size: 0.28, opacity: 0.40, rot: [0.14, 0.1, 0.96] },

  // who we help
  { p: 0.510, fracX: 0.48,  fracY: -0.15, size: 0.32, opacity: 0.22, rot: [0.1, 0.08, 1.08] },

  // the operator section
  { p: 0.572, fracX: 0.55,  fracY: -0.05, size: 0.26, opacity: 0.10, rot: [0.08, 0.06, 1.2] },

  // team
  { p: 0.645, fracX: 0.60,  fracY: -0.08, size: 0.30, opacity: 0.20, rot: [0.06, 0.04, 1.34] },

  // close of the tint block
  { p: 0.722, fracX: 0.50,  fracY: 0.00,  size: 0.24, opacity: 0.08, rot: [0.04, 0.02, 1.46] },

  // results — dark, inverted, large and still behind the headline
  { p: 0.786, fracX: 0.00,  fracY: 0.00,  size: 0.78, opacity: 0.20, rot: [0.04, 0.0, 1.58] },
  { p: 0.826, fracX: -0.06, fracY: 0.00,  size: 0.82, opacity: 0.22, rot: [0.05, -0.02, 1.7] },

  // about
  { p: 0.845, fracX: 0.55,  fracY: 0.02,  size: 0.26, opacity: 0.12, rot: [0.06, -0.04, 1.82] },

  // founder
  { p: 0.915, fracX: 0.38,  fracY: -0.26, size: 0.24, opacity: 0.12, rot: [0.08, -0.06, 1.94] },

  // contact — dark; the object settles behind the form
  { p: 0.963, fracX: -0.10, fracY: 0.00,  size: 0.74, opacity: 0.20, rot: [0.1, -0.08, 2.06] },
  { p: 1.0,   fracX: -0.08, fracY: -0.02, size: 0.70, opacity: 0.18, rot: [0.12, -0.1, 2.18] },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

export interface StageFrame {
  fracX: number;
  fracY: number;
  size: number;
  opacity: number;
  rot: [number, number, number];
}

export function sampleFrame(progress: number): StageFrame {
  const p = Math.min(1, Math.max(0, progress));

  let i = 0;
  while (i < KEYFRAMES.length - 2 && p > KEYFRAMES[i + 1].p) i++;

  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1];
  const span = b.p - a.p || 1;
  const t = smooth(Math.min(1, Math.max(0, (p - a.p) / span)));

  return {
    fracX: lerp(a.fracX, b.fracX, t),
    fracY: lerp(a.fracY, b.fracY, t),
    size: lerp(a.size, b.size, t),
    opacity: lerp(a.opacity, b.opacity, t),
    rot: lerp3(a.rot, b.rot, t),
  };
}
