import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { PlayerController } from "../../PlayerController"
import styles from "./index.module.css"

const JOYSTICK_ACTIVE_RADIUS = 48
const MOVEMENT_THRESHOLD = 0.35

type Vector2 = { x: number; y: number }

type VirtualGamepadProps = {
  playerRef: React.RefObject<PlayerController | null>
}

export function VirtualGamepad({ playerRef }: VirtualGamepadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const activePointerId = useRef<number | null>(null)

  const applyVirtualInput = useCallback(
    (vector: Vector2) => {
      const player = playerRef.current
      if (!player) return

      const mapped = {
        w: vector.y < -MOVEMENT_THRESHOLD,
        s: vector.y > MOVEMENT_THRESHOLD,
        a: vector.x < -MOVEMENT_THRESHOLD,
        d: vector.x > MOVEMENT_THRESHOLD,
      } as const

      player.setKeyState("w", mapped.w)
      player.setKeyState("s", mapped.s)
      player.setKeyState("a", mapped.a)
      player.setKeyState("d", mapped.d)
    },
    [playerRef],
  )

  const resetJoystick = useCallback(() => {
    if (knobRef.current) {
      knobRef.current.style.transform = "translate(0px, 0px)"
    }
    applyVirtualInput({ x: 0, y: 0 })
  }, [applyVirtualInput])

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!joystickRef.current) return
      const rect = joystickRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = clientX - centerX
      const dy = clientY - centerY

      const distance = Math.min(Math.hypot(dx, dy), JOYSTICK_ACTIVE_RADIUS)
      const angle = Math.atan2(dy, dx)
      const offsetX = distance * Math.cos(angle)
      const offsetY = distance * Math.sin(angle)

      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      }

      applyVirtualInput({
        x: offsetX / JOYSTICK_ACTIVE_RADIUS,
        y: offsetY / JOYSTICK_ACTIVE_RADIUS,
      })
    },
    [applyVirtualInput],
  )

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (activePointerId.current !== null) return

      activePointerId.current = event.pointerId
      joystickRef.current?.setPointerCapture(event.pointerId)
      updateFromPointer(event.clientX, event.clientY)
    },
    [updateFromPointer],
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerId.current !== event.pointerId) return
      event.preventDefault()
      updateFromPointer(event.clientX, event.clientY)
    },
    [updateFromPointer],
  )

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return
    event.preventDefault()
    joystickRef.current?.releasePointerCapture(event.pointerId)
    activePointerId.current = null
    resetJoystick()
  }, [resetJoystick])

  useEffect(() => {
    if (typeof window === "undefined") return

    const queries = [window.matchMedia("(pointer: coarse)"), window.matchMedia("(max-width: 1024px)")]
    const updateVisibility = () => {
      setIsVisible(queries.some((mq) => mq.matches))
    }

    updateVisibility()

    const cleanups = queries.map((mq) => {
      const handler = () => updateVisibility()
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
      }
      mq.addListener(handler)
      return () => mq.removeListener(handler)
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  const handleJumpPress = useCallback(
    (pressed: boolean) => {
      const player = playerRef.current
      if (!player) return
      player.setKeyState("space", pressed)
    },
    [playerRef],
  )

  const handleAttackPress = useCallback(() => {
    playerRef.current?.triggerAxeThrowAtNormalizedPosition(0, 0)
  }, [playerRef])

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.gamepad}>
      <div
        ref={joystickRef}
        className={styles.joystick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        aria-label="Virtual joystick"
      >
        <div className={styles.knob} ref={knobRef}>
          MOVE
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          type="button"
          aria-label="Jump"
          className={`${styles.actionButton} ${styles.secondary}`}
          onPointerDown={(event) => {
            event.preventDefault()
            handleJumpPress(true)
          }}
          onPointerUp={(event) => {
            event.preventDefault()
            handleJumpPress(false)
          }}
          onPointerCancel={(event) => {
            event.preventDefault()
            handleJumpPress(false)
          }}
          onPointerLeave={(event) => {
            event.preventDefault()
            handleJumpPress(false)
          }}
        >
          JUMP
        </button>

        <button
          type="button"
          aria-label="Throw axe"
          className={styles.actionButton}
          onPointerDown={(event) => {
            event.preventDefault()
            handleAttackPress()
          }}
        >
          AXE
        </button>
      </div>
    </div>
  )
}
