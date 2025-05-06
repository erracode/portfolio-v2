import * as THREE from "three"
import { SpriteFlipbook } from "./SpriteFlipbook"

// Enemy types with their sprite sheets
const ENEMY_TYPES = [
  { texture: "/ferris-enemy.png", width: 200, height: 100, frames: 2 },
  { texture: "/gopher-enemy.png", width: 200, height: 100, frames: 2 },
  { texture: "/duke-enemy.png", width: 200, height: 100, frames: 2 }
]

// Animation definitions
const ENEMY_WALK = { tiles: [0, 1], key: "WALK" }

export class EnhancedEnemy {
  private spriteFlipbook: SpriteFlipbook
  private health: number
  private speed: number
  private targetPosition: THREE.Vector3
  private isActive = true
  private knockbackVelocity: THREE.Vector3 = new THREE.Vector3()
  private knockbackDuration = 0
  private isStunned = false
  private isFacingLeft = false
  private type: typeof ENEMY_TYPES[number]

  constructor(scene: THREE.Scene, position: THREE.Vector3, health = 150, speed = 3) {
    this.health = health
    this.speed = speed

    // Randomly select enemy type
    this.type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)]

    // Create sprite flipbook
    this.spriteFlipbook = new SpriteFlipbook(
      this.type.texture,
      this.type.frames, // columns in sprite sheet
      1, // rows in sprite sheet
      scene
    )

    // Set initial position and animation
    this.spriteFlipbook.setPosition(position.x, position.y, position.z)
    this.spriteFlipbook.loop(ENEMY_WALK.tiles, 1 / 12, false) // Start animation at 12 FPS, initially facing right

    // Set initial random target position
    this.targetPosition = new THREE.Vector3(
      position.x + (Math.random() * 10 - 5),
      position.y,
      position.z + (Math.random() * 10 - 5),
    )
  }

  update(deltaTime: number, playerPosition: THREE.Vector3) {
    if (!this.isActive) return
  
    // Handle knockback
    if (this.knockbackDuration > 0) {
      const pos = this.spriteFlipbook.getPosition()
      pos.add(this.knockbackVelocity.clone().multiplyScalar(deltaTime))
      this.spriteFlipbook.setPosition(pos.x, pos.y, pos.z)
      this.knockbackDuration -= deltaTime
      this.knockbackVelocity.multiplyScalar(0.95)
  
      if (this.knockbackDuration <= 0 && this.isStunned) {
        this.isStunned = false
      }
      
      // Keep animation playing even during knockback
      this.spriteFlipbook.update(deltaTime)
      return
    }
  
    if (this.isStunned) {
      // Keep animation playing even when stunned
      this.spriteFlipbook.update(deltaTime)
      return
    }
  
    // Normal movement - move toward player
    const pos = this.spriteFlipbook.getPosition()
    const direction = new THREE.Vector3().subVectors(playerPosition, pos).normalize()
  
    // Update facing direction based on movement
    this.isFacingLeft = direction.x < 0
  
    // Always play WALK animation at 12 FPS, regardless of movement
    // The flip parameter determines if we should mirror the sprite
    this.spriteFlipbook.loop(ENEMY_WALK.tiles, 1 / 12, !this.isFacingLeft)
  
    // Move enemy if not in any special state
    pos.add(direction.multiplyScalar(this.speed * deltaTime))
    this.spriteFlipbook.setPosition(pos.x, pos.y, pos.z)
  
    // Ensure animation continues
    this.spriteFlipbook.update(deltaTime)
  }

  takeDamage(amount: number) {
    this.health -= amount

    // Visual feedback - flash white
    const material = this.spriteFlipbook.getSprite().material as THREE.SpriteMaterial
    const originalColor = material.color.clone()
    material.color.set(0xffffff)

    setTimeout(() => {
      material.color.copy(originalColor)
    }, 100)

    if (this.health <= 0) {
      this.destroy()
    }
  }

  applyKnockback(sourcePosition: THREE.Vector3, force: number) {
    const pos = this.spriteFlipbook.getPosition()
    const direction = new THREE.Vector3().subVectors(pos, sourcePosition).normalize()

    this.knockbackVelocity.copy(direction).multiplyScalar(force)
    this.knockbackDuration = 0.3
    this.isStunned = true

    // Apply immediate position change
    pos.add(direction.multiplyScalar(0.2))
    this.spriteFlipbook.setPosition(pos.x, pos.y, pos.z)
  }

  destroy() {
    this.isActive = false
    const scene = this.spriteFlipbook.getSprite().parent

    if (scene) {
      // Create explosion particles (same as before)
      const particles = new THREE.Group()

      for (let i = 0; i < 10; i++) {
        const size = 0.2 + Math.random() * 0.3
        const particle = new THREE.Mesh(
          new THREE.BoxGeometry(size, size, size),
          new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0x330000,
            metalness: 0.3,
            roughness: 0.4,
          })
        )

        const angle = Math.random() * Math.PI * 2
        const radius = 0.3 + Math.random() * 0.5
        particle.position.set(Math.cos(angle) * radius, Math.random() * 1, Math.sin(angle) * radius)
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          Math.random() * 5,
          (Math.random() - 0.5) * 5,
        )
        particles.add(particle)
      }

      particles.position.copy(this.spriteFlipbook.getPosition())
      scene.add(particles)

      // Animate and remove particles
      let elapsed = 0
      const duration = 1
      const lastTime = performance.now()

      const animateParticles = (time: number) => {
        const delta = Math.min(0.05, (time - lastTime) / 1000)
        elapsed += delta

        particles.children.forEach((child) => {
          const particle = child as THREE.Mesh
          const velocity = particle.userData.velocity as THREE.Vector3
          velocity.y -= 9.8 * delta
          particle.position.add(velocity.clone().multiplyScalar(delta))
          particle.rotation.x += delta * 2
          particle.rotation.y += delta * 3

          const mat = particle.material as THREE.MeshStandardMaterial
          mat.opacity = 1 - elapsed / duration
          mat.transparent = true
        })

        if (elapsed < duration) {
          requestAnimationFrame(animateParticles)
        } else {
          scene.remove(particles)
          particles.children.forEach((child) => {
            const particle = child as THREE.Mesh
            particle.geometry.dispose()
            if (particle.material instanceof THREE.Material) {
              particle.material.dispose()
            }
          })
        }
      }

      requestAnimationFrame(animateParticles)
    }

    // Remove the sprite
    this.spriteFlipbook.getSprite().parent?.remove(this.spriteFlipbook.getSprite())
  }

  getPosition(): THREE.Vector3 {
    return this.spriteFlipbook.getPosition()
  }

  getMesh(): THREE.Mesh {
    // Return the sprite as a mesh for compatibility
    return this.spriteFlipbook.getSprite() as unknown as THREE.Mesh
  }

  getHealth(): number {
    return this.health
  }
}