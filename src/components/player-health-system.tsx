"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface PlayerHealthProps {
  playerRef: React.RefObject<any>
  initialHealth?: number
  onDeath?: () => void
}

export const PlayerHealthSystem: React.FC<PlayerHealthProps> = ({
  playerRef,
  initialHealth = 100,
  onDeath = () => {},
}) => {
  const [health, setHealth] = useState(initialHealth)
  const [isInvulnerable, setIsInvulnerable] = useState(false)

  // Initialize player health when component mounts
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.health = initialHealth
      playerRef.current.maxHealth = initialHealth

      // Add methods to the player controller
      playerRef.current.takeDamage = (amount: number) => {
        if (isInvulnerable) return

        const newHealth = Math.max(0, playerRef.current.health - amount)
        playerRef.current.health = newHealth
        setHealth(newHealth)

        // Brief invulnerability
        setIsInvulnerable(true)
        setTimeout(() => setIsInvulnerable(false), 1000)

        // Check for death
        if (newHealth <= 0) {
          onDeath()
        }
      }

      playerRef.current.heal = (amount: number) => {
        const newHealth = Math.min(playerRef.current.maxHealth, playerRef.current.health + amount)
        playerRef.current.health = newHealth
        setHealth(newHealth)
      }

      playerRef.current.getHealth = () => {
        return playerRef.current.health
      }

      playerRef.current.isInvulnerable = () => {
        return isInvulnerable
      }
    }

    // Set up an interval to check player health
    const healthCheckInterval = setInterval(() => {
      if (playerRef.current) {
        setHealth(playerRef.current.health || initialHealth)
      }
    }, 100)

    return () => {
      clearInterval(healthCheckInterval)
    }
  }, [playerRef, initialHealth, onDeath, isInvulnerable])

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-2 rounded-md z-10">
      <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 transition-all duration-300"
          style={{ width: `${(health / initialHealth) * 100}%` }}
        />
      </div>
      <div className="text-white text-xs mt-1 text-center">
        Health: {health}/{initialHealth}
      </div>
    </div>
  )
}
