"use client"

import type React from "react"

/* eslint-disable */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/click-events-have-key-events, jsx-a11y/mouse-events-have-key-events */
// @ts-nocheck
import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls as DreiOrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { createWorld } from "../utils/worldCreator"
import { PlayerController } from "./PlayerController"
import { MeEntity } from "./MeEntity"
import { ZeppelinEntity } from "./ZeppelinEntity"
import { ChestEntity } from "./ChestEntity"
import { ProjectsHall } from "./halls/project-hall"
import { SocialLinksHall } from "./halls/social-hall"
import { ExperienceHall } from "./halls/experience-hall"
import { EnhancedEnemySpawner } from "./enhanced-enemy-spawner" // Import the enhanced enemy spawner
import { FloatingHealthBar } from "./floating-health-bar" // Import the floating health bar
import { GameOverOverlay } from "./game-over-overlay" // Import the game over overlay

// Helper types for extended controls state and dialog
type Controls = { update: () => void }
export interface SceneEntitiesProps {
  onProjectActivate: (id: string) => void
  onExperienceActivate: (id: string) => void
  onDialog: (msg: string) => void
  playerRef: React.RefObject<any>
  onGameOver: () => void
}

function SceneEntities({
  onProjectActivate,
  onExperienceActivate,
  onDialog,
  playerRef,
  onGameOver,
}: SceneEntitiesProps) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  const scene = useThree((state) => state.scene)
  const controls = useThree((state) => state.controls) as Controls
  const meRef = useRef<MeEntity | null>(null)
  const zeppelinRef = useRef<ZeppelinEntity | null>(null)
  const chestRef = useRef<ChestEntity | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const entitiesInitialized = useRef(false)

  // Initialize controllers and entities once when controls become available
  useEffect(() => {
    // Keep the original condition to prevent multiple initializations
    if (!controls || playerRef.current) return

    console.log("Initializing game entities...")

    // Position camera
    camera.position.set(0, 5, 15)
    camera.lookAt(0, 0, 0)

    // Initialize controllers and entities
    const player = new PlayerController(camera, controls, scene)

    // Add health properties and methods directly to the player
    player.maxHits = 3
    player.currentHits = 0
    player.isInvulnerable = false
    player.isDead = false

    // Define takeDamage method directly on the player
    player.takeDamage = function (amount) {
      // Skip if invulnerable or already dead
      if (this.isInvulnerable || this.isDead) return

      console.log("Player hit! Current hits:", this.currentHits + 1, "of", this.maxHits)

      // Increment hit counter
      this.currentHits += 1

      // Apply knockback
      if (this.spriteFlipbook) {
        const pos = this.spriteFlipbook.getPosition()
        // Find direction to nearest enemy for knockback
        const knockbackDirection = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5)
          .normalize()
          .multiplyScalar(2)

        pos.x += knockbackDirection.x
        pos.z += knockbackDirection.z
        this.spriteFlipbook.setPosition(pos.x, pos.y, pos.z)
      }

      // Set invulnerability
      this.isInvulnerable = true

      // Check for death
      if (this.currentHits >= this.maxHits) {
        console.log("Player died!")
        this.isDead = true
        setGameOver(true)
        onGameOver()
      }

      // Remove invulnerability after delay (unless dead)
      setTimeout(() => {
        if (!this.isDead) {
          this.isInvulnerable = false
        }
      }, 2000) // 2 seconds of invulnerability
    }

    // Fix jump animation issue
    const originalUpdate = player.update
    player.update = function (delta) {
      // Call the original update method
      originalUpdate.call(this, delta)

      // Make sure jump animation and sprite don't overlap
      if (this.isJumping && this.spriteFlipbook) {
        this.spriteFlipbook.getSprite().visible = false
      }
    }

    playerRef.current = player

    // Create entities with a slight delay to ensure proper initialization
    setTimeout(() => {
      console.log("Creating zeppelin and chest entities...")

      // Create MeEntity
      meRef.current = new MeEntity(scene, camera, onDialog)

      // Create ZeppelinEntity - explicitly set position after creation
      zeppelinRef.current = new ZeppelinEntity(scene, camera, () => onDialog("CONTACT_REQUEST"))
      console.log("Zeppelin created:", zeppelinRef.current)

      // Create ChestEntity - explicitly set position after creation
      chestRef.current = new ChestEntity(scene, camera, onDialog)
      console.log("Chest created:", chestRef.current)

      // Mark entities as initialized
      entitiesInitialized.current = true
    }, 500)

    // Append hidden player position tracker
    const playerPosElement = document.createElement("div")
    playerPosElement.id = "player-pos"
    playerPosElement.style.display = "none"
    playerPosElement.setAttribute("data-player-pos", JSON.stringify({ x: 0, y: 0, z: 0 }))
    document.body.appendChild(playerPosElement)

    // Sprite loaded event
    const onSpriteLoaded = () => {
      const el = document.createElement("div")
      el.setAttribute("data-sprite-loaded", "true")
      el.style.display = "none"
      document.body.appendChild(el)
    }
    document.addEventListener("sprite-loaded", onSpriteLoaded)

    return () => {
      document.body.removeChild(playerPosElement)
      document.removeEventListener("sprite-loaded", onSpriteLoaded)

      // Clean up entities
      if (chestRef.current) {
        console.log("Disposing chest entity")
        chestRef.current.dispose()
      }

      if (zeppelinRef.current) {
        console.log("Disposing zeppelin entity")
        zeppelinRef.current.dispose()
      }
    }
  }, [camera, controls, scene, onDialog, playerRef, onGameOver])

  useFrame((_, delta) => {
    if (gameOver) return // Skip updates if game is over

    // Only try to update controls if they exist
    if (controls) {
      try {
        controls.update()
      } catch (error) {
        console.error("Error updating controls:", error)
      }
    }

    // Update player
    playerRef.current?.update(delta)

    // Update other entities only if they've been initialized
    if (entitiesInitialized.current) {
      if (meRef.current) meRef.current.update(delta)

      if (zeppelinRef.current) {
        zeppelinRef.current.update(delta)
      }

      if (chestRef.current) {
        chestRef.current.update(delta)
      }
    }
  })

  return (
    <>
      {/* World */}
      <primitive object={createWorld()} />

      {/* Add the enhanced enemy spawner in a location far from the player's starting position */}
      <EnhancedEnemySpawner
        position={[15, 1, 15]}
        playerRef={playerRef}
        enemyCount={15} // More enemies
        waveCount={3} // 3 waves of enemies
      />

      {/* Floating health bar above player */}
      <FloatingHealthBar playerRef={playerRef} maxHits={3} />

      {/* Work experience hall */}
      <ExperienceHall onExperienceActivate={onExperienceActivate} />
      {/* Social links hall */}
      <SocialLinksHall />
      {/* Projects hall */}
      <ProjectsHall onProjectActivate={onProjectActivate} />
    </>
  )
}

export default function Game({
  onProjectActivate,
  onExperienceActivate,
  onDialog,
}: {
  onProjectActivate: (id: string) => void
  onExperienceActivate: (id: string) => void
  onDialog: (msg: string) => void
}) {
  const playerRef = useRef(null)
  const [showGameOver, setShowGameOver] = useState(false)
  const [score, setScore] = useState(0)

  // Increment score over time
  useEffect(() => {
    if (showGameOver) return

    const scoreInterval = setInterval(() => {
      setScore((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(scoreInterval)
  }, [showGameOver])

  // Handle game restart
  const handleRestart = () => {
    setShowGameOver(false)
    setScore(0)

    // Reset player
    if (playerRef.current) {
      playerRef.current.currentHits = 0
      playerRef.current.isDead = false
      playerRef.current.isInvulnerable = false

      // Reset position
      if (playerRef.current.spriteFlipbook) {
        playerRef.current.spriteFlipbook.setPosition(0, 1, 0)
      }
    }

    // Force reload the page to reset everything
    window.location.reload()
  }

  return (
    <div className="relative w-full h-full">
      <Canvas
        onContextLost={(e) => {
          e.preventDefault()
          console.error("WebGL context lost")
        }}
        onContextRestored={() => console.log("WebGL context restored")}
        shadows
        gl={{ alpha: false }}
        camera={{ position: [0, 5, 15], fov: 75 }}
      >
        {/* Dark gray scene background */}
        <color attach="background" args={[0x242424]} />
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {/* Controls */}
        <DreiOrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
          minDistance={5}
          maxDistance={30}
          enablePan={false}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
          }}
        />
        {/* Scene Entities */}
        <SceneEntities
          onProjectActivate={onProjectActivate}
          onExperienceActivate={onExperienceActivate}
          onDialog={onDialog}
          playerRef={playerRef}
          onGameOver={() => setShowGameOver(true)}
        />
      </Canvas>

      {/* Game Over Overlay */}
      <GameOverOverlay isOpen={showGameOver} onRestart={handleRestart} score={score} />
    </div>
  )
}
