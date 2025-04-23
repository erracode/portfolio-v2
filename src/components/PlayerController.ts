import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { SpriteFlipbook } from "./SpriteFlipbook"
import { IDLE_LEFT, IDLE_RIGHT, WALK_LEFT, WALK_RIGHT, type SpriteAnimation } from "./SpriteAnimation"
import { JumpAnimation } from "./JumpAnimation"

export class PlayerController {
  // Constants
  private ANIMATION_DURATION_SECONDS_IDLE = 3
  private ANIMATION_DURATION_SECONDS_WALK = 0.6
  private MOVEMENT_SPEED_PER_SECOND = 4.5
  private JUMP_FORCE = 12
  private GRAVITY = 25
  private JUMP_DURATION = 0.5 // Should match jump animation duration
  private GROUND_Y = 1

  // Components
  private spriteFlipbook: SpriteFlipbook
  private jumpAnimation: JumpAnimation
  private camera: THREE.Camera
  private orbitControls: OrbitControls
  private sprite!: THREE.Sprite

  // State
  private isFacingLeft = false
  private isMoving = false
  private isJumping = false
  private jumpVelocity = 0
  private jumpTime = 0
  private keysPressed = { w: false, a: false, s: false, d: false, space: false }
  private currentAnimation: SpriteAnimation = IDLE_RIGHT
  private canJump = true
  private jumpStartY = 0
  private jumpHeight = 2 // Maximum jump height
  private deltaTime = 0
  private velocity = new THREE.Vector3()
  private jumpForce = 0.2
  private isFlipped = false

  // Movement vectors
  private walkDirection = new THREE.Vector3()
  private rotateWalkDirection = new THREE.Quaternion()
  private rotateYAxis = new THREE.Vector3(0, 1, 0)

  constructor(camera: THREE.Camera, orbitControls: OrbitControls, scene: THREE.Scene) {
    this.camera = camera
    this.orbitControls = orbitControls

    // Initialize sprite flipbook - default facing right since that's the original sprite direction
    this.spriteFlipbook = new SpriteFlipbook("/player.png", 6, 2, scene)
    this.spriteFlipbook.loop(this.currentAnimation.tiles, this.ANIMATION_DURATION_SECONDS_IDLE, this.isFacingLeft)
    this.spriteFlipbook.setPosition(0, 1, 0)

    // Initialize jump animation
    this.jumpAnimation = new JumpAnimation(scene)
    this.jumpAnimation.setScale(2, 2, 1) // Slightly smaller scale

    // Set the sprite reference
    this.sprite = this.spriteFlipbook.getSprite()

    // Initialize camera
    this.initCamera()

    // Set up keyboard controls
    document.addEventListener(
      "keydown",
      (event) => {
        const key = event.key.toLowerCase()
        if (
          key === "w" ||
          key === "a" ||
          key === "s" ||
          key === "d" ||
          key === " " ||
          key === "arrowup" ||
          key === "arrowleft" ||
          key === "arrowdown" ||
          key === "arrowright"
        ) {
          event.preventDefault()

          // Map arrow keys and space to WASD
          if (key === "arrowup") this.keysPressed.w = true
          else if (key === "arrowleft") this.keysPressed.a = true
          else if (key === "arrowdown") this.keysPressed.s = true
          else if (key === "arrowright") this.keysPressed.d = true
          else if (key === " ") this.keysPressed.space = true
          else this.keysPressed[key as keyof typeof this.keysPressed] = true
        }
      },
      false,
    )

    document.addEventListener(
      "keyup",
      (event) => {
        const key = event.key.toLowerCase()
        if (
          key === "w" ||
          key === "a" ||
          key === "s" ||
          key === "d" ||
          key === " " ||
          key === "arrowup" ||
          key === "arrowleft" ||
          key === "arrowdown" ||
          key === "arrowright"
        ) {
          // Map arrow keys and space to WASD
          if (key === "arrowup") this.keysPressed.w = false
          else if (key === "arrowleft") this.keysPressed.a = false
          else if (key === "arrowdown") this.keysPressed.s = false
          else if (key === "arrowright") this.keysPressed.d = false
          else if (key === " ") this.keysPressed.space = false
          else this.keysPressed[key as keyof typeof this.keysPressed] = false
        }
      },
      false,
    )

    // Update player position for debugging
    setInterval(() => {
      const pos = this.spriteFlipbook.getPosition()
      const playerPosElement = document.getElementById("player-pos")
      if (playerPosElement) {
        playerPosElement.setAttribute(
          "data-player-pos",
          JSON.stringify({
            x: pos.x,
            y: pos.y,
            z: pos.z,
          }),
        )
      }
    }, 100)
  }

  public update(deltaTime: number) {
    this.deltaTime = deltaTime
    
    // Update state and animation before movement
    this.updateStateAndAnimation()
    
    // Handle movement
    this.move(deltaTime)
    
    // Update physics and jumping
    this.updatePhysics(deltaTime)
    
    // Update animations
    this.spriteFlipbook.update(deltaTime)
    if (this.isJumping) {
      this.updateJumpAnimation()
    }
    
    // Update sprite position
    this.updateSpritePosition()
  }

  private updateStateAndAnimation() {
    // Update facing direction based on movement
    if (this.keysPressed.a) {
      this.isFacingLeft = true
    } else if (this.keysPressed.d) {
      this.isFacingLeft = false
    }

    // Update movement state
    this.isMoving = this.keysPressed.w || this.keysPressed.a || this.keysPressed.s || this.keysPressed.d

    // Only update walking animation if not jumping
    if (!this.isJumping) {
      let nextAnimation: SpriteAnimation
      let animationDuration: number

      if (!this.isMoving) {
        nextAnimation = this.isFacingLeft ? IDLE_LEFT : IDLE_RIGHT
        animationDuration = this.ANIMATION_DURATION_SECONDS_IDLE
      } else {
        nextAnimation = this.isFacingLeft ? WALK_LEFT : WALK_RIGHT
        animationDuration = this.ANIMATION_DURATION_SECONDS_WALK
      }

      // Change animation if needed
      if (
        this.currentAnimation.key !== nextAnimation.key ||
        (this.currentAnimation.key.includes("LEFT") && !this.isFacingLeft) ||
        (this.currentAnimation.key.includes("RIGHT") && this.isFacingLeft)
      ) {
        this.currentAnimation = nextAnimation
        this.spriteFlipbook.loop(this.currentAnimation.tiles, animationDuration, this.isFacingLeft)
      }
    }
  }

  private move(delta: number) {
    if (!this.isMoving) {
      return
    }

    // Get camera direction
    this.camera.getWorldDirection(this.walkDirection)
    this.walkDirection.y = 0 // Ignore y-axis movement
    this.walkDirection.normalize() // Constant movement in all directions

    // Calculate direction offset based on pressed keys
    const offset = this.directionOffset()
    this.rotateWalkDirection.setFromAxisAngle(this.rotateYAxis, offset)
    this.walkDirection.applyQuaternion(this.rotateWalkDirection)

    // Apply movement speed
    this.walkDirection.multiplyScalar(this.MOVEMENT_SPEED_PER_SECOND * delta)

    // Move sprite
    const pos = this.spriteFlipbook.getPosition()
    pos.x += this.walkDirection.x
    pos.z += this.walkDirection.z
    this.spriteFlipbook.setPosition(pos.x, pos.y, pos.z)

    // Update camera position and target while maintaining relative position
    const playerPos = this.spriteFlipbook.getPosition()
    
    // Calculate the current camera offset from the target
    const cameraOffset = new THREE.Vector3()
    cameraOffset.copy(this.camera.position).sub(this.orbitControls.target)
    
    // Update orbit controls target to follow player
    this.orbitControls.target.copy(playerPos)
    
    // Update camera position maintaining the same offset from target
    this.camera.position.copy(playerPos).add(cameraOffset)
  }

  private directionOffset() {
    let directionOffset = 0 // w (forward)

    if (this.keysPressed.w) {
      if (this.keysPressed.a) {
        directionOffset = Math.PI / 4 // w+a (forward+left)
      } else if (this.keysPressed.d) {
        directionOffset = -Math.PI / 4 // w+d (forward+right)
      }
    } else if (this.keysPressed.s) {
      if (this.keysPressed.a) {
        directionOffset = Math.PI / 4 + Math.PI / 2 // s+a (backward+left)
      } else if (this.keysPressed.d) {
        directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d (backward+right)
      } else {
        directionOffset = Math.PI // s (backward)
      }
    } else if (this.keysPressed.a) {
      directionOffset = Math.PI / 2 // a (left)
    } else if (this.keysPressed.d) {
      directionOffset = -Math.PI / 2 // d (right)
    }

    return directionOffset
  }

  private initCamera() {
    // Position camera behind player
    this.orbitControls.target = this.spriteFlipbook.getPosition()
    this.camera.position.z = this.spriteFlipbook.getPosition().z + 10
    this.camera.position.x = this.spriteFlipbook.getPosition().x
    this.camera.position.y = 5

    // Limit camera rotation
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.1 // Prevent looking below ground
    this.orbitControls.minPolarAngle = Math.PI / 6 // Prevent looking too high
  }

  public getSprite(): THREE.Sprite {
    return this.spriteFlipbook.getSprite()
  }

  private updatePhysics(delta: number) {
    const pos = this.spriteFlipbook.getPosition()

    // Handle jump initiation
    if (this.keysPressed.space && !this.isJumping && this.canJump) {
      this.isJumping = true
      this.canJump = false
      this.velocity.y = this.JUMP_FORCE
      this.jumpStartY = pos.y
      this.jumpAnimation.startJump(this.isFacingLeft)
      this.spriteFlipbook.getSprite().visible = false
    }

    // Apply physics if jumping
    if (this.isJumping) {
      // Apply gravity
      this.velocity.y -= this.GRAVITY * delta
      
      // Update position
      pos.y += this.velocity.y * delta
      
      // Check for landing
      if (pos.y <= this.GROUND_Y) {
        pos.y = this.GROUND_Y
        this.isJumping = false
        this.canJump = true
        this.velocity.y = 0
        this.jumpAnimation.stop()
        this.spriteFlipbook.getSprite().visible = true
      }
      
      this.spriteFlipbook.setPosition(pos.x, pos.y, pos.z)
    }
  }

  private updateJumpAnimation() {
    if (this.isJumping) {
      const pos = this.spriteFlipbook.getPosition()
      const maxJumpHeight = this.jumpStartY + (this.JUMP_FORCE * this.JUMP_FORCE) / (2 * this.GRAVITY)
      const jumpProgress = Math.min(
        Math.abs(pos.y - this.jumpStartY) / Math.abs(maxJumpHeight - this.jumpStartY),
        1
      )
      this.jumpAnimation.update(this.deltaTime, jumpProgress)
    }
  }

  private updateSpritePosition() {
    const pos = this.spriteFlipbook.getPosition()
    this.jumpAnimation.setPosition(pos.x, pos.y, pos.z)
  }
}
