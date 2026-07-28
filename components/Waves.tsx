// Animated waves that sit under the header.
// Each layer is a seamless wave tile of 1200 user units, drawn twice (0–2400)
// so translating one layer by -1200px loops without a visible seam.

// Build a repeating wave path with a given amplitude and baseline.
function wavePath(baseline: number, amplitude: number): string {
  // Two mirrored quadratic bumps make one period of 600 user units.
  const period = `q 150 ${-amplitude} 300 0 q 150 ${amplitude} 300 0 `;
  // 4 periods cover the full 2400-wide span (2 tiles of 1200).
  return `M0 ${baseline} ${period.repeat(4)}L2400 90 L0 90 Z`;
}

export default function Waves() {
  return (
    <div className="wave-band" aria-hidden="true">
      <svg viewBox="0 0 1200 90" preserveAspectRatio="none">
        <path
          className="wave-layer wave-1"
          d={wavePath(40, 22)}
          fill="var(--sage)"
        />
        <path
          className="wave-layer wave-2"
          d={wavePath(50, 16)}
          fill="var(--slate)"
        />
        <path
          className="wave-layer wave-3"
          d={wavePath(58, 12)}
          fill="var(--green)"
        />
      </svg>
    </div>
  );
}
