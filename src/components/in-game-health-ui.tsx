"use client"

import type React from "react"

import { Html } from "@react-three/drei"
import { useEffect, useState } from "react"

interface InGameHealthUIProps {
  playerRef: React.RefObject<any>
  maxHealth?: number
}

export const InGameHealthUI: React.FC<InGameHealthUIProps> = ({ playerRef, maxHealth = 100 }) => {
  const [health, setHealth] = useState(maxHealth)
  const [isHit, setIsHit] = useState(false)

  // Update health when player health changes
  useEffect(() => {
    const checkHealth = () => {
      if (playerRef.current) {
        const currentHealth = playerRef.current.health || maxHealth

        // Check if player was hit
        if (currentHealth < health) {
          setIsHit(true)
          setTimeout(() => setIsHit(false), 300)
        }

        setHealth(currentHealth)
      }
    }

    // Check health immediately and then set up interval
    checkHealth()
    const interval = setInterval(checkHealth, 100)

    return () => clearInterval(interval)
  }, [playerRef, health, maxHealth])

  // Calculate number of hearts (1 heart = 20 health)
  const totalHearts = Math.ceil(maxHealth / 20)
  const fullHearts = Math.floor(health / 20)
  const partialHeart = health % 20 > 0 ? 1 : 0
  const emptyHearts = totalHearts - fullHearts - partialHeart

  return (
    <Html position={[-10, 8, 0]} transform occlude>
      <div
        className={`flex items-center p-2 rounded-md ${isHit ? "bg-red-900 bg-opacity-50" : "bg-black bg-opacity-50"} transition-colors duration-300`}
      >
        <div className="mr-2">
          <img src="/talk-icon.png" alt="Player" className="w-8 h-8 rounded-full border-2 border-white" />
        </div>
        <div className="flex">
          {/* Full hearts */}
          {Array.from({ length: fullHearts }).map((_, i) => (
            <HeartIcon key={`full-${i}`} type="full" />
          ))}

          {/* Partial heart */}
          {partialHeart > 0 && <HeartIcon type="partial" />}

          {/* Empty hearts */}
          {Array.from({ length: emptyHearts }).map((_, i) => (
            <HeartIcon key={`empty-${i}`} type="empty" />
          ))}
        </div>
      </div>
    </Html>
  )
}

// Heart icon component
const HeartIcon = ({ type }: { type: "full" | "partial" | "empty" }) => {
  const colors = {
    full: "text-red-500",
    partial: "text-orange-500",
    empty: "text-gray-500",
  }

  return (
    <div className={`w-6 h-6 mx-0.5 ${colors[type]}`}>
      {type === "full" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      )}
      {type === "partial" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
            clipPath="inset(0 50% 0 0)"
          />
          <path
            d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      )}
      {type === "empty" && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      )}
    </div>
  )
}
