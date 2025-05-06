"use client"

import * as THREE from "three"

export class EnhancedEnemy {
  private mesh: THREE.Mesh
  public health: number
  private speed: number
  private targetPosition: THREE.Vector3
  private isActive = true
  private knockbackVelocity: THREE.Vector3 = new THREE.Vector3()
  private knockbackDuration = 0
  private isStunned = false

  constructor(scene: THREE.Scene, position: THREE.Vector3, health = 150, speed = 3) {
    this.health = health
    this.speed = speed

    // Create a simple cube enemy
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.3,
      roughness: 0.4,
    })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.copy(position)
    this.mesh.castShadow = true

    // Add data attribute for enemy identification
    this.mesh.userData.isEnemy = true

    scene.add(this.mesh)

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
      this.mesh.position.add(this.knockbackVelocity.clone().multiplyScalar(deltaTime))
      this.knockbackDuration -= deltaTime

      // Gradually reduce knockback velocity
      this.knockbackVelocity.multiplyScalar(0.95)

      // If knockback is over but enemy is still stunned, keep them stunned
      if (this.knockbackDuration <= 0 && this.isStunned) {
        this.isStunned = false
      }

      return // Skip normal movement while being knocked back
    }

    // Skip movement if stunned
    if (this.isStunned) return

    // Normal movement - move toward player
    const direction = new THREE.Vector3().subVectors(playerPosition, this.mesh.position).normalize()

    this.mesh.position.add(direction.multiplyScalar(this.speed * deltaTime))

    // Rotate to face movement direction
    if (direction.length() > 0) {
      this.mesh.rotation.y = Math.atan2(direction.x, direction.z)
    }
  }

  takeDamage(amount: number) {
    this.health -= amount

    // Visual feedback - flash red
    const material = this.mesh.material as THREE.MeshStandardMaterial
    const originalColor = material.color.clone()
    material.color.set(0xffffff)
    material.emissive.set(0xff0000)

    setTimeout(() => {
      material.color.copy(originalColor)
      material.emissive.set(0x000000)
    }, 100)

    if (this.health <= 0) {
      this.destroy()
    }
  }

  applyKnockback(sourcePosition: THREE.Vector3, force: number) {
    // Calculate knockback direction (away from source)
    const direction = new THREE.Vector3().subVectors(this.mesh.position, sourcePosition).normalize()

    // Set knockback velocity
    this.knockbackVelocity.copy(direction).multiplyScalar(force)

    // Set knockback duration
    this.knockbackDuration = 0.3 // seconds

    // Stun the enemy briefly
    this.isStunned = true

    // Apply an immediate position change to make knockback feel more impactful
    this.mesh.position.add(direction.multiplyScalar(0.2))
  }

  destroy() {
    this.isActive = false

    // Create death effect
    if (this.mesh.parent) {
      const scene = this.mesh.parent

      // Create explosion particles
      const particles = new THREE.Group()

      // Create 10 particle cubes
      for (let i = 0; i < 10; i++) {
        const size = 0.2 + Math.random() * 0.3
        const particle = new THREE.Mesh(
          new THREE.BoxGeometry(size, size, size),
          new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0x330000,
            metalness: 0.3,
            roughness: 0.4,
          }),
        )

        // Random position offset
        const angle = Math.random() * Math.PI * 2
        const radius = 0.3 + Math.random() * 0.5
        particle.position.set(Math.cos(angle) * radius, Math.random() * 1, Math.sin(angle) * radius)

        // Random velocity
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          Math.random() * 5,
          (Math.random() - 0.5) * 5,
        )

        particles.add(particle)
      }

      // Position particles at enemy position
      particles.position.copy(this.mesh.position)
      scene.add(particles)

      // Animate and remove particles
      let elapsed = 0
      const duration = 1 // seconds
      const lastTime = performance.now()

      const animateParticles = (time: number) => {
        const delta = Math.min(0.05, (time - lastTime) / 1000)
        elapsed += delta

        particles.children.forEach((child) => {
          const particle = child as THREE.Mesh
          const velocity = particle.userData.velocity as THREE.Vector3

          // Apply gravity
          velocity.y -= 9.8 * delta

          // Update position
          particle.position.add(velocity.clone().multiplyScalar(delta))

          // Rotate particle
          particle.rotation.x += delta * 2
          particle.rotation.y += delta * 3

          // Fade out
          const material = particle.material as THREE.MeshStandardMaterial
          material.opacity = 1 - elapsed / duration
          material.transparent = true
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

    // Remove the enemy mesh
    this.mesh.parent?.remove(this.mesh)
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position.clone()
  }

  getMesh(): THREE.Mesh {
    return this.mesh
  }

  getHealth(): number {
    return this.health
  }
}
