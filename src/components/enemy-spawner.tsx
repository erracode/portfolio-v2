"use client"
import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"
import { Enemy } from "./EnemyEntity"
import { AxeEnemyCollision } from "./axe-enemy-collision"

interface EnemySpawnerProps {
  position?: [number, number, number]
  playerRef: React.RefObject<any>
}

export const EnemySpawner: React.FC<EnemySpawnerProps> = ({ position = [15, 1, 15], playerRef }) => {
  const cubeRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<any>(null)
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [isActivated, setIsActivated] = useState(false)
  const { scene, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

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
          spawnEnemies()
          setIsActivated(true)
        }
      }
    }

    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("click", handleClick)
    }
  }, [camera, isActivated])

  // Spawn enemies function
  const spawnEnemies = () => {
    const newEnemies: Enemy[] = []

    // Spawn 5 enemies in a circle around the cube
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2
      const radius = 5
      const enemyX = position[0] + Math.cos(angle) * radius
      const enemyZ = position[2] + Math.sin(angle) * radius

      const enemyPosition = new THREE.Vector3(enemyX, position[1], enemyZ)
      const enemy = new Enemy(scene, enemyPosition)
      newEnemies.push(enemy)
    }

    setEnemies(newEnemies)
  }

  // Handle enemy hit
  const handleEnemyHit = (enemy: Enemy, damage: number) => {
    // You could add sound effects, score updates, or other feedback here
    console.log(`Enemy hit for ${damage} damage!`)
  }

  // Clean up dead enemies
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setEnemies((prev) => prev.filter((enemy) => enemy && enemy.getMesh().parent !== null))
    }, 1000)

    return () => clearInterval(cleanupInterval)
  }, [])

  // Update enemies
  useFrame((_, delta) => {
    if (isActivated && playerRef.current) {
      const playerPosition = playerRef.current.spriteFlipbook?.getPosition() || new THREE.Vector3()

      enemies.forEach((enemy) => {
        if (enemy) {
          enemy.update(delta, playerPosition)
        }
      })
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
            {isActivated ? "ENEMIES SPAWNED!" : "DON'T TOUCH"}
          </Text>
        </group>
      </group>

      {/* Add axe-enemy collision detection */}
      {playerRef.current && enemies.length > 0 && (
        <AxeEnemyCollision playerRef={playerRef} enemies={enemies} onEnemyHit={handleEnemyHit} />
      )}
    </>
  )
}
