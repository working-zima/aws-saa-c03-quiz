import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { clampTooltipLeft } from '../lib/glossary'
import type { GlossaryTerm as GlossaryEntry } from '../types/visuals'

interface GlossaryTermProps {
  entry: GlossaryEntry
}

const edgeMargin = 8
const anchorGap = 4

// 개념 본문 속 약어 하나. 마우스 올리기·초점·누르기로 뜻을 띄운다(UI_GUIDE 「약어 툴팁」).
// 툴팁은 fixed라 본문 폭과 무관하게 화면 가장자리에서 8px 안쪽으로 붙잡는다.
export function GlossaryTerm({ entry }: GlossaryTermProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ left: edgeMargin, top: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const tooltipId = useId()

  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !tooltipRef.current) return
    const anchor = buttonRef.current.getBoundingClientRect()
    const { offsetWidth, offsetHeight } = tooltipRef.current
    const below = anchor.bottom + anchorGap
    setPosition({
      left: clampTooltipLeft(anchor.left + anchor.width / 2, offsetWidth, window.innerWidth, edgeMargin),
      top: below + offsetHeight > window.innerHeight ? anchor.top - anchorGap - offsetHeight : below,
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!buttonRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  return (
    <>
      <button
        aria-describedby={open ? tooltipId : undefined}
        className="underline decoration-dotted underline-offset-4"
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          if (document.activeElement !== buttonRef.current) setOpen(false)
        }}
        ref={buttonRef}
        type="button"
      >
        {entry.term}
      </button>
      {open && (
        <span
          className="fixed z-10 block w-max max-w-[18rem] whitespace-normal rounded-md border border-disabled bg-panel px-3 py-2 text-left text-sm leading-6"
          id={tooltipId}
          ref={tooltipRef}
          role="tooltip"
          style={position}
        >
          <span className="block font-medium text-title">
            {entry.expansion ? `${entry.term} = ${entry.expansion}` : entry.term}
          </span>
          <span className="block text-body">{entry.meaning}</span>
        </span>
      )}
    </>
  )
}
