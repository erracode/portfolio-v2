"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import type * as THREE from "three"

interface FloatingHealthBarProps {
  playerRef: React.RefObject<any>
  maxHits?: number
}

export const FloatingHealthBar: React.FC<FloatingHealthBarProps> = ({ playerRef, maxHits = 3 }) => {
  // References for the health bar components
  const healthBarRef = useRef<THREE.Group>(null)
  const healthFillRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  // Track player hit state for blinking effect
  const blinkingRef = useRef<boolean>(false)
  const blinkTimerRef = useRef<number>(0)
  const blinkIntervalRef = useRef<number>(0.1) // Blink every 0.1 seconds
  const blinkDurationRef = useRef<number>(0)

  // Initialize player health on component mount
  useEffect(() => {
    if (playerRef.current) {
      // We don't need to override takeDamage here anymore
      // Just make sure we have access to the blinking state
      blinkingRef.current = false
    }
  }, [playerRef, maxHits])

  // Update health bar position and appearance
  useFrame((_, delta) => {
    if (!playerRef.current || !healthBarRef.current || !healthFillRef.current) return

    // Get player position
    const playerPosition = playerRef.current.spriteFlipbook?.getPosition()
    if (!playerPosition) return

    // Position health bar above player
    healthBarRef.current.position.set(playerPosition.x, playerPosition.y + 2.5, playerPosition.z)

    // Make health bar face the camera - using the actual camera position
    healthBarRef.current.lookAt(camera.position)

    // Update health bar fill based on hits
    const healthPercent = 1 - (playerRef.current.currentHits || 0) / maxHits
    healthFillRef.current.scale.x = Math.max(0, healthPercent)
    healthFillRef.current.position.x = -0.5 + healthPercent * 0.5

    // Handle blinking effect when player is invulnerable
    if (playerRef.current.isInvulnerable) {
      blinkTimerRef.current -= delta

      if (blinkTimerRef.current <= 0) {
        // Toggle sprite visibility
        if (playerRef.current.spriteFlipbook) {
          const sprite = playerRef.current.spriteFlipbook.getSprite()
          if (sprite) {
            sprite.visible = !sprite.visible
          }
        }

        // Reset blink timer
        blinkTimerRef.current = blinkIntervalRef.current
      }
    } else if (playerRef.current.spriteFlipbook) {
      // Make sure sprite is visible when not invulnerable
      const sprite = playerRef.current.spriteFlipbook.getSprite()
      if (sprite) {
        sprite.visible = true
      }
    }
  })

  return (
    <group ref={healthBarRef}>
      {/* Health bar background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1, 0.15]} />
        <meshBasicMaterial color={0x333333} transparent opacity={0.7} />
      </mesh>

      {/* Health bar fill - changed to green */}
      <mesh ref={healthFillRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[1, 0.15]} />
        <meshBasicMaterial color={0x44cc44} />
      </mesh>
    </group>
  )
}
