"use client"

import type React from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import type { EnhancedEnemy } from "./enhanced-enemy"

interface AxeEnemyCollisionProps {
  playerRef: React.RefObject<any>
  enemies: EnhancedEnemy[]
  onEnemyHit?: (enemy: EnhancedEnemy, damage: number) => void
}

export const AxeEnemyCollision: React.FC<AxeEnemyCollisionProps> = ({ playerRef, enemies, onEnemyHit = () => {} }) => {
  const collisionCheckedRef = useRef<Set<string>>(new Set())
  const { scene } = useThree()

  // Reset collision tracking when enemies change
  useEffect(() => {
    collisionCheckedRef.current = new Set()
  }, [enemies])

  useFrame(() => {
    // Skip if no player reference or axe animation
    if (!playerRef.current || !playerRef.current.axeAnimation) {
      return
    }

    const axeAnimation = playerRef.current.axeAnimation

    // Skip if axe is not active
    if (!axeAnimation.isActive()) {
      return
    }

    // Get axe position
    const axePosition = axeAnimation.getPosition()

    // Axe collision radius (adjust based on your axe size)
    const axeRadius = 0.8

    // Check collision with each enemy
    enemies.forEach((enemy) => {
      if (!enemy) return

      // Skip if we've already checked collision with this enemy for this axe throw
      const enemyId = enemy.getMesh().uuid
      const collisionKey = `${axePosition.toArray().join(",")}-${enemyId}`

      if (collisionCheckedRef.current.has(collisionKey)) {
        return
      }

      // Get enemy position
      const enemyPosition = enemy.getPosition()
      const enemyRadius = 0.5 // Adjust based on enemy size

      // Calculate distance between axe and enemy
      const distance = axePosition.distanceTo(enemyPosition)

      // Check for collision
      if (distance < axeRadius + enemyRadius) {
        // Mark this collision as checked
        collisionCheckedRef.current.add(collisionKey)

        // Apply damage to enemy
        const damage = 35 // Increased damage
        enemy.takeDamage(damage)

        // Call the hit callback
        onEnemyHit(enemy, damage)

        // Create hit effect
        createHitEffect(enemyPosition)
      }
    })
  })

  // Create a visual hit effect at the impact point
  const createHitEffect = (position: THREE.Vector3) => {
    // Create a simple particle burst effect
    const particles = new THREE.Group()

    // Create 12 small particles (increased from 8)
    for (let i = 0; i < 12; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      )

      // Random direction
      const angle = Math.random() * Math.PI * 2
      const radius = 0.2 + Math.random() * 0.5 // Increased radius
      particle.position.set(
        Math.cos(angle) * radius,
        0.5 + Math.random() * 0.8, // Higher particles
        Math.sin(angle) * radius,
      )

      particles.add(particle)
    }

    // Position the particle system at the hit location
    particles.position.copy(position)
    scene.add(particles)

    // Remove after animation
    setTimeout(() => {
      scene.remove(particles)
      particles.children.forEach((child) => {
        ;(child as THREE.Mesh).geometry.dispose()
        ;((child as THREE.Mesh).material as THREE.Material).dispose()
      })
    }, 500)
  }

  return null // This is a logic-only component
}
