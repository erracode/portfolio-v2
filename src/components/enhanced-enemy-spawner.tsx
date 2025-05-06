"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"
import { EnhancedEnemy } from "./enhanced-enemy"
import { AxeEnemyCollision } from "./axe-enemy-collision"

interface EnemySpawnerProps {
  position?: [number, number, number]
  playerRef: React.RefObject<any>
  enemyCount?: number
  waveCount?: number
}

export const EnhancedEnemySpawner: React.FC<EnemySpawnerProps> = ({
  position = [15, 1, 15],
  playerRef,
  enemyCount = 10,
  waveCount = 3,
}) => {
  const cubeRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<any>(null)
  const [enemies, setEnemies] = useState<EnhancedEnemy[]>([])
  const [isActivated, setIsActivated] = useState(false)
  const [currentWave, setCurrentWave] = useState(0)
  const [waveTimer, setWaveTimer] = useState(0)
  const { scene, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const lastDamageTime = useRef<number>(0)
  const damageDebounce = 500 // ms between damage applications

  // Handle click events
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1

      // Update the raycaster
      raycaster.current.setFromCamera(mouse.current, camera)

      // Check for intersections with the cube
      if (cubeRef.current) {
        const intersects = raycaster.current.intersectObject(cubeRef.current)

        if (intersects.length > 0 && !isActivated) {
          startWaves()
          setIsActivated(true)
        }
      }
    }

    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("click", handleClick)
    }
  }, [camera, isActivated])

  // Start wave system
  const startWaves = () => {
    setCurrentWave(1)
    spawnEnemyWave(1)
  }

  // Spawn a wave of enemies
  const spawnEnemyWave = (wave: number) => {
    const newEnemies: EnhancedEnemy[] = []

    // Scale enemy count with wave number
    const waveEnemyCount = enemyCount + (wave - 1) * 3

    // Spawn enemies in a circle around the cube
    for (let i = 0; i < waveEnemyCount; i++) {
      const angle = (i / waveEnemyCount) * Math.PI * 2
      const radius = 5 + Math.random() * 50 // Randomize spawn distance
      const enemyX = position[0] + Math.cos(angle) * radius
      const enemyZ = position[2] + Math.sin(angle) * radius

      const enemyPosition = new THREE.Vector3(enemyX, position[1], enemyZ)

      // Scale enemy health and speed with wave number
      const health = 100 + (wave - 1) * 50
      const speed = 3.1 + (wave - 1) * 0.5

      const enemy = new EnhancedEnemy(scene, enemyPosition, health, speed)

      // Add data attribute for enemy identification
      enemy.getMesh().userData.isEnemy = true

      newEnemies.push(enemy)
    }

    setEnemies((prev) => [...prev, ...newEnemies])
  }

  // Handle enemy hit
  const handleEnemyHit = (enemy: EnhancedEnemy, damage: number) => {
    // Apply knockback
    if (playerRef.current) {
      const playerPos = playerRef.current.spriteFlipbook.getPosition()
      enemy.applyKnockback(playerPos, 5) // 5 is knockback force
    }

    // You could add sound effects, score updates, or other feedback here
    console.log(`Enemy hit for ${damage} damage!`)
  }

  // Clean up dead enemies and check for wave completion
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Filter out dead enemies
      setEnemies((prev) => {
        const livingEnemies = prev.filter((enemy) => enemy && enemy.getMesh().parent !== null)

        // Check if wave is complete
        if (isActivated && currentWave > 0 && currentWave < waveCount && livingEnemies.length === 0) {
          // Start next wave after a delay
          setWaveTimer(3) // 3 second delay between waves

          // Schedule next wave
          setTimeout(() => {
            const nextWave = currentWave + 1
            setCurrentWave(nextWave)
            spawnEnemyWave(nextWave)
            setWaveTimer(0)
          }, 3000)
        }

        return livingEnemies
      })
    }, 1000)

    return () => clearInterval(cleanupInterval)
  }, [isActivated, currentWave, waveCount])

  // Update enemies and wave timer
  useFrame((_, delta) => {
    if (isActivated && playerRef.current) {
      const playerPosition = playerRef.current.spriteFlipbook?.getPosition() || new THREE.Vector3()

      enemies.forEach((enemy) => {
        if (enemy) {
          enemy.update(delta, playerPosition)

          // Skip collision detection if player is dead
          if (playerRef.current.isDead) return

          // Check for collision with player
          const distance = enemy.getPosition().distanceTo(playerPosition)
          const currentTime = performance.now()

          // Only check collision if player is not invulnerable and enemy is close
          if (
            distance < 1.5 &&
            playerRef.current &&
            playerRef.current.takeDamage && // Make sure takeDamage exists
            !playerRef.current.isInvulnerable &&
            currentTime - lastDamageTime.current > damageDebounce
          ) {
            console.log("Enemy collided with player! Distance:", distance)

            try {
              // Apply damage to player
              playerRef.current.takeDamage(1) // Just apply 1 damage (player dies after 3 hits)

              // Record the time of this damage
              lastDamageTime.current = currentTime

              // Knockback enemy away from player
              enemy.applyKnockback(playerPosition, -3)
            } catch (error) {
              console.error("Error applying damage to player:", error)
            }
          }
        }
      })
    }

    // Update wave timer
    if (waveTimer > 0) {
      setWaveTimer((prev) => Math.max(0, prev - delta))
    }

    // Make the warning text always face the camera
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }

    // Make the cube pulse when not activated
    if (cubeRef.current && !isActivated) {
      cubeRef.current.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.1
      cubeRef.current.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.1
      cubeRef.current.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.1
    }
  })

  return (
    <>
      <group position={[position[0], position[1], position[2]]}>
        {/* Warning cube */}
        <mesh ref={cubeRef} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial
            color={isActivated ? 0xff0000 : 0xff9900}
            emissive={isActivated ? 0x330000 : 0x331100}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Warning text */}
        <group ref={textRef} position={[0, 2, 0]}>
          <Text
            color="red"
            fontSize={0.5}
            maxWidth={2}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {!isActivated
              ? "DON'T TOUCH"
              : currentWave <= waveCount
                ? `WAVE ${currentWave}/${waveCount}`
                : "WAVES COMPLETE!"}
          </Text>
        </group>
      </group>

      {/* Wave timer display */}
      {waveTimer > 0 && (
        <group position={[position[0], position[1] + 3, position[2]]}>
          <Text
            color="white"
            fontSize={0.8}
            maxWidth={5}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {`Next wave in: ${Math.ceil(waveTimer)}`}
          </Text>
        </group>
      )}

      {/* Add axe-enemy collision detection */}
      {playerRef.current && enemies.length > 0 && (
        <AxeEnemyCollision playerRef={playerRef} enemies={enemies} onEnemyHit={handleEnemyHit} />
      )}
    </>
  )
}
