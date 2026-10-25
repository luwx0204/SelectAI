import React from 'react'

/** Show at most this many trailing characters of the reasoning stream. */
const TAIL_CHARS = 400

/**
 * Grok-style live thinking view: shows the tail of the reasoning stream,
 * wrapped naturally inside a few-rows-tall window that stays pinned to the
 * bottom so fresh sentences stay in view. Falls back to the plain
 * "Thinking..." shimmer until the first reasoning fragment arrives.
 */
export function ReasoningLine({
  reasoning,
  pending,
  preparing,
  label
}: {
  reasoning?: string
  pending?: boolean
  preparing: string
  label: string
}) {
  const textRef = React.useRef<HTMLDivElement>(null)
  const tail = pending && reasoning ? reasoning.slice(-TAIL_CHARS) : ''
  // Keep the newest characters visible: scroll the wrapped window to its end.
  React.useEffect(() => {
    const el = textRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [tail])
  if (!pending) return null
  if (!tail) return <span className="thinking-indicator">{preparing}</span>
  return (
    <div className="reasoning-line">
      <span className="thinking-indicator reasoning-line__label">{label}</span>
      <div className="reasoning-line__text" ref={textRef}>
        {tail}
      </div>
    </div>
  )
}

/** Collapsed post-thinking note shown above the answer ("Thought for 4s").
 *  Collapsed by default; click to expand the full reasoning text. */
export function ReasoningSummary({
  seconds,
  label,
  reasoning,
}: {
  seconds: number
  label: string
  reasoning?: string
}) {
  const [expanded, setExpanded] = React.useState(false)
  if (!(seconds >= 0.5)) return null
  const expandable = !!reasoning
  return (
    <div className="reasoning-summary-wrap">
      <div
        className="reasoning-summary"
        onClick={expandable ? () => setExpanded((v) => !v) : undefined}
        style={expandable ? { cursor: 'pointer' } : undefined}
      >
        ✦ {label} {Math.max(1, Math.round(seconds))}s{expandable ? (expanded ? ' ▲' : ' ▼') : ''}
      </div>
      {expanded && reasoning && <div className="reasoning-summary__full">{reasoning}</div>}
    </div>
  )
}
