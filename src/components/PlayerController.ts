import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { SpriteFlipbook } from "./SpriteFlipbook"
import { IDLE_LEFT, IDLE_RIGHT, WALK_LEFT, WALK_RIGHT, type SpriteAnimation } from "./SpriteAnimation"
import { JumpAnimation } from "./JumpAnimation"
import { AxeAnimation } from "./AxeAnimation"
import { touchInput } from "../lib/input"

export class PlayerController {
  // Constants
  private ANIMATION_DURATION_SECONDS_IDLE = 3
  private ANIMATION_DURATION_SECONDS_WALK = 0.6
  private MOVEMENT_SPEED_PER_SECOND = 4.5
  private JUMP_FORCE = 12
  private GRAVITY = 25
  private JUMP_DURATION = 0.5 // Should match jump animation duration
  private GROUND_Y = 1
  private AXE_THROW_COOLDOWN = 0.5 // Cooldown between throws in seconds

  // Components
  private spriteFlipbook: SpriteFlipbook
  private jumpAnimation: JumpAnimation
  private axeAnimation: AxeAnimation
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
  private lastThrowTime = 0
  private raycaster = new THREE.Raycaster()
  private mouse = new THREE.Vector2()
  private paused = false
  private cameraRight = new THREE.Vector3()
  private moveDir = new THREE.Vector3()

  // Movement vectors
  private walkDirection = new THREE.Vector3()
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
    this.jumpAnimation.setScale(2, 2, 1)

    // Initialize axe animation
    this.axeAnimation = new AxeAnimation(scene)
    this.axeAnimation.setScale(1.8, 1.8, 1) // Slightly smaller axe

    // Set the sprite reference
    this.sprite = this.spriteFlipbook.getSprite()

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

    // Set up mouse controls
    this.setupControls()
  }

  private setupControls() {
    // Add mouse click handler
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault() // Prevent default right-click menu
      this.handleAxeThrow(event)
    }, false)

    // Add mouse move handler
    document.addEventListener('mousemove', (event) => {
      // Update normalized mouse coordinates (-1 to +1)
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }, false)
  }

  public setPaused(paused: boolean) {
    this.paused = paused
  }

  private handleAxeThrow(event: MouseEvent) {
    if (this.paused) return

    const currentTime = performance.now() / 1000 // Convert to seconds
    
    // Check cooldown
    if (currentTime - this.lastThrowTime < this.AXE_THROW_COOLDOWN) {
      return
    }
    
    // Update raycaster with current mouse position and camera
    this.raycaster.setFromCamera(this.mouse, this.camera)
    
    // Create a plane at the player's height to intersect with
    const throwPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.GROUND_Y)
    const targetPoint = new THREE.Vector3()
    
    // Find the intersection point of the ray with the plane
    this.raycaster.ray.intersectPlane(throwPlane, targetPoint)
    
    if (targetPoint) {
      // Calculate throw direction
      const playerPos = this.spriteFlipbook.getPosition()
      const throwDirection = new THREE.Vector3()
        .subVectors(targetPoint, playerPos)
        .normalize()
      
      // Start the throw
      this.axeAnimation.throw(playerPos, throwDirection)
      this.lastThrowTime = currentTime
    }
  }

  private throwAxeInDirection() {
    const currentTime = performance.now() / 1000

    if (currentTime - this.lastThrowTime < this.AXE_THROW_COOLDOWN) {
      return
    }

    const playerPos = this.spriteFlipbook.getPosition()
    const direction = new THREE.Vector3()

    // Throw straight ahead in the camera's horizontal forward direction
    this.camera.getWorldDirection(direction)
    direction.y = 0
    direction.normalize()

    this.axeAnimation.throw(playerPos, direction)
    this.lastThrowTime = currentTime
  }

  public update(deltaTime: number) {
    if (this.paused) return

    this.deltaTime = deltaTime

    if (touchInput.throwQueued) {
      touchInput.throwQueued = false
      this.throwAxeInDirection()
    }
    
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
    if (this.axeAnimation.isActive()) {
      this.axeAnimation.update(deltaTime)
    }
    
    // Update sprite position
    this.updateSpritePosition()
  }

  private updateStateAndAnimation() {
    const keyboardX = (this.keysPressed.d ? 1 : 0) - (this.keysPressed.a ? 1 : 0)
    const touchActive = Math.abs(touchInput.moveX) > 0.01 || Math.abs(touchInput.moveZ) > 0.01
    const moveX = touchActive ? touchInput.moveX : keyboardX

    // Update facing direction based on movement
    if (moveX < -0.01) {
      this.isFacingLeft = true
    } else if (moveX > 0.01) {
      this.isFacingLeft = false
    }

    // Update movement state
    this.isMoving =
      touchActive ||
      this.keysPressed.w ||
      this.keysPressed.a ||
      this.keysPressed.s ||
      this.keysPressed.d

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

    // Compute effective movement input (keyboard or touch)
    const keyboardX = (this.keysPressed.d ? 1 : 0) - (this.keysPressed.a ? 1 : 0)
    const keyboardZ = (this.keysPressed.w ? 1 : 0) - (this.keysPressed.s ? 1 : 0)
    const touchActive = Math.abs(touchInput.moveX) > 0.01 || Math.abs(touchInput.moveZ) > 0.01
    const moveX = touchActive ? touchInput.moveX : keyboardX
    const moveZ = touchActive ? touchInput.moveZ : keyboardZ

    // Camera-relative movement basis (forward and right)
    this.camera.getWorldDirection(this.walkDirection)
    this.walkDirection.y = 0
    this.walkDirection.normalize()
    this.cameraRight.crossVectors(this.walkDirection, this.rotateYAxis)

    // Build world-space movement direction from the analog input
    this.moveDir
      .set(0, 0, 0)
      .addScaledVector(this.walkDirection, moveZ)
      .addScaledVector(this.cameraRight, moveX)

    // Clamp diagonal speed to a constant maximum, keep analog magnitude below it
    const magnitude = this.moveDir.length()
    if (magnitude > 1) {
      this.moveDir.divideScalar(magnitude)
    }

    // Apply movement speed
    this.moveDir.multiplyScalar(this.MOVEMENT_SPEED_PER_SECOND * delta)

    // Move sprite
    const pos = this.spriteFlipbook.getPosition()
    pos.x += this.moveDir.x
    pos.z += this.moveDir.z
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

  public getSprite(): THREE.Sprite {
    return this.spriteFlipbook.getSprite()
  }

  private updatePhysics(delta: number) {
    const pos = this.spriteFlipbook.getPosition()

    // Handle jump initiation
    if ((this.keysPressed.space || touchInput.jump) && !this.isJumping && this.canJump) {
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
