import * as THREE from "three"

export class ZeppelinEntity {
  private sprite: THREE.Sprite
  private material: THREE.SpriteMaterial
  private texture: THREE.Texture
  private currentFrame = 0
  private frameTime = 0
  private isPlaying = false
  
  // Sprite sheet configuration
  private totalFrames = 5 // 5 frames in the sprite sheet
  private frameWidth = 300 // Each frame is 300px wide (1500/5)
  private frameHeight = 150 // Each frame is 150px high
  private animationSpeed = 0.2 // seconds per frame - slower animation for a more majestic feel
  
  // Movement properties
  private position = new THREE.Vector3(0, 10, -20) // Lowered height to be more visible on page load
  private direction = new THREE.Vector3(1, 0, 0) // Start moving right
  private speed = 0.3 // Slower movement speed for background element
  private turnSpeed = 0.01 // How quickly it can change direction
  private turnTimer = 0
  private turnInterval = 5 // Change direction every 5 seconds
  private boundarySize = 80 // Larger boundary for more movement space
  
  constructor(scene: THREE.Scene) {
    // Create texture loader
    const textureLoader = new THREE.TextureLoader()
    this.texture = textureLoader.load(
      "/contact-sprite.png",
      // onLoad callback
      () => {
        console.log("Zeppelin sprite sheet loaded successfully")
      },
      // onProgress callback
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`)
      },
      // onError callback
      (error) => {
        console.error("Error loading sprite sheet:", error)
      }
    )

    // Set up texture properties for pixel art
    this.texture.magFilter = THREE.NearestFilter
    this.texture.minFilter = THREE.NearestFilter
    this.texture.colorSpace = THREE.SRGBColorSpace

    // Set up sprite material
    this.material = new THREE.SpriteMaterial({
      map: this.texture,
      transparent: true,
    })

    // Create sprite
    this.sprite = new THREE.Sprite(this.material)
    this.sprite.scale.set(5, 2.5, 1) // Adjusted scale to make it less flattened (more width, less height)
    scene.add(this.sprite)

    // Set initial position
    this.setPosition(this.position.x, this.position.y, this.position.z)
    
    // Start animation
    this.play()
  }

  public setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z)
    this.sprite.position.copy(this.position)
  }

  public getPosition(): THREE.Vector3 {
    return this.position.clone()
  }

  public play() {
    this.isPlaying = true
  }

  public pause() {
    this.isPlaying = false
  }

  public update(delta: number) {
    if (!this.isPlaying) return

    // Update animation
    this.frameTime += delta
    if (this.frameTime >= this.animationSpeed) {
      this.frameTime = 0
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames
      this.updateFrameUV()
    }

    // Update movement
    this.updateMovement(delta)
  }

  private updateMovement(delta: number) {
    // Update turn timer
    this.turnTimer += delta
    if (this.turnTimer >= this.turnInterval) {
      this.turnTimer = 0
      this.changeDirection()
    }

    // Move in current direction
    const movement = this.direction.clone().multiplyScalar(this.speed * delta)
    this.position.add(movement)

    // Check boundaries and bounce if needed
    if (Math.abs(this.position.x) > this.boundarySize) {
      this.direction.x *= -1
    }
    if (Math.abs(this.position.z) > this.boundarySize) {
      this.direction.z *= -1
    }

    // Update sprite position
    this.sprite.position.copy(this.position)

    // Update sprite rotation to face movement direction
    const angle = Math.atan2(this.direction.x, this.direction.z)
    this.sprite.rotation.y = angle
  }

  private changeDirection() {
    // Randomly change direction
    const randomAngle = (Math.random() - 0.5) * Math.PI / 2 // Up to 90 degrees
    const rotationMatrix = new THREE.Matrix4().makeRotationY(randomAngle)
    this.direction.applyMatrix4(rotationMatrix)
    this.direction.normalize()
  }

  private updateFrameUV() {
    // Calculate the position in the sprite sheet
    // The sprite sheet is 1500px wide with 5 frames, each 300px wide
    const frameWidth = 300 / 1500 // Normalized width of a single frame
    
    // Apply the offset to the texture
    this.texture.offset.set(this.currentFrame * frameWidth, 0)
    
    // Set the repeat to show only one frame
    this.texture.repeat.set(frameWidth, 1)
  }

  public getSprite(): THREE.Sprite {
    return this.sprite
  }
} 